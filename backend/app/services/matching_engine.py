from typing import Dict, Any, List
from app.schemas.user import EntrepreneurProfileBase
from app.schemas.scheme import SchemeResponse


class RuleBasedMatchingEngine:
    """
    Evaluates hard eligibility constraints and weights demographic criteria
    specifically prioritizing marginalized entrepreneurs:
    - Women entrepreneurs
    - SC / ST / OBC / Minorities
    - Differently-abled individuals
    - Micro & small artisan/craft enterprises
    """

    @staticmethod
    def evaluate_eligibility(user: EntrepreneurProfileBase, scheme: SchemeResponse) -> Dict[str, Any]:
        score = 50.0  # Base eligibility score
        match_factors = []
        is_hard_disqualified = False

        # 1. Demographic Alignment
        target_demos = [d.lower() for d in scheme.target_demographics]
        
        # Gender Check
        if user.gender and user.gender.lower() == "female":
            if "women" in target_demos or "female" in target_demos:
                score += 25.0
                match_factors.append("Exclusive/priority allocation for Women Entrepreneurs")
        
        # Social Category Check
        if user.social_category:
            user_cat = user.social_category.lower()
            if any(cat in target_demos for cat in [user_cat, "sc", "st", "obc", "minority"]):
                score += 20.0
                match_factors.append(f"Targeted affirmative benefit for {user.social_category} community")

        # Differently-Abled Check
        if user.is_differently_abled:
            if "differently-abled" in target_demos or "pwd" in target_demos:
                score += 20.0
                match_factors.append("Special subsidy provision for Differently-Abled entrepreneurs")

        # 2. Business Type Alignment
        if scheme.eligible_business_types:
            eligible_types = [t.lower() for t in scheme.eligible_business_types]
            if user.business_type and user.business_type.lower() in eligible_types:
                score += 15.0
                match_factors.append(f"Business sector '{user.business_type}' is directly supported")
            else:
                score -= 10.0

        # 3. Udyam / MSME Registration Check
        criteria = scheme.eligibility_criteria or {}
        requires_udyam = criteria.get("requires_udyam", False)
        if requires_udyam and not user.is_udyam_registered:
            match_factors.append("Note: Udyam registration needed prior to subsidy disbursement")
            score -= 5.0

        # Cap score between 0 and 100
        final_score = max(10.0, min(99.0, score))

        if final_score >= 80:
            status = "Highly Eligible"
        elif final_score >= 60:
            status = "Eligible"
        else:
            status = "Partially Eligible"

        return {
            "score": round(final_score, 1),
            "status": status,
            "match_factors": match_factors
        }
