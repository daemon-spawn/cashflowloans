import json

from tests.test_public_applications import payload, unsecured_files


def test_staff_routes_require_token(client):
    assert client.get("/v1/applications").status_code == 401
    assert client.get("/v1/messages").status_code == 401


def test_non_staff_user_forbidden(client, staff_headers):
    res = client.get("/v1/applications", headers={"Authorization": "Bearer stranger@example.com"})
    assert res.status_code == 403


def test_cors_preflight_not_blocked(client):
    res = client.options(
        "/v1/applications",
        headers={"Origin": "http://localhost:3001", "Access-Control-Request-Method": "GET"},
    )
    assert res.status_code == 200


def test_staff_can_review_application(client, staff_headers):
    client.post(
        "/v1/public/applications",
        data={"data": json.dumps(payload()), **unsecured_files()},
        content_type="multipart/form-data",
    )

    items = client.get("/v1/applications", headers=staff_headers).get_json()["items"]
    assert len(items) == 1
    app_id = items[0]["id"]

    detail = client.get(f"/v1/applications/{app_id}", headers=staff_headers).get_json()
    assert len(detail["documents"]) == 3
    assert all(d["url"] for d in detail["documents"])

    res = client.patch(
        f"/v1/applications/{app_id}/status", json={"status": "approved"}, headers=staff_headers
    )
    assert res.status_code == 200
    assert res.get_json()["status"] == "approved"
