"""
Loan product rules — the authority for every amount the business charges.
packages/core/src/loan.ts mirrors these for display on the website and CRM.
"""

from decimal import ROUND_HALF_UP, Decimal

MIN_AMOUNT = Decimal("100")
MAX_AMOUNT = Decimal("100000")
SECURED_MIN_AMOUNT = Decimal("500")
TERM_MONTHS = 1
FEE_RATE = Decimal("0.5")
LATE_RATE = Decimal("0.5")

_CENT = Decimal("0.01")


def money(value: Decimal | int | float | str) -> Decimal:
    return Decimal(str(value)).quantize(_CENT, rounding=ROUND_HALF_UP)


def fee_for(principal: Decimal) -> Decimal:
    return money(principal * FEE_RATE)


def total_repayable(principal: Decimal) -> Decimal:
    return money(principal + fee_for(principal))


def balance_after_missed_periods(outstanding: Decimal, missed_periods: int) -> Decimal:
    """Each missed due date adds LATE_RATE to the outstanding balance."""
    return money(outstanding * (1 + LATE_RATE) ** max(0, missed_periods))
