"""
Customer emails. Plain text so they read well on any phone. Every email names
the amount and date it is about and how to reach us.
"""

from datetime import date
from decimal import Decimal

from app.core import company


def rand(amount: Decimal) -> str:
    return f"R{amount:,.2f}"


def long_date(d: date) -> str:
    return f"{d.day} {d:%B %Y}"


def short_date(d: date) -> str:
    return f"{d.day} {d:%b %Y}"


def _footer() -> str:
    return (
        "\n\nQuestions? WhatsApp or call us on 061 401 1426, or reply to this email.\n\n"
        f"{company.NAME}\nRegistered credit provider, NCR reg. no. {company.NCR_NUMBER}\n"
        "www.cashflowloans.co.za"
    )


def application_approved(first_name: str, reference: str, amount: Decimal) -> tuple[str, str]:
    return (
        f"Your loan application {reference} is approved",
        f"Hi {first_name},\n\n"
        f"Good news: your application {reference} for {rand(amount)} has been approved.\n\n"
        "We'll let you know as soon as the money is paid into your account, with your repayment "
        "amount and due date. For unsecured loans, please approve the DebiCheck debit order "
        "when your bank asks you to." + _footer(),
    )


def application_declined(first_name: str, reference: str) -> tuple[str, str]:
    return (
        f"Your loan application {reference}",
        f"Hi {first_name},\n\n"
        f"Thank you for applying with us. Unfortunately we can't approve application {reference} "
        "at this time.\n\nIf you'd like to talk about it, or apply for a different amount or a "
        "secured loan, please get in touch." + _footer(),
    )


def loan_paid_out(first_name: str, reference: str, total: Decimal, due: date) -> tuple[str, str]:
    return (
        f"Your loan {reference} has been paid out",
        f"Hi {first_name},\n\n"
        f"Your loan has been paid into your bank account.\n\n"
        f"Amount to repay: {rand(total)}\nDue date: {long_date(due)}\n\n"
        "If a due date is missed, a further 50% is added to the outstanding balance. If you think "
        "you'll struggle to pay on time, contact us before the due date." + _footer(),
    )


def payment_due(
    first_name: str, reference: str, balance: Decimal, due: date, *, today: bool
) -> tuple[str, str]:
    when = "today" if today else "tomorrow"
    return (
        f"Reminder: your repayment of {rand(balance)} is due {when}",
        f"Hi {first_name},\n\n"
        f"This is a reminder that your repayment for loan {reference} is due {when}, "
        f"{long_date(due)}.\n\nAmount due: {rand(balance)}\n\n"
        "If you've already paid, thank you, and please ignore this email." + _footer(),
    )


def payment_overdue(first_name: str, reference: str, balance: Decimal, next_due: date) -> tuple[str, str]:
    return (
        f"Your repayment for loan {reference} is overdue",
        f"Hi {first_name},\n\n"
        f"We haven't received full payment for loan {reference} by its due date, so 50% has been "
        f"added to the outstanding balance as set out in our terms.\n\n"
        f"Amount now due: {rand(balance)}\n"
        f"Another 50% is added if it's still unpaid after {long_date(next_due)}.\n\n"
        "Please pay as soon as you can, or contact us today to discuss it." + _footer(),
    )


def loan_settled(first_name: str, reference: str) -> tuple[str, str]:
    return (
        f"Loan {reference} is paid in full",
        f"Hi {first_name},\n\n"
        f"Thank you. We've received your final payment and loan {reference} is now paid in full." + _footer(),
    )
