from typing import Dict, Any, List
from decimal import Decimal
from app.schemas.user import EntrepreneurProfileBase
from app.schemas.scheme import SchemeResponse


class RuleBasedMatchingEngine:
    """
    Evaluates eligibility constraints and weights criteria across India-Wide
    central government credit & concessional schemes:
    - Universal schemes (PMEGP, MUDRA, Stand-Up India, CGTMSE, Vishwakarma, SVANidhi)
    - Social Category Specific (SC: NSFDC, ST: NSTFDC, OBC: NBCFDC, Minorities: NMDFC)
    - Women Entrepreneur concessions (Mahila Samriddhi, AMSY, New Swarnima, Stand-Up India)
    - Project Type & Scale Feasibility
    - Special bonuses for SHG Members, Udyam MSME holders, and Divyangjan
    """

    @staticmethod
    def evaluate_eligibility(user: EntrepreneurProfileBase, scheme: SchemeResponse) -> Dict[str, Any]:
        score = 35.0
        match_factors = []

        criteria = scheme.eligibility_criteria or {}
        scheme_target = [d.upper() for d in (scheme.target_demographics or [])]
        user_category = (user.social_category or "GENERAL").upper()
        user_gender = (user.gender or "").lower()
        user_income = float(user.annual_family_income or 0)
        user_cost = Decimal(str(user.estimated_project_cost or 0))

        # 1. Income Ceiling Evaluation
        max_income = criteria.get("max_annual_family_income", 99999999.00)
        has_statutory_ceiling = max_income < 5000000.00  # under 50 Lakhs is a targeted ceiling

        if has_statutory_ceiling and user_income > max_income:
            return {
                "score": 18.0,
                "status": "Income Exceeded",
                "is_disqualified": True,
                "match_factors": [
                    f"Annual family income (₹{user_income:,.0f}) exceeds the statutory ceiling of ₹{max_income:,.0f} for this targeted scheme.",
                    "Tip: You remain 100% eligible for PMEGP, PM MUDRA, Stand-Up India, and CGTMSE which have NO income ceiling."
                ],
                "channel_guidelines": {
                    "is_eligible_for_concessional": False,
                    "recommended_action": "Apply through PMEGP (up to ₹50L with 35% subsidy) or PM MUDRA (up to ₹20L) instead.",
                    "channel_partners_applicable": ["PSB", "RRB"]
                }
            }
        elif has_statutory_ceiling:
            score += 20.0
            match_factors.append(f"Income compliance verified (₹{user_income:,.0f} ≤ ₹{max_income:,.0f} statutory ceiling)")
        else:
            score += 15.0
            match_factors.append("Universal Scheme: No household income ceiling restriction")

        # 2. Social Category & Demographic Alignment
        is_universal_caste = "ALL INDIA" in scheme_target or "GENERAL" in scheme_target

        # Trade-gated schemes (PM Vishwakarma artisan trades, PM SVANidhi street vendors)
        # are open to ALL communities — their statutory gate is the trade/vocation, not caste.
        trade_gated = bool(criteria.get("artisan_trade") or criteria.get("urban_vendor_id"))

        # OR-mandate schemes (e.g., Stand-Up India: SC/ST OR Women of any category)
        or_mandate = bool(criteria.get("sc_st_or_woman"))
        if or_mandate and user_category not in scheme_target and user_gender != "female":
            return {
                "score": 15.0,
                "status": "Category Mismatch",
                "is_disqualified": True,
                "match_factors": [
                    "Stand-Up India statutory mandate reserves greenfield loans for SC/ST entrepreneurs and women of any category.",
                    "Tip: PMEGP and PM MUDRA are open to all categories with NO demographic restriction."
                ],
                "channel_guidelines": {
                    "is_eligible_for_concessional": False,
                    "recommended_action": "Apply through PMEGP (up to ₹50L with 35% subsidy) or PM MUDRA (up to ₹20L) instead.",
                    "channel_partners_applicable": ["PSB", "RRB"]
                }
            }

        if is_universal_caste:
            score += 20.0
            match_factors.append(f"Universal National Scheme: Open to all demographics including {user_category}")
        elif trade_gated:
            score += 20.0
            match_factors.append("Trade-gated National Scheme: Open to all communities practicing the eligible trade/vocation")
        elif user_category in scheme_target:
            score += 25.0
            match_factors.append(f"Direct mandate match for {user_category} beneficiaries")
        elif or_mandate:
            # Reached only when the user is not SC/ST but qualifies via the gender mandate
            # (checked above): e.g., a woman of any category under Stand-Up India.
            score += 25.0
            match_factors.append("Qualifies under the statutory SC/ST-or-Women mandate (women of any category eligible)")
        else:
            # Scheme is targeted to another community — not eligible
            target_str = ", ".join([d for d in scheme_target if d != "ALL INDIA"])
            return {
                "score": 15.0,
                "status": "Category Mismatch",
                "is_disqualified": True,
                "match_factors": [f"Targeted statutory mandate focuses on {target_str} (Current: {user_category})."],
                "channel_guidelines": {
                    "is_eligible_for_concessional": False,
                    "recommended_action": "Apply through universal schemes like PMEGP, PM MUDRA, or Stand-Up India instead.",
                    "channel_partners_applicable": ["PSB", "RRB"]
                }
            }

        # 3. Gender Exclusivity / Concession
        gender_exclusive = criteria.get("gender_exclusive")
        if gender_exclusive:
            if user_gender == gender_exclusive.lower():
                score += 25.0
                match_factors.append("Priority concession & exclusive interest rate rebate for Women Entrepreneurs")
            else:
                return {
                    "score": 20.0,
                    "status": "Gender Specific",
                    "is_disqualified": True,
                    "match_factors": ["This scheme is reserved exclusively for women entrepreneurs and Self-Help Groups (SHGs)."],
                    "channel_guidelines": {
                        "is_eligible_for_concessional": False,
                        "recommended_action": "Consider PMEGP, PM MUDRA, or Term Loan schemes.",
                        "channel_partners_applicable": ["PSB", "RRB", "SCA"]
                    }
                }
        elif user_gender == "female" and ("WOMEN" in scheme_target or "FEMALE" in scheme_target):
            score += 15.0
            match_factors.append("Special women entrepreneur margin money / interest concession applies")

        # 4. Project Type Alignment
        user_project = (user.project_type or "").lower()
        scheme_category = (scheme.category or "").lower()
        scheme_title = (scheme.title or "").lower()

        # Check cost feasibility
        if scheme.max_project_cost and user_cost > scheme.max_project_cost:
            score -= 20.0
            match_factors.append(f"Project cost (₹{user_cost:,.0f}) exceeds scheme maximum of ₹{scheme.max_project_cost:,.0f}")
        else:
            score += 15.0
            match_factors.append(f"Estimated cost (₹{user_cost:,.0f}) fits within scheme financing ceiling")

        # Domain Specific Matches
        if "artisan" in user_project or "vishwakarma" in user_project:
            if scheme_category == "artisans" or "vishwakarma" in scheme_title or "virasat" in scheme_title:
                score += 25.0
                match_factors.append("Direct match for traditional artisans & craftspeople (Toolkit + Subvention)")
        elif "vendor" in user_project or "street" in user_project:
            if scheme_category == "street_vendor" or "svanidhi" in scheme_title or scheme_category == "microfinance":
                score += 25.0
                match_factors.append("Direct match for street vendors & micro retail kiosks (7% interest subsidy)")
        elif "manufacturing" in user_project or "industry" in user_project or "msme" in user_project:
            if "pmegp" in scheme_title or scheme_category == "manufacturing_services" or scheme_category == "term_loan":
                score += 25.0
                match_factors.append("High-value enterprise match: Up to 35% PMEGP capital subsidy or CGTMSE guarantee")
        elif "education" in user_project:
            if scheme_category == "education":
                score += 25.0
                match_factors.append("Direct match for higher professional / technical education loan")
        elif "green" in user_project or "solar" in user_project or "ev" in user_project:
            if scheme_category == "green_business":
                score += 25.0
                match_factors.append("Direct match for commercial EV / rooftop solar clean tech financing")
        elif "micro" in user_project or "women" in user_project:
            if "micro" in scheme_category or "mudra" in scheme_title or "samriddhi" in scheme_title:
                score += 20.0
                match_factors.append("Direct match for micro-credit and SHG trade development")

        # 5. Policy Multipliers: SHG, Udyam, Differently-Abled
        if getattr(user, 'is_shg_member', False) and ("SHG" in scheme_target or criteria.get("shg_eligible")):
            score += 10.0
            match_factors.append("Bonus: Active Self-Help Group (SHG) membership verified")

        if getattr(user, 'is_udyam_registered', False) and ("MSME" in scheme_target or criteria.get("udyam_registered")):
            score += 10.0
            match_factors.append("Bonus: Udyam MSME registration accelerates institutional sanction")

        if getattr(user, 'is_differently_abled', False) and ("PH" in scheme_target or "DIVYANG" in scheme_target):
            score += 10.0
            match_factors.append("Bonus: Special Divyangjan concessional quota eligible")

        # Cap score between 10 and 99
        final_score = max(15.0, min(99.0, score))

        if final_score >= 80:
            status = "Highly Eligible"
        elif final_score >= 60:
            status = "Eligible"
        else:
            status = "Partially Eligible"

        channel_partners = criteria.get("channel_partners", ["PSB", "RRB", "SCA", "DIC", "KVIC"])
        channel_guidelines = {
            "is_eligible_for_concessional": True,
            "channel_type": "Institutional Bank & Portal Channeling",
            "channel_partners_applicable": channel_partners,
            "promoter_margin_pct": float(scheme.promoter_contribution_min),
            "max_coverage_pct": float(scheme.channel_finance_coverage),
            "concessional_rate": float(scheme.concessional_interest_rate),
            "max_moratorium_months": scheme.max_moratorium_months,
            "subsidy_percentage": float(scheme.subsidy_percentage),
            "official_portal": scheme.application_url,
            "next_step": f"Apply online at {scheme.application_url or 'designated portal'} or visit nearest {', '.join(channel_partners[:3])}."
        }

        return {
            "score": round(final_score, 1),
            "status": status,
            "match_factors": match_factors,
            "channel_guidelines": channel_guidelines
        }
