import pytest

from app import create_app
from app.config import TestConfig
from app.extensions import db


@pytest.fixture
def app():
    app = create_app(TestConfig)
    with app.app_context():
        db.create_all()
        yield app
        db.session.remove()  # release locks so drop_all doesn't wait on Postgres
        db.drop_all()


@pytest.fixture
def client(app):
    return app.test_client()


@pytest.fixture
def storage(app):
    return app.extensions["storage"]


@pytest.fixture
def staff_headers(monkeypatch):
    """Bypass JWKS verification and return headers for an allowlisted staff member."""
    monkeypatch.setattr("app.core.auth.verify_token", lambda token: {"email": token})
    return {"Authorization": "Bearer owner@example.com"}


class _FakeSMTP:
    sent: list = []

    def __init__(self, *args, **kwargs):
        pass

    def __enter__(self):
        return self

    def __exit__(self, *exc):
        return False

    def starttls(self):
        pass

    def login(self, *args):
        pass

    def send_message(self, msg):
        _FakeSMTP.sent.append(msg)


@pytest.fixture
def outbox(app, monkeypatch):
    """Turns email on and captures every message instead of sending it."""
    _FakeSMTP.sent = []
    app.config.update(SMTP_HOST="smtp.test", SMTP_USERNAME="crm@test", SMTP_PASSWORD="x")
    monkeypatch.setattr("app.services.notifications.smtplib.SMTP", _FakeSMTP)
    return _FakeSMTP.sent
