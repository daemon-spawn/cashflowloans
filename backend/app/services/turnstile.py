import httpx
from flask import current_app

from app.core.errors import ApiError

VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify"


def verify_turnstile(token: str | None, remote_ip: str | None) -> None:
    """Spam protection for public forms. Skipped when no secret is configured (local dev)."""
    secret = current_app.config["TURNSTILE_SECRET_KEY"]
    if not secret:
        return
    if not token:
        raise ApiError("Please complete the spam check.", 400)
    res = httpx.post(
        VERIFY_URL, data={"secret": secret, "response": token, "remoteip": remote_ip}, timeout=10
    )
    if not res.json().get("success"):
        raise ApiError("Spam check failed. Please try again.", 400)
