import io
import json
from datetime import timedelta

import pytest

from app.core import clock
from app.services import reminders
from tests.test_public_applications import JPG, PDF, payload, post, unsecured_files

TODAY = clock.today()


def apply(client, **overrides) -> str:
    res = post(client, payload(**overrides), unsecured_files())
    assert res.status_code == 201
    return res.get_json()["reference"]


def app_id(client, headers, reference):
    items = client.get(f"/v1/applications?q={reference}", headers=headers).get_json()["items"]
    return items[0]["id"]


def approve(client, headers, aid, **body):
    return client.patch(
        f"/v1/applications/{aid}/status", json={"status": "approved", **body}, headers=headers
    )


def approved_loan(client, headers, amount=2000) -> str:
    aid = app_id(client, headers, apply(client, amount=amount))
    assert approve(client, headers, aid).status_code == 200
    return client.get(f"/v1/applications/{aid}", headers=headers).get_json()["loan"]["id"]


def pay_out(client, headers, loan_id, paid_out_on, due_date):
    return client.post(
        f"/v1/loans/{loan_id}/payout",
        json={"paidOutOn": paid_out_on.isoformat(), "dueDate": due_date.isoformat()},
        headers=headers,
    )


def test_approving_creates_the_loan_and_emails_the_applicant(client, staff_headers, outbox):
    aid = app_id(client, staff_headers, apply(client, amount=3000))
    assert approve(client, staff_headers, aid).status_code == 200

    loan = client.get(f"/v1/applications/{aid}", headers=staff_headers).get_json()["loan"]
    assert loan["status"] == "pending_payout"
    assert loan["principal"] == "3000.00" and loan["fee"] == "1500.00" and loan["totalRepayable"] == "4500.00"
    assert any("approved" in m["Subject"] for m in outbox)
    assert outbox[-1]["To"] == "thandi@example.com"


def test_moving_an_approved_application_back_cancels_the_pending_loan(client, staff_headers):
    aid = app_id(client, staff_headers, apply(client))
    approve(client, staff_headers, aid)
    res = client.patch(f"/v1/applications/{aid}/status", json={"status": "in_review"}, headers=staff_headers)
    assert res.status_code == 200
    assert client.get(f"/v1/applications/{aid}", headers=staff_headers).get_json()["loan"] is None


def test_decline_keeps_the_record_with_a_reason(client, staff_headers, outbox):
    aid = app_id(client, staff_headers, apply(client))
    res = client.patch(
        f"/v1/applications/{aid}/status",
        json={"status": "declined", "declineReason": "Affordability"},
        headers=staff_headers,
    )
    assert res.get_json()["declineReason"] == "Affordability"
    assert any("Your loan application" in m["Subject"] for m in outbox)


def test_payout_starts_the_one_month_term(client, staff_headers, outbox):
    loan_id = approved_loan(client, staff_headers)
    res = client.post(f"/v1/loans/{loan_id}/payout", json={}, headers=staff_headers)
    loan = res.get_json()
    assert res.status_code == 200
    assert loan["paidOutOn"] == TODAY.isoformat()
    # The applicant asked for 20 days, which is inside the month, so that date is kept.
    assert loan["dueDate"] == (TODAY + timedelta(days=20)).isoformat()
    assert loan["status"] == "active" and loan["balance"] == "3000.00"
    assert "paid out" in outbox[-1]["Subject"]
    # Can't pay out twice, and the application can no longer move.
    assert client.post(f"/v1/loans/{loan_id}/payout", json={}, headers=staff_headers).status_code == 409


def test_payments_reduce_the_balance_and_settle_the_loan(client, staff_headers, outbox):
    loan_id = approved_loan(client, staff_headers, amount=1000)
    pay_out(client, staff_headers, loan_id, TODAY - timedelta(days=5), TODAY + timedelta(days=20))

    res = client.post(f"/v1/loans/{loan_id}/payments", json={"amount": 2000}, headers=staff_headers)
    assert res.status_code == 422  # more than the R1,500 owed

    res = client.post(
        f"/v1/loans/{loan_id}/payments",
        json={"amount": 500, "method": "eft", "reference": "FNB 1"},
        headers=staff_headers,
    )
    assert res.status_code == 201 and res.get_json()["loan"]["balance"] == "1000.00"

    res = client.post(f"/v1/loans/{loan_id}/payments", json={"amount": 1000}, headers=staff_headers)
    loan = res.get_json()["loan"]
    assert loan["status"] == "paid" and loan["balance"] == "0.00"
    assert "paid in full" in outbox[-1]["Subject"]
    kinds = [a["kind"] for a in loan["activity"]]
    assert "loan_paid" in kinds and kinds.count("payment") == 2


def test_overdue_loan_gets_late_charges_and_reminders_once(app, client, staff_headers, outbox):
    loan_id = approved_loan(client, staff_headers, amount=1000)
    pay_out(client, staff_headers, loan_id, TODAY - timedelta(days=30), TODAY - timedelta(days=2))
    loan = client.get(f"/v1/loans/{loan_id}", headers=staff_headers).get_json()
    assert loan["status"] == "overdue" and loan["balance"] == "2250.00" and loan["missedPeriods"] == 1

    outbox.clear()
    summary = reminders.run()
    assert summary["overdue"] == 1 and summary["remindersSent"] == 1 and summary["digestSent"]
    subjects = [m["Subject"] for m in outbox]
    assert any("overdue" in s for s in subjects) and any("Daily summary" in s for s in subjects)

    outbox.clear()
    assert reminders.run()["remindersSent"] == 0 and outbox == []  # same day: nothing new


def test_due_tomorrow_reminder(client, staff_headers, outbox):
    loan_id = approved_loan(client, staff_headers)
    pay_out(client, staff_headers, loan_id, TODAY - timedelta(days=10), TODAY + timedelta(days=1))
    outbox.clear()
    assert reminders.run()["dueTomorrow"] == 1
    assert any("due tomorrow" in m["Subject"] for m in outbox)


def test_write_off_and_blacklist_override(client, staff_headers):
    loan_id = approved_loan(client, staff_headers)
    pay_out(client, staff_headers, loan_id, TODAY - timedelta(days=40), TODAY - timedelta(days=10))
    res = client.post(f"/v1/loans/{loan_id}/write-off", json={"reason": "Unreachable"}, headers=staff_headers)
    loan = res.get_json()
    assert loan["status"] == "written_off"

    client_id = loan["client"]["id"]
    res = client.post(
        f"/v1/clients/{client_id}/blacklist",
        json={"blacklisted": True, "reason": "Defaulted"},
        headers=staff_headers,
    )
    assert res.get_json()["blacklisted"] is True

    aid = app_id(client, staff_headers, apply(client))
    assert approve(client, staff_headers, aid).status_code == 409
    assert approve(client, staff_headers, aid, override=True).status_code == 200


def test_collateral_tracking_for_secured_loans(client, staff_headers):
    files = {"idDocument": (io.BytesIO(PDF), "id.pdf"), "collateralImages": [(io.BytesIO(JPG), "a.jpg")]}
    reference = post(client, payload(loanType="secured", amount=5000), files).get_json()["reference"]
    aid = app_id(client, staff_headers, reference)
    approve(client, staff_headers, aid)
    loan = client.get(f"/v1/applications/{aid}", headers=staff_headers).get_json()["loan"]
    assert loan["collateralStatus"] == "awaiting_collection"

    res = client.patch(
        f"/v1/loans/{loan['id']}/collateral",
        json={"status": "held", "description": "Samsung A54, IMEI 3567…"},
        headers=staff_headers,
    )
    assert res.get_json()["collateralStatus"] == "held"


def test_staff_can_enter_a_phone_application_without_documents(client, staff_headers, outbox):
    data = payload(source="whatsapp", idNumber="9001014800089", email="sipho@example.com")
    res = client.post(
        "/v1/applications",
        data={"data": json.dumps(data)},
        content_type="multipart/form-data",
        headers=staff_headers,
    )
    assert res.status_code == 201
    assert res.get_json()["source"] == "whatsapp"
    assert not any("New unsecured application" in m["Subject"] for m in outbox)  # no owner alert

    res = client.post(
        f"/v1/applications/{res.get_json()['id']}/documents",
        data={"kind": "id_document", "file": (io.BytesIO(PDF), "id.pdf")},
        content_type="multipart/form-data",
        headers=staff_headers,
    )
    assert res.status_code == 201


def test_clients_notes_and_reports(client, staff_headers):
    loan_id = approved_loan(client, staff_headers, amount=1000)
    pay_out(client, staff_headers, loan_id, TODAY - timedelta(days=5), TODAY + timedelta(days=2))
    client.post(f"/v1/loans/{loan_id}/payments", json={"amount": 600}, headers=staff_headers)

    clients = client.get("/v1/clients?q=Mokoena", headers=staff_headers).get_json()["items"]
    assert clients[0]["standing"] == "due" and clients[0]["outstanding"] == "900.00"
    cid = clients[0]["id"]

    assert (
        client.post(
            f"/v1/clients/{cid}/notes", json={"body": "Called, will pay Friday"}, headers=staff_headers
        ).status_code
        == 201
    )
    assert (
        client.patch(f"/v1/clients/{cid}", json={"phone": "082 123 4567"}, headers=staff_headers).status_code
        == 200
    )
    detail = client.get(f"/v1/clients/{cid}", headers=staff_headers).get_json()
    assert detail["phone"] == "0821234567" and detail["notes"][0]["body"] == "Called, will pay Friday"
    assert {"payment", "client_updated", "loan_paid_out"} <= {a["kind"] for a in detail["activity"]}

    overview = client.get("/v1/reports/overview", headers=staff_headers).get_json()
    assert overview["totals"]["loaned"] == "1000.00" and overview["totals"]["collected"] == "600.00"
    assert overview["totals"]["outstanding"] == "900.00" and len(overview["dueSoon"]) == 1
    top = client.get("/v1/reports/analytics?timeframe=all", headers=staff_headers).get_json()["topClients"]
    assert top[0]["repaid"] == "600.00"


def test_messages_can_be_marked_handled(client, staff_headers):
    client.post(
        "/v1/public/contact", json={"name": "Sipho", "email": "s@example.com", "message": "Hello there"}
    )
    mid = client.get("/v1/messages", headers=staff_headers).get_json()["items"][0]["id"]
    res = client.patch(f"/v1/messages/{mid}", json={"status": "handled"}, headers=staff_headers)
    assert res.get_json()["status"] == "handled"
    assert client.get("/v1/messages?status=new", headers=staff_headers).get_json()["items"] == []


@pytest.mark.parametrize("path", ["/v1/loans", "/v1/clients", "/v1/reports/overview", "/v1/settings"])
def test_new_staff_routes_require_sign_in(client, path):
    assert client.get(path).status_code == 401
