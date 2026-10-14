"""
Figures for the CRM overview and reports. Every amount comes from the ledger,
so the overview, loan pages and emails always agree.
"""

from collections import defaultdict
from datetime import date, datetime, time, timedelta
from decimal import Decimal

from sqlalchemy import func, select
from sqlalchemy.orm import selectinload

from app.core import clock, loan_rules
from app.extensions import db
from app.models import Application, ApplicationStatus, Client, ContactMessage, Loan, LoanStatus, MessageStatus
from app.services.loans import current_state

OPEN = (LoanStatus.ACTIVE, LoanStatus.DUE, LoanStatus.OVERDUE)
TIMEFRAMES = {"1month": 1, "3months": 3, "6months": 6, "1year": 12, "all": None}

m = loan_rules.money


def _loans() -> list[Loan]:
    return list(
        db.session.scalars(
            select(Loan).options(
                selectinload(Loan.payments), selectinload(Loan.client), selectinload(Loan.application)
            )
        )
    )


def overview(today: date | None = None) -> dict:
    today = today or clock.today()
    loans = _loans()
    states = {ln.id: current_state(ln, today) for ln in loans}
    status = {k: v[0] for k, v in states.items()}
    ledgers = {k: v[1] for k, v in states.items()}
    paid_out = [ln for ln in loans if ln.disbursed_at is not None]

    def total(items) -> Decimal:
        return m(sum(items, Decimal(0)))

    open_loans = [ln for ln in paid_out if status[ln.id] in OPEN]
    loaned = total(ln.principal for ln in paid_out)
    collected = total(ledgers[ln.id].paid for ln in paid_out)
    charged = total(
        ledgers[ln.id].total_charged for ln in paid_out if status[ln.id] != LoanStatus.WRITTEN_OFF
    )

    by_status: dict[str, int] = defaultdict(int)
    for ln in loans:
        by_status[status[ln.id].value] += 1
    outstanding_by_type: dict[str, Decimal] = defaultdict(Decimal)
    for ln in open_loans:
        outstanding_by_type[ln.loan_type.value] += ledgers[ln.id].balance

    def row(ln: Loan) -> dict:
        lg = ledgers[ln.id]
        return {
            "loanId": str(ln.id),
            "clientId": str(ln.client_id),
            "clientName": ln.client.full_name,
            "phone": ln.client.phone,
            "reference": ln.application.reference if ln.application else None,
            "status": status[ln.id].value,
            "dueDate": ln.due_date.isoformat() if ln.due_date else None,
            "balance": str(lg.balance),
        }

    soon = today + timedelta(days=7)
    due_soon = sorted(
        (ln for ln in open_loans if ln.due_date and today <= ln.due_date <= soon), key=lambda x: x.due_date
    )
    overdue = sorted(
        (ln for ln in open_loans if status[ln.id] == LoanStatus.OVERDUE), key=lambda x: x.due_date
    )
    pending = [ln for ln in loans if status[ln.id] == LoanStatus.PENDING_PAYOUT]

    app_counts = dict(
        db.session.execute(select(Application.status, func.count()).group_by(Application.status)).all()
    )
    start_of_day = datetime.combine(today, time.min, tzinfo=clock.SAST)
    return {
        "today": today.isoformat(),
        "applications": {
            "new": app_counts.get(ApplicationStatus.NEW, 0),
            "inReview": app_counts.get(ApplicationStatus.IN_REVIEW, 0),
            "today": db.session.scalar(
                select(func.count()).select_from(Application).where(Application.created_at >= start_of_day)
            ),
        },
        "messagesNew": db.session.scalar(
            select(func.count()).select_from(ContactMessage).where(ContactMessage.status == MessageStatus.NEW)
        ),
        "totals": {
            "loaned": str(loaned),
            "collected": str(collected),
            "outstanding": str(total(ledgers[ln.id].balance for ln in open_loans)),
            "overdueAmount": str(total(ledgers[ln.id].balance for ln in overdue)),
            "repaymentRate": float(collected / charged) if charged else None,
            "averageLoan": str(m(loaned / len(paid_out))) if paid_out else "0.00",
            "openLoans": len(open_loans),
            "overdueLoans": len(overdue),
            "pendingPayout": len(pending),
            "pendingPayoutAmount": str(total(ln.principal for ln in pending)),
            "clients": db.session.scalar(select(func.count()).select_from(Client)),
        },
        "loansByStatus": dict(by_status),
        "outstandingByType": {k: str(m(v)) for k, v in outstanding_by_type.items()},
        "dueSoon": [row(ln) for ln in due_soon],
        "overdue": [row(ln) for ln in overdue],
    }


def analytics(timeframe: str, today: date | None = None) -> dict:
    """The old CRM's Analytics tab: period totals plus the top 20 clients by amount repaid."""
    today = today or clock.today()
    months = TIMEFRAMES.get(timeframe, 1)
    since = clock.add_months(today, -months) if months else None

    def in_period(d: date | None) -> bool:
        return d is not None and (since is None or d > since)

    loans = _loans()
    per_client: dict = {}
    loaned = collected = Decimal(0)
    for ln in loans:
        if ln.disbursed_at is None:
            continue
        state, lg = current_state(ln, today)
        out_on = ln.disbursed_at.astimezone(clock.SAST).date()
        if in_period(out_on):
            loaned += ln.principal
        collected += sum((p.amount for p in ln.payments if in_period(p.paid_on)), Decimal(0))

        c = per_client.setdefault(
            ln.client_id,
            {
                "client": ln.client,
                "loaned": Decimal(0),
                "repaid": Decimal(0),
                "outstanding": Decimal(0),
                "last": None,
            },
        )
        c["loaned"] += ln.principal
        c["repaid"] += lg.paid
        if state in OPEN:
            c["outstanding"] += lg.balance
        last = max([out_on, *(p.paid_on for p in ln.payments)])
        c["last"] = max(c["last"], last) if c["last"] else last

    new_clients_query = select(func.count()).select_from(Client)
    if since:
        new_clients_query = new_clients_query.where(
            Client.created_at > datetime.combine(since, time.max, tzinfo=clock.SAST)
        )
    top = sorted(per_client.values(), key=lambda c: c["repaid"], reverse=True)[:20]
    return {
        "timeframe": timeframe if timeframe in TIMEFRAMES else "1month",
        "since": since.isoformat() if since else None,
        "newClients": db.session.scalar(new_clients_query),
        "loaned": str(m(loaned)),
        "collected": str(m(collected)),
        # Cash view, as the old CRM showed it: money in minus money out in the period.
        "net": str(m(collected - loaned)),
        "topClients": [
            {
                "clientId": str(c["client"].id),
                "name": c["client"].full_name,
                "loaned": str(m(c["loaned"])),
                "repaid": str(m(c["repaid"])),
                "outstanding": str(m(c["outstanding"])),
                "profit": str(m(c["repaid"] - c["loaned"])),
                "lastActivity": c["last"].isoformat() if c["last"] else None,
            }
            for c in top
        ],
    }
