from datetime import date
from decimal import Decimal
from typing import Literal

from pydantic import BaseModel, ConfigDict, EmailStr, Field, model_validator

from app.core import loan_rules
from app.models.enums import LoanType
from app.schemas.common import SaIdNumber, SaPhone


class ApplicationIn(BaseModel):
    """Public application form. Mirrors applicationSchema in packages/core/src/schemas.ts."""

    model_config = ConfigDict(str_strip_whitespace=True, extra="ignore")

    loan_type: LoanType = Field(alias="loanType")
    amount: Decimal = Field(ge=loan_rules.MIN_AMOUNT, le=loan_rules.MAX_AMOUNT)
    repayment_date: date = Field(alias="repaymentDate")
    first_name: str = Field(alias="firstName", min_length=1, max_length=100)
    last_name: str = Field(alias="lastName", min_length=1, max_length=100)
    id_number: SaIdNumber = Field(alias="idNumber")
    phone: SaPhone
    email: EmailStr
    accepted_terms: Literal[True] = Field(alias="acceptedTerms")

    @model_validator(mode="after")
    def check_rules(self):
        if self.loan_type == LoanType.SECURED and self.amount < loan_rules.SECURED_MIN_AMOUNT:
            raise ValueError(f"Secured loans start at R{loan_rules.SECURED_MIN_AMOUNT}")
        if self.loan_type == LoanType.UNSECURED and self.amount > loan_rules.UNSECURED_MAX_AMOUNT:
            raise ValueError("Unsecured loans go up to R10,000. Choose a secured loan to borrow more.")
        if self.repayment_date < date.today():
            raise ValueError("Repayment date can't be in the past")
        return self
