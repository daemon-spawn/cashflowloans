"""
Daily job (Render cron, 09:00 SAST): refresh loan statuses, email borrowers,
and send the owner one digest. Each reminder is logged once it is sent, so
running the job again the same day sends nothing new.
"""

from datetime import date, timedelta

from flask import current_app
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.core import clock
from app.extensions import db
from app.models import Application, ApplicationStatus, Loan, LoanStatus, ReminderLog
from app.services import emails
from app.services.loans import reference_for, refresh_status
from app.services.notifications import send_email


def _already_sent(key: str) -> bool:
    return db.session.scalar(select(ReminderLog.id).where(ReminderLog.key == key)) is not None


def _send_once(key: str, loan: Loan | None, to: str, subject: str, body: str) -> bool:
    if _already_sent(key):
        return False
    if not send_email(to, subject, body):
        return False  # not logged, so tomorrow's run tries again
    db.session.add(ReminderLog(key=key, loan_id=loan.id if loan else None, recipient=to))
    db.session.commit()
    return True


def run(today: date | None = None) -> dict:
    today = today or clock.today()
    loans = list(
        db.session.scalars(
            select(Loan)
            .where(Loan.written_off_at.is_(None))
            .options(selectinload(Loan.payments), selectinload(Loan.client), selectinload(Loan.application))
        )
    )
    ledgers = {ln.id: refresh_status(ln, today) for ln in loans}
    db.session.commit()

    sent = 0
    due_tomorrow, due_today, overdue = [], [], []
    for ln in loans:
        lg = ledgers[ln.id]
        if ln.disbursed_at is None or ln.due_date is None or lg.balance <= 0:
            continue
        c, ref = ln.client, reference_for(ln)
        if ln.due_date == today + timedelta(days=1):
            due_tomorrow.append((ln, lg))
            subject, body = emails.payment_due(c.first_name, ref, lg.balance, ln.due_date, today=False)
            sent += _send_once(f"due_tomorrow:{ln.id}:{ln.due_date}", ln, c.email, subject, body)
        elif ln.due_date == today:
            due_today.append((ln, lg))
            subject, body = emails.payment_due(c.first_name, ref, lg.balance, ln.due_date, today=True)
            sent += _send_once(f"due_today:{ln.id}:{ln.due_date}", ln, c.email, subject, body)
        elif ln.status == LoanStatus.OVERDUE:
            overdue.append((ln, lg))
            subject, body = emails.payment_overdue(c.first_name, ref, lg.balance, lg.next_due_date)
            sent += _send_once(f"overdue:{ln.id}:{lg.missed_periods}", ln, c.email, subject, body)

    pending = [ln for ln in loans if ln.status == LoanStatus.PENDING_PAYOUT]
    to_review = db.session.scalars(
        select(Application).where(
            Application.status.in_([ApplicationStatus.NEW, ApplicationStatus.IN_REVIEW])
        )
    ).all()

    digest_sent = False
    if due_tomorrow or due_today or overdue or pending or to_review:
        subject, body = _digest(today, due_tomorrow, due_today, overdue, pending, len(to_review))
        digest_sent = _send_once(
            f"owner_digest::{today}", None, current_app.config["NOTIFY_EMAIL"], subject, body
        )

    return {
        "date": today.isoformat(),
        "loansChecked": len(loans),
        "remindersSent": int(sent),
        "dueTomorrow": len(due_tomorrow),
        "dueToday": len(due_today),
        "overdue": len(overdue),
        "pendingPayout": len(pending),
        "toReview": len(to_review),
        "digestSent": digest_sent,
    }


def _digest(today, due_tomorrow, due_today, overdue, pending, to_review: int) -> tuple[str, str]:
    def lines(rows) -> str:
        return "\n".join(
            f"  - {ln.client.full_name} ({ln.client.phone}), {reference_for(ln)}: {emails.rand(lg.balance)}"
            f" due {ln.due_date.isoformat()}"
            for ln, lg in rows
        )

    total = sum((lg.balance for _, lg in [*due_tomorrow, *due_today, *overdue]), start=0)
    sections = [f"Cashflow Loans daily summary for {emails.long_date(today)}"]
    if overdue:
        sections.append(f"OVERDUE ({len(overdue)}), contact these clients first:\n{lines(overdue)}")
    if due_today:
        sections.append(f"Due today ({len(due_today)}):\n{lines(due_today)}")
    if due_tomorrow:
        sections.append(f"Due tomorrow ({len(due_tomorrow)}), reminder emails sent:\n{lines(due_tomorrow)}")
    if pending:
        sections.append(
            f"Approved, waiting for payout ({len(pending)}):\n"
            + "\n".join(f"  - {ln.client.full_name}: {emails.rand(ln.principal)}" for ln in pending)
        )
    if to_review:
        sections.append(f"Applications waiting for review: {to_review}")
    sections.append("Open the CRM for details.")
    count = len(overdue) + len(due_today) + len(due_tomorrow)
    subject = f"Daily summary: {count} repayments due or overdue, {emails.rand(total)} outstanding"
    return subject, "\n\n".join(sections)
