"""Supabase wiring that can't be exercised against the real project in CI."""

import httpx
import jwt
import pytest

from app.core import auth
from app.core.errors import ApiError
from app.services.storage import SupabaseStorage


@pytest.fixture
def supabase(app):
    app.config.update(SUPABASE_URL="https://example.supabase.co", SUPABASE_SERVICE_ROLE_KEY="sb_secret_test")
    return app


def test_hs256_tokens_are_checked_with_supabase_auth(supabase, monkeypatch):
    token = jwt.encode(
        {"email": "owner@example.com", "aud": "authenticated"}, "legacy-test-secret-at-least-32-bytes!", algorithm="HS256"
    )
    calls = []

    def fake_get(url, headers, timeout):
        calls.append((url, headers))
        return httpx.Response(200, json={"email": "owner@example.com"})

    monkeypatch.setattr(auth.httpx, "get", fake_get)
    assert auth.verify_token(token)["email"] == "owner@example.com"
    url, headers = calls[0]
    assert url == "https://example.supabase.co/auth/v1/user"
    assert headers["Authorization"] == f"Bearer {token}" and headers["apikey"] == "sb_secret_test"


def test_hs256_token_rejected_when_supabase_says_no(supabase, monkeypatch):
    token = jwt.encode({"email": "x@example.com"}, "legacy-test-secret-at-least-32-bytes!", algorithm="HS256")
    monkeypatch.setattr(auth.httpx, "get", lambda *a, **k: httpx.Response(401, json={"msg": "bad jwt"}))
    with pytest.raises(ApiError) as err:
        auth.verify_token(token)
    assert err.value.status == 401


def test_garbage_token_rejected(supabase):
    with pytest.raises(ApiError):
        auth.verify_token("not-a-jwt")


@pytest.mark.parametrize(
    ("key", "expects_bearer"),
    [("sb_secret_abc", False), ("eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIn0.sig", True)],
)
def test_storage_headers_for_new_and_legacy_keys(key, expects_bearer):
    storage = SupabaseStorage("https://example.supabase.co", key, "documents")
    assert storage.http.headers["apikey"] == key
    assert ("authorization" in storage.http.headers) is expects_bearer


def test_ensure_bucket_creates_a_private_bucket_once():
    created = []

    def handler(request: httpx.Request) -> httpx.Response:
        if request.method == "GET":
            return httpx.Response(200 if created else 400, json={})
        created.append(request.read())
        return httpx.Response(200, json={"name": "documents"})

    storage = SupabaseStorage("https://example.supabase.co", "sb_secret_abc", "documents")
    storage.http = httpx.Client(transport=httpx.MockTransport(handler), headers=storage.http.headers)
    assert storage.ensure_bucket() == "created"
    assert b'"public":false' in created[0].replace(b" ", b"")
    assert storage.ensure_bucket() == "exists"
