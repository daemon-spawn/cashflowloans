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
