"""CRM endpoints. Every route requires a signed-in staff member."""

from flask import Blueprint, request

from app.core.auth import authenticate_staff

bp = Blueprint("staff", __name__)


@bp.before_request
def _authenticate():
    if request.method != "OPTIONS":  # CORS preflights carry no token
        authenticate_staff()


from app.api.staff import applications, clients, loans, messages, reports  # noqa: E402, F401
