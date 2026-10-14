from datetime import date
from decimal import Decimal

from app.core.clock import add_months
from app.core.ledger import build_ledger, loan_status
from app.models import LoanStatus

D = Decimal
OUT = date(2026, 1, 10)
DUE = date(2026, 2, 10)


def ledger(payments=(), today=date(2026, 1, 20)):
    return build_ledger(D("1000"), D("500"), OUT, DUE, list(payments), today)


def status(lg, today):
    return loan_status(lg, paid_out=True, written_off=False, due_date=DUE, today=today)


def test_add_months_clamps_to_month_end():
    assert add_months(date(2026, 1, 31), 1) == date(2026, 2, 28)
    assert add_months(date(2026, 11, 15), 2) == date(2027, 1, 15)


def test_before_due_date_owes_principal_plus_fee():
    lg = ledger()
    assert lg.balance == D("1500.00")
    assert lg.missed_periods == 0
    assert lg.next_due_date == DUE
    assert status(lg, date(2026, 1, 20)) == LoanStatus.ACTIVE


def test_due_soon_and_due_today_are_due_not_overdue():
    assert status(ledger(today=date(2026, 2, 7)), date(2026, 2, 7)) == LoanStatus.DUE
    lg = ledger(today=DUE)
    assert lg.missed_periods == 0
    assert status(lg, DUE) == LoanStatus.DUE


def test_each_missed_due_date_adds_half_of_the_outstanding_balance():
    lg = ledger(today=date(2026, 2, 11))
    assert lg.balance == D("2250.00")  # 1500 × 1.5
    assert lg.missed_periods == 1
    assert lg.next_due_date == date(2026, 3, 10)
    assert status(lg, date(2026, 2, 11)) == LoanStatus.OVERDUE

    lg = ledger(today=date(2026, 3, 11))
    assert lg.balance == D("3375.00")  # 2250 × 1.5
    assert lg.missed_periods == 2


def test_payment_on_the_due_date_counts_before_the_late_charge():
    lg = ledger([(DUE, D("1000"))], today=date(2026, 2, 11))
    assert lg.balance == D("750.00")  # (1500 − 1000) × 1.5
    assert lg.late_charges == D("250.00")


def test_paying_in_full_on_time_settles_and_stops_charges():
    lg = ledger([(date(2026, 2, 1), D("1500"))], today=date(2026, 6, 1))
    assert lg.balance == D("0.00")
    assert lg.missed_periods == 0
    assert status(lg, date(2026, 6, 1)) == LoanStatus.PAID


def test_unpaid_loan_has_no_ledger():
    lg = build_ledger(D("1000"), D("500"), None, None, [], date(2026, 1, 1))
    assert lg.balance == 0
    assert loan_status(lg, paid_out=False, written_off=False, due_date=None, today=date(2026, 1, 1)) == (
        LoanStatus.PENDING_PAYOUT
    )
