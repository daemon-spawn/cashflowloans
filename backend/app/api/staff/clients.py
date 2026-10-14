from flask import g, request
from sqlalchemy import or_, select
from sqlalchemy.orm import selectinload

from app.api.staff import bp
from app.api.staff._util import get_or_404, parse
from app.core import loan_rules
from app.core.errors import ApiError
from app.extensions import db
from app.models import Activity, Application, ApplicationStatus, Client, Loan, LoanStatus
from app.schemas.serializers import (
    activity_out,
    application_out,
    client_out,
    document_out,
    loan_out,
    note_out,
)
from app.schemas.staff import BlacklistIn, ClientUpdateIn, DocumentKindIn, NoteIn
from app.services import clients as service
from app.services import loans as loan_service
from app.services.applications import store_documents
from app.services.storage import get_storage
from app.services.uploads import collect_single

# Most urgent first: a client's overall standing is their most urgent loan or application.
_STANDING = [
    "overdue",
    "due",
    "active",
    "pending_payout",
    "applicant",
    "written_off",
    "paid",
    "declined",
    "none",
]


def _standing(client: Client, loan_states: list[LoanStatus]) -> str:
    found = {s.value for s in loan_states}
    if any(a.status in (ApplicationStatus.NEW, ApplicationStatus.IN_REVIEW) for a in client.applications):
        found.add("applicant")
    if any(a.status == ApplicationStatus.DECLINED for a in client.applications):
        found.add("declined")
    return next((s for s in _STANDING if s in found), "none")


def _summary(client: Client) -> dict:
    states = [loan_service.current_state(ln) for ln in client.loans]
    open_ = [lg.balance for st, lg in states if st in (LoanStatus.ACTIVE, LoanStatus.DUE, LoanStatus.OVERDUE)]
    paid_out = [ln for ln in client.loans if ln.disbursed_at]
    return {
        **client_out(client),
        "standing": _standing(client, [st for st, _ in states]),
        "applications": len(client.applications),
        "loans": len(client.loans),
        "borrowed": str(loan_rules.money(sum((ln.principal for ln in paid_out), 0))),
        "repaid": str(loan_rules.money(sum((lg.paid for _, lg in states), 0))),
        "outstanding": str(loan_rules.money(sum(open_, 0))),
        "nextDueDate": min(
            (
                ln.due_date.isoformat()
                for ln, (st, _) in zip(client.loans, states, strict=True)
                if ln.due_date and st in (LoanStatus.ACTIVE, LoanStatus.DUE, LoanStatus.OVERDUE)
            ),
            default=None,
        ),
    }


def _get(client_id: str) -> Client:
    return get_or_404(Client, client_id, "Client")


@bp.get("/clients")
def list_clients():
    query = (
        select(Client)
        .options(
            selectinload(Client.applications),
            selectinload(Client.loans).selectinload(Loan.payments),
            selectinload(Client.loans).selectinload(Loan.application),
        )
        .order_by(Client.created_at.desc())
    )
    if q := (request.args.get("q") or "").strip():
        like = f"%{q}%"
        query = query.where(
            or_(
                Client.first_name.ilike(like),
                Client.last_name.ilike(like),
                Client.id_number.ilike(like),
                Client.phone.ilike(like),
                Client.email.ilike(like),
            )
        )
    items = [_summary(c) for c in db.session.scalars(query.limit(2000))]
    if standing := request.args.get("standing"):
        items = [c for c in items if c["standing"] == standing]
    if request.args.get("blacklisted") == "true":
        items = [c for c in items if c["blacklisted"]]
    return {"items": items}


@bp.get("/clients/<client_id>")
def get_client(client_id: str):
    client = _get(client_id)
    storage = get_storage()
    activity = db.session.scalars(
        select(Activity)
        .where(Activity.client_id == client.id)
        .order_by(Activity.created_at.desc())
        .limit(200)
    ).all()
    return {
        **_summary(client),
        "applicationList": [application_out(a) for a in client.applications],
        "loanList": [loan_out(ln, *loan_service.current_state(ln)) for ln in client.loans],
        "notes": [note_out(n) for n in client.notes],
        "documents": [document_out(d, storage.signed_url(d.storage_path)) for d in client.documents],
        "activity": [activity_out(a) for a in activity],
    }


@bp.patch("/clients/<client_id>")
def update_client(client_id: str):
    body = parse(ClientUpdateIn)
    client = _get(client_id)
    changes = {k: v for k, v in body.model_dump(exclude_none=True).items()}
    if "email" in changes:
        changes["email"] = str(changes["email"]).lower()
    service.update_contact(client, g.staff_email, changes)
    return client_out(client)


@bp.post("/clients/<client_id>/blacklist")
def blacklist(client_id: str):
    body = parse(BlacklistIn)
    client = _get(client_id)
    service.set_blacklisted(client, g.staff_email, body.blacklisted, body.reason)
    return client_out(client)


@bp.post("/clients/<client_id>/notes")
def add_note(client_id: str):
    body = parse(NoteIn)
    client = _get(client_id)
    application = loan = None
    if body.application_id:
        application = get_or_404(Application, body.application_id, "Application")
    if body.loan_id:
        loan = get_or_404(Loan, body.loan_id, "Loan")
    for linked in (application, loan):
        if linked is not None and linked.client_id != client.id:
            raise ApiError("That record belongs to another client.", 422)
    note = service.add_note(client, g.staff_email, body.body, application=application, loan=loan)
    return note_out(note), 201


@bp.post("/clients/<client_id>/documents")
def upload_client_document(client_id: str):
    client = _get(client_id)
    body = parse(DocumentKindIn, request.form.to_dict())
    application = None
    if body.application_id:
        application = get_or_404(Application, body.application_id, "Application")
        if application.client_id != client.id:
            raise ApiError("That application belongs to another client.", 422)
    upload = collect_single(request.files, body.kind)
    uploaded: list[str] = []
    try:
        store_documents(client, application, [upload], uploaded)
        db.session.commit()
    except Exception as exc:
        db.session.rollback()
        get_storage().delete(uploaded)
        raise ApiError("We couldn't save the document. Please try again.", 503) from exc
    return {"ok": True}, 201
