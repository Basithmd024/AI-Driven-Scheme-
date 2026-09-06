from typing import Dict, Any, List
from decimal import Decimal
from app.schemas.user import EntrepreneurProfileBase
from app.schemas.scheme import SchemeResponse


class RuleBasedMatchingEngine:
    """
    Evaluates hard eligibility constraints and weights criteria specifically
    for SC Concessional Channel Finance:
    - Annual family income <= 5.00 Lakhs (hard ceiling)
    - Social Category: SC priority
    - Project Type / Estimated Cost alignment
    - Gender concession for women (Mahila Samriddhi)
    - Channel financing partner requirements
    """

    @staticmethod
    def evaluate_eligibility(user: EntrepreneurProfileBase, scheme: SchemeResponse) -> Dict[str, Any]:
        score = 40.0
        match_factors = []
        is_hard_disqualified = False
        disqualification_reason = None

        criteria = scheme.eligibility_criteria or {}

        # 1. HARD CONSTRAINT: Annual Family Income Ceiling (<= ₹5.00 Lakhs)
        max_income = criteria.get("max_annual_family_income", 500000.00)
        user_income = float(user.annual_family_income or 0)
        if user_income > max_income:
            return {
                "score": 15.0,
                "status": "Income Exceeded",
                "match_factors": [
                    f"Annual family income (₹{user_income:,.0f}) exceeds the concessional ceiling of ₹{max_income:,.0f}."
                ],
                "channel_guidelines": {
                    "is_eligible_for_concessional": False,
                    "recommended_action": "Apply through standard commercial bank credit or Stand-Up India instead.",
                    "channel_partners_applicable": ["PSB"]
                }
            }

        score += 20.0
        match_factors.append(f"Income eligibility verified (₹{user_income:,.0f} <= ₹{max_income:,.0f} ceiling)")

        # 2. Caste / Social Category Check
        if user.social_category and user.social_category.upper() == "SC":
            score += 25.0
            match_factors.append("Eligible beneficiary under Scheduled Caste (SC) mandate")
        else:
            score -= 15.0
            match_factors.append(f"Primary mandate is for SC beneficiaries (Current: {user.social_category})")

        # 3. Gender Exclusivity / Concession (e.g. Mahila Samriddhi)
        gender_exclusive = criteria.get("gender_exclusive")
        if gender_exclusive:
            if user.gender and user.gender.lower() == gender_exclusive.lower():
                score += 20.0
                match_factors.append("Special 4.0% interest rate rebate for SC Women / SHGs")
            else:
                return {
                    "score": 20.0,
                    "status": "Gender Specific",
                    "match_factors": ["This scheme is reserved exclusively for women entrepreneurs/SHGs."],
                    "channel_guidelines": {
                        "is_eligible_for_concessional": False,
                        "recommended_action": "Consider Micro Credit Scheme (MCS) or Term Loan Scheme.",
                        "channel_partners_applicable": ["SCA", "RRB"]
                    }
                }

        # 4. Project Type & Cost Alignment
        user_project = (user.project_type or "").lower()
        scheme_category = (scheme.category or "").lower()
        user_cost = Decimal(str(user.estimated_project_cost or 0))

        # Check cost feasibility
        if scheme.max_project_cost and user_cost > scheme.max_project_cost:
            score -= 20.0
            match_factors.append(f"Project cost (₹{user_cost:,.0f}) exceeds scheme limit of ₹{scheme.max_project_cost:,.0f}")
        else:
            score += 15.0
            match_factors.append(f"Estimated cost (₹{user_cost:,.0f}) fits within scheme ceiling")

        # Specific Category Alignment
        if "education" in user_project:
            if "domestic" in user_project and scheme_category == "education" and "Domestic" in scheme.title:
                score += 25.0
                match_factors.append("Direct match for domestic university/technical course financing")
            elif "overseas" in user_project and scheme_category == "education" and "Overseas" in scheme.title:
                score += 25.0
                match_factors.append("Direct match for foreign degree/STEM overseas loan")
        elif "green" in user_project and scheme_category == "green_business":
            score += 25.0
            match_factors.append("Direct match for EV / Solar / Clean energy concessional financing")
        elif "micro" in user_project and (scheme_category == "microfinance" or scheme_category == "women_microfinance"):
            score += 20.0
            match_factors.append("Direct match for micro-credit / petty trade assistance")
        elif "term" in user_project and scheme_category == "term_loan":
            score += 20.0
            match_factors.append("Direct match for industrial setup / commercial term loan")

        # Cap score between 10 and 99
        final_score = max(10.0, min(99.0, score))

        if final_score >= 80:
            status = "Highly Eligible"
        elif final_score >= 60:
            status = "Eligible"
        else:
            status = "Partially Eligible"

        # Channel guidelines mapping
        channel_partners = criteria.get("channel_partners", ["SCA", "PSB", "RRB", "NBFC-MFI"])
        channel_guidelines = {
            "is_eligible_for_concessional": True,
            "channel_type": "Channel Financing (No direct application to ministry)",
            "channel_partners_applicable": channel_partners,
            "promoter_margin_pct": float(scheme.promoter_contribution_min),
            "max_coverage_pct": float(scheme.channel_finance_coverage),
            "concessional_rate": float(scheme.concessional_interest_rate),
            "max_moratorium_months": scheme.max_moratorium_months,
            "next_step": f"Locate nearest authorized {', '.join(channel_partners)} branch with active fund utilization."
        }

        return {
            "score": round(final_score, 1),
            "status": status,
            "match_factors": match_factors,
            "channel_guidelines": channel_guidelines
        }
