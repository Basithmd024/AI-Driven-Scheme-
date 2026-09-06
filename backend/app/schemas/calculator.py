from pydantic import BaseModel, Field
from typing import List, Optional
from decimal import Decimal


class EMICalculationRequest(BaseModel):
    project_cost: Decimal = Field(..., gt=0, description="Total estimated cost of project or education")
    concessional_rate: Decimal = Field(Decimal("6.5"), ge=3.0, le=16.0, description="Concessional interest rate per annum")
    tenure_years: int = Field(5, ge=1, le=15, description="Repayment tenure in years")
    moratorium_months: int = Field(6, ge=0, le=24, description="Moratorium / Grace period in months (0-24)")
    promoter_share_pct: Decimal = Field(Decimal("10.0"), ge=0.0, le=50.0, description="Promoter margin contribution %")
    commercial_rate_benchmark: Decimal = Field(Decimal("13.5"), description="Commercial bank rate benchmark for comparison")


class MonthlyAmortizationItem(BaseModel):
    month: int
    is_moratorium: bool
    opening_balance: Decimal
    principal_paid: Decimal
    interest_paid: Decimal
    total_payment: Decimal
    closing_balance: Decimal


class EMICalculationResponse(BaseModel):
    project_cost: Decimal
    promoter_contribution: Decimal
    net_loan_amount: Decimal
    concessional_rate: Decimal
    tenure_years: int
    moratorium_months: int
    monthly_emi_after_moratorium: Decimal
    moratorium_monthly_interest: Decimal
    total_concessional_interest: Decimal
    total_repayment_amount: Decimal
    commercial_monthly_emi: Decimal
    total_commercial_interest: Decimal
    beneficiary_savings_amount: Decimal
    amortization_schedule: List[MonthlyAmortizationItem]
