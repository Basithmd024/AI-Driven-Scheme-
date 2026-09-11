from fastapi import APIRouter

from app.schemas.agent import AgentChatRequest, AgentChatResponse
from app.services.scheme_advisor_agent import SchemeAdvisorAgent

router = APIRouter()
agent = SchemeAdvisorAgent()


@router.post("/chat", response_model=AgentChatResponse, tags=["AI Agent"])
async def agent_chat(request: AgentChatRequest):
    """
    Samarthya Sahayak — conversational scheme advisory agent.

    Deterministic intent routing invokes grounded platform tools:
      - scheme_matching_engine       (eligibility across 12 India-wide schemes)
      - concessional_emi_calculator  (EMI, moratorium, commercial-benchmark savings)
      - channel_partner_locator      (active partners filtered by state & NPA health)

    Replies are generated from verified tool output (rule-based template phrasing),
    or polished by an LLM when OPENAI_API_KEY / GEMINI_API_KEY is configured.
    """
    reply, engine, steps = agent.chat(request)
    return AgentChatResponse(reply=reply, tools_used=steps, engine=engine, agent=agent.AGENT_NAME)
