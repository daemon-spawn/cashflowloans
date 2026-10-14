"""Business dates are South African dates, whatever timezone the server runs in."""

import calendar
from datetime import date, datetime
from zoneinfo import ZoneInfo

SAST = ZoneInfo("Africa/Johannesburg")


def today() -> date:
    return datetime.now(SAST).date()


def add_months(d: date, months: int) -> date:
    """Same day next month, clamped to the month's last day (31 Jan + 1 → 28/29 Feb)."""
    month_index = d.month - 1 + months
    year, month = d.year + month_index // 12, month_index % 12 + 1
    return date(year, month, min(d.day, calendar.monthrange(year, month)[1]))
