import re
from typing import Annotated

from pydantic import AfterValidator

_PHONE = re.compile(r"^(\+27|0)\d{9}$")


def is_valid_sa_id_number(value: str) -> bool:
    """13 digits, plausible birth date, valid Luhn checksum. Mirrors packages/core/src/sa-id.ts."""
    if not re.fullmatch(r"\d{13}", value):
        return False
    month, day = int(value[2:4]), int(value[4:6])
    if not (1 <= month <= 12 and 1 <= day <= 31):
        return False
    total = 0
    for i, ch in enumerate(reversed(value)):
        digit = int(ch)
        if i % 2 == 1:
            digit *= 2
            if digit > 9:
                digit -= 9
        total += digit
    return total % 10 == 0


def _sa_id(value: str) -> str:
    value = value.strip()
    if not is_valid_sa_id_number(value):
        raise ValueError("Enter a valid 13-digit SA ID number")
    return value


def _phone(value: str) -> str:
    value = re.sub(r"[\s-]", "", value)
    if not _PHONE.match(value):
        raise ValueError("Enter a valid South African number, e.g. 0614011426")
    return value


SaIdNumber = Annotated[str, AfterValidator(_sa_id)]
SaPhone = Annotated[str, AfterValidator(_phone)]
