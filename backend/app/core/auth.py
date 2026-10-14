"""
Staff authentication. The CRM signs staff in with Supabase Auth and sends the
access token; we verify it against the project's JWKS and an email allowlist.
"""

from functools import lru_cache, wraps

import httpx
import jwt
from flask import current_app, g, request

from app.core.errors import ApiError


@lru_cache(maxsize=1)
def _jwks_client(supabase_url: str) -> jwt.PyJWKClient:
    return jwt.PyJWKClient(f"{supabase_url}/auth/v1/.well-known/jwks.json", cache_keys=True)


def verify_token(token: str) -> dict:
    """
    Projects with asymmetric JWT signing keys (the Supabase default) are verified
    locally against the JWKS. Projects still on the legacy shared secret (HS256)
    are verified by asking Supabase Auth who the token belongs to.
    """
    supabase_url = current_app.config["SUPABASE_URL"]
    if not supabase_url:
        raise ApiError("Authentication is not configured", 503)
    try:
        alg = jwt.get_unverified_header(token).get("alg")
    except jwt.PyJWTError as exc:
        raise ApiError("Invalid or expired session", 401) from exc

    if alg == "HS256":
        return _verify_with_auth_server(supabase_url, token)
    try:
        key = _jwks_client(supabase_url).get_signing_key_from_jwt(token)
        return jwt.decode(token, key.key, algorithms=["ES256", "RS256"], audience="authenticated")
    except jwt.PyJWTError as exc:
        raise ApiError("Invalid or expired session", 401) from exc


def _verify_with_auth_server(supabase_url: str, token: str) -> dict:
    try:
        res = httpx.get(
            f"{supabase_url}/auth/v1/user",
            headers={
                "Authorization": f"Bearer {token}",
                "apikey": current_app.config["SUPABASE_SERVICE_ROLE_KEY"],
            },
            timeout=10,
        )
    except httpx.HTTPError as exc:
        raise ApiError("Couldn't check your session. Please try again.", 503) from exc
    if res.status_code != 200:
        raise ApiError("Invalid or expired session", 401)
    return {"email": res.json().get("email")}


def authenticate_staff() -> str:
    """Verify the bearer token and allowlist; stores the email on flask.g."""
    header = request.headers.get("Authorization", "")
    if not header.startswith("Bearer "):
        raise ApiError("Authentication required", 401)

    claims = verify_token(header.removeprefix("Bearer "))
    email = (claims.get("email") or "").lower()
    if email not in current_app.config["STAFF_EMAILS"]:
        raise ApiError("You do not have access to the CRM", 403)

    g.staff_email = email
    return email


def require_staff(view):
    @wraps(view)
    def wrapper(*args, **kwargs):
        authenticate_staff()
        return view(*args, **kwargs)

    return wrapper
