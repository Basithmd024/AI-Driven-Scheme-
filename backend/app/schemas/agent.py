from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any


class AgentChatMessage(BaseModel):
    role: str = Field(..., description='"user" or "assistant"')
    content: str


class AgentChatRequest(BaseModel):
    """Conversational request to the Scheme Advisory Agent.

    `profile` carries the beneficiary's current form data so answers are
    personalized even when the question is vague ("which scheme for me?").
    """
    message: str = Field(..., min_length=1, max_length=4000)
    profile: Optional[Dict[str, Any]] = None
    history: List[AgentChatMessage] = Field(default_factory=list, max_length=20)
    language: Optional[str] = Field("en", description="UI language code (en, hi, te, ta, kn, mr, bn)")


class AgentToolStep(BaseModel):
    """A single tool invocation executed by the agent, surfaced for transparency."""
    tool: str
    detail: str


class AgentChatResponse(BaseModel):
    reply: str
    tools_used: List[AgentToolStep] = Field(default_factory=list)
    agent: str = "sahayak"
    engine: str = Field("rule-based", description='"llm" when a provider key is configured, otherwise "rule-based"')
