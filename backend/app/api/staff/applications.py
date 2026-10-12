import uuid

from flask import g, request
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.api.staff import bp
from app.core.errors import ApiError
from app.extensions import db
from app.models import Application, ApplicationStatus
from app.schemas.serializers import application_out, client_out, document_out
from app.services.storage import get_storage


def _get(application_id: str) -> Application:
    try:
        key = uuid.UUID(application_id)
    except ValueError as exc:
        raise ApiError("Application not found", 404) from exc
    app = db.session.get(Application, key, options=[selectinload(Application.documents)])
    if app is None:
        raise ApiError("Application not found", 404)
    return app


@bp.get("/applications")
def list_applications():
    query = (
        select(Application).options(selectinload(Application.client)).order_by(Application.created_at.desc())
    )
    if status := request.args.get("status"):
        query = query.where(Application.status == ApplicationStatus(status))
    return {"items": [application_out(a) for a in db.session.scalars(query.limit(500))]}


@bp.get("/applications/<application_id>")
def get_application(application_id: str):
    app = _get(application_id)
    storage = get_storage()
    return {
        **application_out(app),
        "client": client_out(app.client),
        "documents": [document_out(d, storage.signed_url(d.storage_path)) for d in app.documents],
    }


@bp.patch("/applications/<application_id>/status")
def update_application_status(application_id: str):
    body = request.get_json(silent=True) or {}
    try:
        status = ApplicationStatus(body.get("status"))
    except ValueError as exc:
        raise ApiError(
            f"status must be one of: {', '.join(s.value for s in ApplicationStatus)}", 422
        ) from exc

    app = _get(application_id)
    app.status = status
    app.reviewed_by = g.staff_email
    app.decline_reason = body.get("declineReason") if status == ApplicationStatus.DECLINED else None
    db.session.commit()
    return application_out(app)
