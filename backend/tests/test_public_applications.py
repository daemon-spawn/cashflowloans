import io
import json
from datetime import date, timedelta

from app.extensions import db
from app.models import Application, Client, Document

PDF = b"%PDF-1.7 test"
JPG = b"\xff\xd8\xff\xe0 test"
VALID_ID = "8001015009087"


def payload(**overrides):
    data = {
        "loanType": "unsecured",
        "amount": 2000,
        "repaymentDate": (date.today() + timedelta(days=20)).isoformat(),
        "firstName": "Thandi",
        "lastName": "Mokoena",
        "idNumber": VALID_ID,
        "phone": "0614011426",
        "email": "Thandi@example.com",
        "acceptedTerms": True,
    }
    return {**data, **overrides}


def unsecured_files():
    return {
        "idDocument": (io.BytesIO(PDF), "id.pdf"),
        "payslip": (io.BytesIO(PDF), "payslip.pdf"),
        "bankStatement": (io.BytesIO(PDF), "statement.pdf"),
    }


def post(client, data, files):
    return client.post(
        "/v1/public/applications",
        data={"data": json.dumps(data), **files},
        content_type="multipart/form-data",
    )


def test_unsecured_application_is_stored_with_documents(client, storage):
    res = post(client, payload(), unsecured_files())

    assert res.status_code == 201
    reference = res.get_json()["reference"]
    application = db.session.query(Application).filter_by(reference=reference).one()
    assert application.status.value == "new"
    assert application.client.email == "thandi@example.com"
    assert {d.kind.value for d in application.documents} == {"id_document", "payslip", "bank_statement"}
    assert len(storage.files) == 3


def test_secured_application_accepts_collateral_photos(client):
    files = {
        "idDocument": (io.BytesIO(PDF), "id.pdf"),
        "collateralImages": [(io.BytesIO(JPG), "a.jpg"), (io.BytesIO(JPG), "b.jpg")],
    }
    res = post(client, payload(loanType="secured", amount=1500), files)

    assert res.status_code == 201
    assert db.session.query(Document).filter_by(kind="collateral_image").count() == 2


def test_secured_minimum_amount_enforced(client):
    files = {"idDocument": (io.BytesIO(PDF), "id.pdf"), "collateralImages": (io.BytesIO(JPG), "a.jpg")}
    res = post(client, payload(loanType="secured", amount=300), files)

    assert res.status_code == 422


def test_unsecured_maximum_amount_enforced(client):
    res = post(client, payload(amount=10_500), unsecured_files())

    assert res.status_code == 422


def test_secured_allows_up_to_100000(client):
    files = {"idDocument": (io.BytesIO(PDF), "id.pdf"), "collateralImages": (io.BytesIO(JPG), "a.jpg")}
    assert post(client, payload(loanType="secured", amount=100_000), files).status_code == 201


def test_invalid_id_number_rejected(client):
    res = post(client, payload(idNumber="8001015009080"), unsecured_files())

    assert res.status_code == 422
    assert "idNumber" in res.get_json()["fields"]


def test_missing_documents_rejected_and_nothing_saved(client, storage):
    res = post(client, payload(), {"idDocument": (io.BytesIO(PDF), "id.pdf")})

    assert res.status_code == 422
    assert set(res.get_json()["fields"]) == {"payslip", "bankStatement"}
    assert db.session.query(Application).count() == 0
    assert storage.files == {}


def test_disguised_file_type_rejected(client):
    files = unsecured_files()
    files["bankStatement"] = (io.BytesIO(b"MZ\x90 not a pdf"), "statement.pdf")
    res = post(client, payload(), files)

    assert res.status_code == 422
    assert "bankStatement" in res.get_json()["fields"]


def test_repeat_applicant_reuses_client_record(client):
    assert post(client, payload(), unsecured_files()).status_code == 201
    assert post(client, payload(email="new@example.com", amount=500), unsecured_files()).status_code == 201

    clients = db.session.query(Client).all()
    assert len(clients) == 1
    assert clients[0].email == "new@example.com"
    assert len(clients[0].applications) == 2


def test_storage_failure_rolls_back(client, storage, monkeypatch):
    def boom(*args, **kwargs):
        raise RuntimeError("storage down")

    monkeypatch.setattr(storage, "upload", boom)
    res = post(client, payload(), unsecured_files())

    assert res.status_code == 503
    assert db.session.query(Application).count() == 0
