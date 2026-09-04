from typing import List
from app.schemas.user import EntrepreneurProfileBase
from app.schemas.scheme import SchemeResponse, SchemeMatchResult
from app.services.matching_engine import RuleBasedMatchingEngine


class AISchemeRecommender:
    """
    AI Recommendation & Explanation Service.
    Combines rule scores with personalized plain-language explanations,
    highlighting subsidies, credit guarantees, and document checklists.
    """

    @classmethod
    def recommend(
        cls,
        user: EntrepreneurProfileBase,
        schemes: List[SchemeResponse]
    ) -> List[SchemeMatchResult]:
        results = []

        for scheme in schemes:
            eval_result = RuleBasedMatchingEngine.evaluate_eligibility(user, scheme)
            factors = eval_result["match_factors"]

            # Generate plain-language AI explanation
            reasoning = cls._generate_reasoning(user, scheme, factors)
            benefits = cls._extract_benefits(scheme)
            docs = cls._generate_document_checklist(user, scheme)

            results.append(
                SchemeMatchResult(
                    scheme=scheme,
                    match_score=eval_result["score"],
                    eligibility_status=eval_result["status"],
                    ai_reasoning=reasoning,
                    key_benefits=benefits,
                    required_documents=docs
                )
            )

        # Sort highest match score first
        results.sort(key=lambda x: x.match_score, reverse=True)
        return results

    @staticmethod
    def _generate_reasoning(user: EntrepreneurProfileBase, scheme: SchemeResponse, factors: List[str]) -> str:
        if not factors:
            return f"You can apply for {scheme.title} as a general micro/small enterprise applicant."
        
        factor_summary = "; ".join(factors)
        return (
            f"Strong match for {user.full_name or 'your profile'} because: {factor_summary}. "
            f"This program provides targeted assistance under {scheme.ministry_or_org}."
        )

    @staticmethod
    def _extract_benefits(scheme: SchemeResponse) -> List[str]:
        benefits = []
        if scheme.subsidy_percentage:
            benefits.append(f"Government Capital Subsidy up to {scheme.subsidy_percentage}%")
        if scheme.max_funding_amount:
            benefits.append(f"Financial assistance / loan limit up to ₹{scheme.max_funding_amount:,.0f}")
        benefits.append("Collateral-free credit support & mentorship access")
        return benefits

    @staticmethod
    def _generate_document_checklist(user: EntrepreneurProfileBase, scheme: SchemeResponse) -> List[str]:
        docs = [
            "Aadhaar Card / Government Photo ID",
            "Bank Account Details (Passbook / Cancelled Cheque)",
            "Project Report / Business Plan Summary"
        ]
        if user.social_category and user.social_category.upper() in ["SC", "ST", "OBC"]:
            docs.append(f"Caste / Community Certificate ({user.social_category})")
        if user.is_differently_abled:
            docs.append("Disability Certificate (UDID)")
        if not user.is_udyam_registered:
            docs.append("Udyam Registration Certificate (Free online via udyamregistration.gov.in)")
        else:
            docs.append("Existing Udyam Registration Certificate")
        return docs
