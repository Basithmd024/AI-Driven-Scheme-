"""
Samarthya Sahayak — Conversational AI Scheme Advisory Agent.

A tool-calling agent grounded in the platform's own services:
  - RuleBasedMatchingEngine + AISchemeRecommender  (scheme eligibility)
  - FinancialCalculatorService                     (EMI / moratorium math)
  - ChannelPartnerService                          (channel partner lookup)

Intent routing is deterministic (keyword scoring) so the agent works with ZERO
external dependencies. When OPENAI_API_KEY (or GEMINI_API_KEY) is configured,
the agent additionally uses the LLM to phrase the final grounded answer
(natural-language polish); the tools and facts remain server-side and verified
either way. If no key is present it falls back to deterministic template
answers — the assistant is fully functional offline.
"""

import os
import re
from decimal import Decimal, InvalidOperation
from typing import Any, Dict, List, Optional, Tuple

from app.schemas.agent import AgentChatRequest, AgentToolStep
from app.schemas.calculator import EMICalculationRequest
from app.schemas.user import EntrepreneurProfileBase
from app.services.ai_recommender import AISchemeRecommender
from app.services.financial_calculator import FinancialCalculatorService
from app.services.channel_partner_service import ChannelPartnerService


# ──────────────────────────────────────────────────────────────────────────────
# Profile extraction helpers
# ──────────────────────────────────────────────────────────────────────────────

_NUM_RE = re.compile(r"([\d][\d,]*(?:\.\d+)?)\s*(lakh|lakhs|lac|lacs|crore|crores|k|cr|l)?", re.IGNORECASE)


def _parse_amounts(text: str) -> List[Tuple[float, Optional[str]]]:
    """Extract rupee amounts from free text: '15 lakh', '3cr', '500000', '20k'."""
    out: List[Tuple[float, Optional[str]]] = []
    for m in _NUM_RE.finditer(text):
        raw, unit = m.group(1), (m.group(2) or "").lower()
        try:
            val = float(raw.replace(",", ""))
        except ValueError:
            continue
        if unit in ("lakh", "lakhs", "lac", "lacs", "l"):
            val *= 100_000
        elif unit in ("crore", "crores", "cr"):
            val *= 10_000_000
        elif unit == "k":
            val *= 1_000
        out.append((val, unit or None))
    return out


def _profile_from_request(payload: Optional[Dict[str, Any]], message: str) -> EntrepreneurProfileBase:
    """Merge the UI profile with details extracted from the chat message."""
    data: Dict[str, Any] = dict(payload or {})
    text = message.lower()

    # Amounts mentioned in the message override the form profile
    amounts = _parse_amounts(text)
    if amounts and ("income" in text or "salary" in text or "earn" in text):
        data["annual_family_income"] = int(min(amounts)[0])
    if amounts and any(k in text for k in ("project", "cost", "loan", "need", "invest", "business of")):
        data["estimated_project_cost"] = int(max(amounts)[0])

    if "female" in text or "woman" in text or "women" in text:
        data["gender"] = "female"
    if re.search(r"\bmale\b|\bman\b|\bmen\b", text):
        data["gender"] = "male"

    for cat, keys in {
        "SC": ["sc ", "scheduled caste", "dalit"],
        "ST": ["st ", "scheduled tribe", "tribal", "adivasi"],
        "OBC": ["obc", "backward class"],
        "Minority": ["minority", "muslim", "christian", "sikh", "buddhist", "jain", "parsi"],
        "General": ["general category", "unreserved"],
    }.items():
        if any(k in text for k in keys):
            data["social_category"] = cat

    if "shg" in text or "self help group" in text or "self-help group" in text:
        data["is_shg_member"] = True
    if "udyam" in text or "msme registered" in text:
        data["is_udyam_registered"] = True
    if "divyang" in text or "differently abled" in text or "disabled" in text:
        data["is_differently_abled"] = True

    if "artisan" in text or "crafts" in text or "vishwakarma" in text or "carpenter" in text or "potter" in text or "tailor" in text or "weaver" in text:
        data["project_type"] = "artisan_crafts"
    elif "vendor" in text or "hawker" in text or "svanidhi" in text or "stall" in text:
        data["project_type"] = "micro_retail"
    elif any(k in text for k in ("manufactur", "factory", "processing unit")):
        data["project_type"] = "msme_manufacturing"
    elif any(k in text for k in ("solar", "e-rickshaw", "electric vehicle", " ev ", "clean energy")):
        data["project_type"] = "green_business"
    elif any(k in text for k in ("shop", "trading", "retail store", "small business")):
        data["project_type"] = "small_business"

    # Defaults so validation passes even for a bare "hello"
    data.setdefault("full_name", "Applicant")
    data.setdefault("gender", "female")
    data.setdefault("social_category", "General")
    data.setdefault("annual_family_income", 250000)
    data.setdefault("project_type", "msme_manufacturing")
    data.setdefault("education_status", "Graduate")
    data.setdefault("estimated_project_cost", 1000000)
    data.setdefault("state", "Delhi")
    data.setdefault("district", "New Delhi")
    data.setdefault("is_differently_abled", False)
    data.setdefault("is_shg_member", False)
    data.setdefault("is_udyam_registered", False)

    try:
        return EntrepreneurProfileBase(**data)
    except Exception:
        # Last-resort minimal profile
        return EntrepreneurProfileBase(full_name="Applicant")


def _to_decimal(val: Any, default: str) -> Decimal:
    try:
        return Decimal(str(val))
    except (InvalidOperation, TypeError, ValueError):
        return Decimal(default)


# ──────────────────────────────────────────────────────────────────────────────
# The Agent
# ──────────────────────────────────────────────────────────────────────────────

class SchemeAdvisorAgent:
    """Deterministic, tool-grounded advisory agent with optional LLM phrasing."""

    AGENT_NAME = "sahayak"

    # Simple keyword-scored intent router (works for every supported language's
    # English fallback words; Hindi/Telugu users typically mix English keywords).
    INTENTS: Dict[str, List[str]] = {
        "emi": ["emi", "instalment", "installment", "repayment", "monthly payment", "moratorium", "tenure", "interest"],
        "partner": ["partner", "branch", "bank near", "nearby", "where to apply", "sca", "who lends", "disbursement", "locate"],
        "schemes": ["scheme", "yojana", "eligible", "eligibility", "subsidy", "recommend", "match", "loan for", "apply", "help me", "mudra", "pmegp", "standup", "stand-up", "vishwakarma", "svanidhi", "nsfdc", "nstfdc", "nbcfdc", "nmdfc", "mahila"],
        "compare": ["compare", "vs", "versus", "difference between", "better"],
        "documents": ["document", "paper", "kyc", "certificate needed", "checklist"],
    }

    def __init__(self) -> None:
        self.api_key = os.getenv("OPENAI_API_KEY") or os.getenv("GEMINI_API_KEY") or ""
        self.llm_model = os.getenv("AGENT_LLM_MODEL", "gpt-4o-mini")

    # ── Public entrypoint ─────────────────────────────────────────────────────
    def chat(self, req: AgentChatRequest) -> Tuple[str, str, List[AgentToolStep]]:
        profile = _profile_from_request(req.profile, req.message)
        intent = self._detect_intent(req.message)
        steps: List[AgentToolStep] = []

        if intent == "emi":
            answer = self._tool_emi(req, profile, steps)
        elif intent == "partner":
            answer = self._tool_partners(req, profile, steps)
        elif intent in ("compare", "documents"):
            answer = self._tool_schemes(req, profile, steps, intent)
        else:
            answer = self._tool_schemes(req, profile, steps, "schemes")

        # Optional LLM polish — same facts, friendlier phrasing
        engine = "rule-based"
        if self.api_key:
            polished = self._llm_phrase(req, profile, answer, steps)
            if polished:
                answer = polished
                engine = "llm"

        return answer, engine, steps

    # ── Intent router ─────────────────────────────────────────────────────────
    def _detect_intent(self, message: str) -> str:
        text = f" {message.lower()} "

        # Specific, high-signal phrases decide first (multi-word beats single keyword)
        if any(p in text for p in ("where do i apply", "where to apply", "which bank", "bank near", "near me", "nearest branch")):
            return "partner"
        if any(p in text for p in ("document", "documents", "paperwork", "kyc", "checklist", "papers")):
            return "documents"

        best_intent, best_score = "schemes", 0
        for intent, keywords in self.INTENTS.items():
            score = sum((3 if " " in kw else 1) for kw in keywords if kw in text)
            if score > best_score:
                best_intent, best_score = intent, score

        # Amount + repayment words -> EMI even without literal "EMI"
        if best_intent == "schemes" and _parse_amounts(message) and any(w in text for w in ("repay", "monthly", "instal", "install")):
            return "emi"
        return best_intent

    # ── TOOL 1: scheme eligibility ────────────────────────────────────────────
    def _tool_schemes(self, req: AgentChatRequest, profile: EntrepreneurProfileBase,
                      steps: List[AgentToolStep], intent: str) -> str:
        # Lazy import avoids a circular dependency with app.api.v1.__init__
        from app.api.v1.schemes import DEFAULT_SCHEMES

        steps.append(AgentToolStep(
            tool="scheme_matching_engine",
            detail=f"Evaluated profile: {profile.social_category}, {profile.gender}, income ₹{profile.annual_family_income:,.0f}, project ₹{profile.estimated_project_cost:,.0f} ({profile.state})"
        ))
        matches = AISchemeRecommender.recommend(profile, DEFAULT_SCHEMES)

        if not matches:
            return (
                "Based on your profile, none of the 12 central schemes currently match the statutory rules "
                "(income ceilings, category mandates, gender exclusivity). Try raising/lowering the project cost, "
                "or explore PMEGP / PM MUDRA which have no income ceiling and are open to all categories."
            )

        lines: List[str] = []
        for m in matches[:3]:
            s = m.scheme
            subsidy = f", {s.subsidy_percentage}% capital subsidy" if s.subsidy_percentage and s.subsidy_percentage > 0 else ""
            lines.append(
                f"• {s.title} — {s.concessional_interest_rate}% p.a., up to ₹{s.max_project_cost:,.0f}"
                f" ({s.channel_finance_coverage}% coverage{subsidy}). Apply: {s.application_url}"
            )
        total = len(matches)
        header = f"Top {min(3, total)} of {total} schemes you are eligible for:"
        if intent == "compare":
            header = f"You qualify for {total} schemes — here's the comparison of the top 3:"
        elif intent == "documents":
            docs = matches[0].required_documents
            doc_lines = "\n".join(f"• {d}" for d in docs[:6])
            header = f"For {matches[0].scheme.title}, you will need:\n{doc_lines}"
            return f"{header}\n\nFull document list and routing: expand the scheme card in the Recommender tab."
        return f"{header}\n" + "\n".join(lines)

    # ── TOOL 2: EMI simulation ────────────────────────────────────────────────
    def _tool_emi(self, req: AgentChatRequest, profile: EntrepreneurProfileBase,
                  steps: List[AgentToolStep]) -> str:
        amount = float(profile.estimated_project_cost or 1000000)
        rate = 8.0
        tenure = 5
        moratorium = 6

        text = req.message.lower()
        m = _parse_amounts(text)
        if m and any(k in text for k in ("loan", "project", "borrow", "need")):
            amount = max(v for v, _ in m)
        rm = re.search(r"(\d+(?:\.\d+)?)\s*%", text)
        if rm:
            rate = min(16.0, max(3.0, float(rm.group(1))))
        tm = re.search(r"(\d+)\s*(?:year|yr|saal)", text)
        if tm:
            tenure = min(15, max(1, int(tm.group(1))))
        if "no moratorium" in text or "without moratorium" in text:
            moratorium = 0

        steps.append(AgentToolStep(
            tool="concessional_emi_calculator",
            detail=f"Simulated ₹{amount:,.0f} @ {rate}% p.a., {tenure}y tenure, {moratorium}m moratorium"
        ))

        calc = FinancialCalculatorService.calculate_emi_and_schedule(
            EMICalculationRequest(
                project_cost=_to_decimal(amount, "1000000"),
                concessional_rate=_to_decimal(rate, "8.0"),
                tenure_years=tenure,
                moratorium_months=moratorium,
                promoter_share_pct=_to_decimal(10, "10"),
                commercial_rate_benchmark=_to_decimal(13.5, "13.5"),
            )
        )
        savings = float(calc.beneficiary_savings_amount)
        return (
            f"For a ₹{amount:,.0f} loan at {rate}% p.a. over {tenure} years (with a {moratorium}-month moratorium):\n"
            f"• Monthly EMI after moratorium: ₹{float(calc.monthly_emi_after_moratorium):,.0f}\n"
            f"• Interest during moratorium: ₹{float(calc.moratorium_monthly_interest):,.0f}/month\n"
            f"• Total interest outgo: ₹{float(calc.total_concessional_interest):,.0f}\n"
            f"• Your saving vs a commercial 13.5% bank loan: ₹{savings:,.0f}\n"
            f"Run the exact numbers in the EMI & Moratorium Simulator tab to adjust tenure and promoter margin."
        )

    # ── TOOL 3: channel partner lookup ────────────────────────────────────────
    def _tool_partners(self, req: AgentChatRequest, profile: EntrepreneurProfileBase,
                       steps: List[AgentToolStep]) -> str:
        steps.append(AgentToolStep(
            tool="channel_partner_locator",
            detail=f"Searched active partners in {profile.state} (NPA < 5%)"
        ))
        from app.schemas.partner import ChannelPartnerFilter
        filters = ChannelPartnerFilter(
            state=profile.state or None,
            active_only=True,
        )
        # ChannelPartnerFilter exposes user_lat/user_lng (optional; omitted here —
        # the locator ranks by state and health, the UI tab adds GPS ranking).
        partners = ChannelPartnerService.filter_and_route_partners(filters)

        if not partners:
            return (
                f"No verified channel partners found for {profile.state} in the current registry. "
                f"Try the Channel Partner Locator tab with a nearby state, or call the national helpline 14566."
            )

        lines = []
        for p in partners[:3]:
            lines.append(f"• {p.name} ({p.category}) — {p.address}, ☎ {p.phone}, ~{p.avg_disbursement_days} days to disburse")
        return (
            f"Top active channel partners in {profile.state}:\n" + "\n".join(lines) +
            "\n\nOpen the Channel Partner Locator tab for the map view, health scores and one-click calling."
        )

    # ── Optional LLM phrasing layer ───────────────────────────────────────────
    def _llm_phrase(self, req: AgentChatRequest, profile: EntrepreneurProfileBase,
                    grounded_answer: str, steps: List[AgentToolStep]) -> Optional[str]:
        """Rephrase the verified tool answer conversationally. Facts stay server-side."""
        try:
            import httpx
            lang_note = f" Reply in {req.language}." if req.language and req.language != "en" else ""
            prompt = (
                "You are 'Sahayak', a warm government-scheme advisor for Indian entrepreneurs. "
                "Rewrite the FACTS below into a short, friendly reply. Do NOT change any numbers, "
                "scheme names, rates, or URLs. Do not add new schemes." + lang_note +
                f"\n\nUser asked: {req.message}\n\nVerified facts:\n{grounded_answer}"
            )
            with httpx.Client(timeout=12.0) as client:
                resp = client.post(
                    "https://api.openai.com/v1/chat/completions",
                    headers={"Authorization": f"Bearer {self.api_key}"},
                    json={
                        "model": self.llm_model,
                        "messages": [{"role": "user", "content": prompt}],
                        "temperature": 0.3,
                        "max_tokens": 400,
                    },
                )
                if resp.status_code == 200:
                    data = resp.json()
                    content = data.get("choices", [{}])[0].get("message", {}).get("content")
                    return content or grounded_answer
        except Exception:
            pass
        return None
