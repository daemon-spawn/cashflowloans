"""Unauthenticated endpoints used by the website. Write-only and rate-limited."""

from flask import Blueprint

bp = Blueprint("public", __name__)

from app.api.public import applications, contact  # noqa: E402, F401
