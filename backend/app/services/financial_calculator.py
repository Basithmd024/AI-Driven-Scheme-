from decimal import Decimal
from typing import List
from app.schemas.calculator import EMICalculationRequest, EMICalculationResponse, MonthlyAmortizationItem


class FinancialCalculatorService:
    """
    Precision financial calculation engine specifically designed for concessional
    channel financing schemes:
    - Covers up to 90% of project costs
    - Supports moratorium periods (3 to 12 months)
    - Compares concessional interest (6.5% - 8%) against commercial bank loans (12% - 15%)
    """

    @classmethod
    def calculate_emi_and_schedule(cls, req: EMICalculationRequest) -> EMICalculationResponse:
        # 1. Net Loan Amount Calculation (after promoter margin)
        promoter_pct = req.promoter_share_pct / Decimal("100.0")
        promoter_contribution = req.project_cost * promoter_pct
        net_loan = req.project_cost - promoter_contribution

        # 2. Concessional monthly interest rate
        monthly_rate_concessional = (req.concessional_rate / Decimal("100.0")) / Decimal("12.0")
        total_months = req.tenure_years * 12
        moratorium_months = req.moratorium_months
        amortization_months = max(1, total_months - moratorium_months)

        # 3. Standard reducing balance EMI formula for the amortization period
        # EMI = P * r * (1 + r)^n / ((1 + r)^n - 1)
        r = monthly_rate_concessional
        n = amortization_months
        if r > 0:
            pow_val = (Decimal("1.0") + r) ** n
            concessional_emi = net_loan * (r * pow_val) / (pow_val - Decimal("1.0"))
        else:
            concessional_emi = net_loan / Decimal(str(n))

        # 4. Commercial rate comparison
        monthly_rate_commercial = (req.commercial_rate_benchmark / Decimal("100.0")) / Decimal("12.0")
        if monthly_rate_commercial > 0:
            pow_comm = (Decimal("1.0") + monthly_rate_commercial) ** n
            commercial_emi = net_loan * (monthly_rate_commercial * pow_comm) / (pow_comm - Decimal("1.0"))
        else:
            commercial_emi = net_loan / Decimal(str(n))

        # 5. Build Amortization Schedule & calculate exact interest
        schedule: List[MonthlyAmortizationItem] = []
        balance = net_loan
        total_concessional_interest = Decimal("0.0")
        moratorium_monthly_interest = net_loan * monthly_rate_concessional

        # Month-by-month tracking
        for m in range(1, total_months + 1):
            if m <= moratorium_months:
                # During moratorium: interest is serviced, principal is deferred
                interest_payment = balance * monthly_rate_concessional
                principal_payment = Decimal("0.0")
                total_payment = interest_payment
                closing_balance = balance
                total_concessional_interest += interest_payment
                schedule.append(
                    MonthlyAmortizationItem(
                        month=m,
                        is_moratorium=True,
                        opening_balance=round(balance, 2),
                        principal_paid=round(principal_payment, 2),
                        interest_paid=round(interest_payment, 2),
                        total_payment=round(total_payment, 2),
                        closing_balance=round(closing_balance, 2)
                    )
                )
            else:
                # Post-moratorium: regular EMI repayment
                interest_payment = balance * monthly_rate_concessional
                principal_payment = concessional_emi - interest_payment
                # Guard against final month rounding drift
                if principal_payment > balance or m == total_months:
                    principal_payment = balance
                    concessional_emi_current = principal_payment + interest_payment
                else:
                    concessional_emi_current = concessional_emi
                
                closing_balance = max(Decimal("0.0"), balance - principal_payment)
                total_concessional_interest += interest_payment
                
                schedule.append(
                    MonthlyAmortizationItem(
                        month=m,
                        is_moratorium=False,
                        opening_balance=round(balance, 2),
                        principal_paid=round(principal_payment, 2),
                        interest_paid=round(interest_payment, 2),
                        total_payment=round(concessional_emi_current, 2),
                        closing_balance=round(closing_balance, 2)
                    )
                )
                balance = closing_balance

        # 6. Commercial Interest & Savings
        # Estimate commercial interest over same period
        total_commercial_interest = (commercial_emi * Decimal(str(n))) - net_loan + (net_loan * monthly_rate_commercial * Decimal(str(moratorium_months)))
        savings = max(Decimal("0.0"), total_commercial_interest - total_concessional_interest)

        return EMICalculationResponse(
            project_cost=round(req.project_cost, 2),
            promoter_contribution=round(promoter_contribution, 2),
            net_loan_amount=round(net_loan, 2),
            concessional_rate=req.concessional_rate,
            tenure_years=req.tenure_years,
            moratorium_months=req.moratorium_months,
            monthly_emi_after_moratorium=round(concessional_emi, 2),
            moratorium_monthly_interest=round(moratorium_monthly_interest, 2),
            total_concessional_interest=round(total_concessional_interest, 2),
            total_repayment_amount=round(net_loan + total_concessional_interest, 2),
            commercial_monthly_emi=round(commercial_emi, 2),
            total_commercial_interest=round(total_commercial_interest, 2),
            beneficiary_savings_amount=round(savings, 2),
            amortization_schedule=schedule
        )
