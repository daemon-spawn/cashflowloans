from flask import Blueprint
from sqlalchemy import text

from app.extensions import db, limiter

bp = Blueprint("health", __name__)


@bp.get("/health")
@limiter.exempt
def health():
    db.session.execute(text("SELECT 1"))
    return {"status": "ok"}
