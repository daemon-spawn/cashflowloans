from app.extensions import db
from app.models import ContactMessage


def test_contact_message_saved(client):
    res = client.post(
        "/v1/public/contact",
        json={"name": "Sipho", "email": "sipho@example.com", "message": "Do you do weekend payouts?"},
    )

    assert res.status_code == 201
    assert db.session.query(ContactMessage).one().status.value == "new"


def test_contact_validation(client):
    res = client.post("/v1/public/contact", json={"name": "", "email": "nope", "message": "hi"})

    assert res.status_code == 422
    assert {"name", "email", "message"} <= set(res.get_json()["fields"])
