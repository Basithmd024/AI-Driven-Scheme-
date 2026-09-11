from typing import List
from app.schemas.user import EntrepreneurProfileBase
from app.schemas.scheme import SchemeResponse, SchemeMatchResult
from app.services.matching_engine import RuleBasedMatchingEngine


class AISchemeRecommender:
    """
    AI Recommendation & Explanation Service.
    Combines rule-based evaluation with tailored plain-language explanations,
    highlighting concessional interest rates, moratorium periods, 
    channel financing rules, and document checklists.
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
            channel_gl = eval_result.get("channel_guidelines", {})

            # Hard disqualification: profile violates a statutory rule (income ceiling, gender exclusivity, category mismatch)
            is_disqualified = (
                eval_result.get("is_disqualified", False) or
                eval_result["status"] in ("Income Exceeded", "Gender Specific", "Disqualified", "Category Mismatch")
            )

            # When a person is not eligible by details, DO NOT return / show this scheme
            if is_disqualified:
                continue

            reasoning = cls._generate_reasoning(user, scheme, factors, eval_result["status"])
            benefits = cls._extract_benefits(scheme)
            docs = cls._generate_document_checklist(user, scheme)

            results.append(
                SchemeMatchResult(
                    scheme=scheme,
                    match_score=eval_result["score"],
                    eligibility_status=eval_result["status"],
                    ai_reasoning=reasoning,
                    key_benefits=benefits,
                    required_documents=docs,
                    channel_guidelines=channel_gl,
                    is_disqualified=False,
                    disqualification_reason=None
                )
            )

        # Sort highest match score first
        results.sort(key=lambda x: x.match_score, reverse=True)
        return results

    @staticmethod
    def _generate_reasoning(
        user: EntrepreneurProfileBase,
        scheme: SchemeResponse,
        factors: List[str],
        status: str
    ) -> str:
        if status == "Income Exceeded":
            return (
                f"Family income of ₹{user.annual_family_income:,.0f} exceeds the ₹5.00 Lakhs limit "
                f"for concessional channel finance under {scheme.title}. You may explore Stand-Up India or regular commercial bank MSME loans."
            )

        if not factors:
            return f"You can explore {scheme.title} through your State Channelizing Agency or designated bank."

        factor_summary = "; ".join(factors)
        return (
            f"Recommended for {user.full_name or 'applicant'}: {factor_summary}. "
            f"Financed at concessional {scheme.concessional_interest_rate}% p.a. covering up to {scheme.channel_finance_coverage}% of project cost "
            f"with up to {scheme.max_moratorium_months} months moratorium. Funds are routed through authorized Channel Partners (SCAs, Banks, RRBs, NBFC-MFIs)."
        )

    @staticmethod
    def _extract_benefits(scheme: SchemeResponse) -> List[str]:
        benefits = [
            f"Concessional Interest Rate of {scheme.concessional_interest_rate}% p.a.",
            f"Up to {scheme.channel_finance_coverage}% project cost funded through Channel Partners",
            f"Moratorium / Grace Period: up to {scheme.max_moratorium_months} months",
            f"Maximum project limit: ₹{scheme.max_project_cost:,.0f}" if scheme.max_project_cost else "Flexible project limit",
            f"Promoter Margin Requirement: only {scheme.promoter_contribution_min}%"
        ]
        if scheme.subsidy_percentage and scheme.subsidy_percentage > 0:
            benefits.append(f"Capital subsidy up to {scheme.subsidy_percentage}%")
        return benefits

    @staticmethod
    def _generate_document_checklist(user: EntrepreneurProfileBase, scheme: SchemeResponse) -> List[str]:
        docs = [
            "Scheduled Caste (SC) Certificate issued by competent revenue authority",
            f"Family Income Certificate showing annual income <= ₹5.00 Lakhs",
            "Aadhaar Card & Voter ID (Proof of Identity & Residence)",
            "Bank Account Passbook / Cancelled Cheque with IFSC",
        ]

        # Scheme-specific additions
        if scheme.category == "education":
            docs.append("Admission Offer Letter / Proof from recognized University/College")
            docs.append("Fee Structure breakdown attested by institution")
            docs.append("Previous academic Marksheets (10th, 12th, Degree)")
            if "Overseas" in scheme.title:
                docs.append("Valid Passport & Student Visa approval copy")
                docs.append("I-20 / CAS statement with living cost estimate")
        elif scheme.category == "term_loan":
            docs.append("Detailed Project Report (DPR) with estimated costs & cash flows")
            docs.append("Proforma Invoices / Quotations for machinery & equipment")
            docs.append("Premises lease deed or title deed")
        elif scheme.category == "green_business":
            docs.append("Commercial Driving License (for E-Rickshaws)")
            docs.append("Vendor quotation from MNRE/Discom approved supplier")
        elif scheme.category == "women_microfinance":
            if user.is_shg_member:
                docs.append("SHG Membership Resolution & Inter-se Agreement")
            else:
                docs.append("Individual Trade / Micro-activity Plan")
        else:
            docs.append("Brief description of business/trade activity")

        return docs
