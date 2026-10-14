import json

from flask import g, request
from sqlalchemy import or_, select
from sqlalchemy.orm import selectinload

from app.api.staff import bp
from app.api.staff._util import get_or_404, parse
from app.core.errors import ApiError
from app.extensions import db
from app.models import Activity, Application, ApplicationStatus, Client, Loan, Note
from app.schemas.serializers import (
    activity_out,
    application_out,
    client_out,
    document_out,
    loan_out,
    note_out,
)
from app.schemas.staff import DocumentKindIn, StaffApplicationIn, StatusIn
from app.services import loans as loan_service
from app.services.applications import create_application, store_documents
from app.services.storage import get_storage
from app.services.uploads import collect_single, collect_uploads


def _get(application_id: str) -> Application:
    return get_or_404(
        Application,
        application_id,
        "Application",
        options=[
            selectinload(Application.documents),
            selectinload(Application.client),
            selectinload(Application.loan),
        ],
    )


@bp.get("/applications")
def list_applications():
    query = (
        select(Application)
        .options(selectinload(Application.client), selectinload(Application.loan))
        .order_by(Application.created_at.desc())
    )
    if status := request.args.get("status"):
        try:
            query = query.where(Application.status == ApplicationStatus(status))
        except ValueError as exc:
            raise ApiError("Unknown status", 422) from exc
    if q := (request.args.get("q") or "").strip():
        like = f"%{q}%"
        query = query.join(Application.client).where(
            or_(
                Application.reference.ilike(like),
                Client.first_name.ilike(like),
                Client.last_name.ilike(like),
                Client.id_number.ilike(like),
                Client.phone.ilike(like),
                Client.email.ilike(like),
            )
        )
    return {"items": [application_out(a) for a in db.session.scalars(query.limit(500))]}


@bp.get("/applications/<application_id>")
def get_application(application_id: str):
    app = _get(application_id)
    storage = get_storage()
    notes = db.session.scalars(
        select(Note).where(Note.application_id == app.id).order_by(Note.created_at.desc())
    ).all()
    activity = db.session.scalars(
        select(Activity).where(Activity.application_id == app.id).order_by(Activity.created_at.desc())
    ).all()
    previous = db.session.scalars(
        select(Loan)
        .where(Loan.client_id == app.client_id, Loan.application_id != app.id)
        .options(selectinload(Loan.payments), selectinload(Loan.application), selectinload(Loan.client))
        .order_by(Loan.created_at.desc())
    ).all()
    loan = None
    if app.loan:
        status, ledger = loan_service.current_state(app.loan)
        loan = loan_out(app.loan, status, ledger)
    return {
        **application_out(app),
        "client": client_out(app.client),
        "documents": [document_out(d, storage.signed_url(d.storage_path)) for d in app.documents],
        "notes": [note_out(n) for n in notes],
        "activity": [activity_out(a) for a in activity],
        "loan": loan,
        "otherLoans": [loan_out(ln, *loan_service.current_state(ln)) for ln in previous],
    }


@bp.patch("/applications/<application_id>/status")
def update_application_status(application_id: str):
    body = parse(StatusIn)
    app = _get(application_id)
    loan_service.set_application_status(
        app, body.status, g.staff_email, decline_reason=body.decline_reason, override=body.override
    )
    return application_out(app)


@bp.post("/applications")
def create_staff_application():
    """multipart/form-data like the website form: `data` (JSON) plus optional documents."""
    try:
        payload = json.loads(request.form.get("data", ""))
    except json.JSONDecodeError as exc:
        raise ApiError("Invalid application data.", 400) from exc
    data = parse(StaffApplicationIn, payload)
    uploads = collect_uploads(request.files, data.loan_type, required=False)
    application = create_application(data, uploads, source=data.source, actor=g.staff_email)
    return application_out(application), 201


@bp.post("/applications/<application_id>/documents")
def upload_application_document(application_id: str):
    app = _get(application_id)
    body = parse(DocumentKindIn, request.form.to_dict())
    upload = collect_single(request.files, body.kind)
    uploaded: list[str] = []
    try:
        store_documents(app.client, app, [upload], uploaded)
        db.session.commit()
    except Exception as exc:
        db.session.rollback()
        get_storage().delete(uploaded)
        raise ApiError("We couldn't save the document. Please try again.", 503) from exc
    return {"ok": True}, 201
