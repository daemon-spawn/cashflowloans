"""
The single source of truth for what a borrower owes.

A paid-out loan starts at principal + fee. Each due date that passes with money
still owing adds LATE_RATE to the outstanding balance (the website and FAQ:
"A further 50% is added to the outstanding balance for each missed due date").
The first due date is the loan's due date; each later one is a month after the
previous. Payments made on or before a due date count towards it.
"""

from dataclasses import dataclass, field
from datetime import date
from decimal import Decimal

from app.core import loan_rules
from app.core.clock import add_months
from app.models.enums import LoanStatus

# A loan is "due" from this many days before its due date.
DUE_SOON_DAYS = 3


@dataclass(frozen=True)
class Entry:
    on: date
    kind: str  # "advance" | "fee" | "payment" | "late_charge"
    amount: Decimal  # positive adds to the balance, negative reduces it
    balance: Decimal
    label: str


@dataclass
class Ledger:
    entries: list[Entry] = field(default_factory=list)
    balance: Decimal = Decimal("0.00")
    missed_periods: int = 0
    late_charges: Decimal = Decimal("0.00")
    paid: Decimal = Decimal("0.00")
    # Next date on which a late charge is added if the balance is still owing.
    next_due_date: date | None = None

    @property
    def total_charged(self) -> Decimal:
        return loan_rules.money(self.balance + self.paid)


def build_ledger(
    principal: Decimal,
    fee: Decimal,
    paid_out_on: date | None,
    due_date: date | None,
    payments: list[tuple[date, Decimal]],
    today: date,
) -> Ledger:
    ledger = Ledger()
    if paid_out_on is None or due_date is None:
        return ledger

    m = loan_rules.money
    events: list[tuple[date, int, str, Decimal]] = [(d, 1, "payment", amt) for d, amt in payments]
    # Due dates that have fully passed. Order 2 sorts them after same-day payments.
    checkpoint, period = due_date, 0
    while checkpoint < today:
        events.append((checkpoint, 2, "due", Decimal(0)))
        period += 1
        checkpoint = add_months(due_date, period)
    ledger.next_due_date = checkpoint
    events.sort(key=lambda e: (e[0], e[1]))

    balance = m(principal)
    ledger.entries.append(Entry(paid_out_on, "advance", m(principal), balance, "Loan paid out"))
    balance = m(balance + fee)
    ledger.entries.append(Entry(paid_out_on, "fee", m(fee), balance, "Fee for the 1-month term"))

    for on, _, kind, amount in events:
        if kind == "payment":
            balance = m(balance - amount)
            ledger.paid = m(ledger.paid + amount)
            ledger.entries.append(Entry(on, "payment", -m(amount), balance, "Payment received"))
        elif balance > 0:
            charge = m(balance * loan_rules.LATE_RATE)
            balance = m(balance + charge)
            ledger.missed_periods += 1
            ledger.late_charges = m(ledger.late_charges + charge)
            ledger.entries.append(
                Entry(on, "late_charge", charge, balance, f"Missed due date {on.isoformat()}: +50%")
            )

    ledger.balance = balance
    return ledger


def loan_status(
    ledger: Ledger, *, paid_out: bool, written_off: bool, due_date: date | None, today: date
) -> LoanStatus:
    if written_off:
        return LoanStatus.WRITTEN_OFF
    if not paid_out or due_date is None:
        return LoanStatus.PENDING_PAYOUT
    if ledger.balance <= 0:
        return LoanStatus.PAID
    if today > due_date:
        return LoanStatus.OVERDUE
    if (due_date - today).days <= DUE_SOON_DAYS:
        return LoanStatus.DUE
    return LoanStatus.ACTIVE
