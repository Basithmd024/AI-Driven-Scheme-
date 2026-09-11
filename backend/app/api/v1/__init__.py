from fastapi import APIRouter
from app.api.v1.schemes import router as schemes_router
from app.api.v1.matching import router as matching_router
from app.api.v1.users import router as users_router
from app.api.v1.calculator import router as calculator_router
from app.api.v1.partners import router as partners_router
from app.api.v1.agent import router as agent_router

api_router = APIRouter()

# Include all sub-routers
api_router.include_router(schemes_router, prefix="/schemes", tags=["Schemes"])
api_router.include_router(matching_router, prefix="/matching", tags=["AI Scheme Matching"])
api_router.include_router(calculator_router, prefix="/calculator", tags=["Financial Calculator"])
api_router.include_router(partners_router, prefix="/partners", tags=["Channel Partners & Routing"])
api_router.include_router(users_router, prefix="/users", tags=["Entrepreneurs"])
api_router.include_router(agent_router, prefix="/agent", tags=["AI Agent"])


@api_router.get("/status", tags=["Status"])
async def check_api_status():
    return {
        "status": "online",
        "version": "v1",
        "description": "SC Concessional Channel Finance & AI Scheme Matching Engine API",
        "modules": [
            "Smart Scheme Recommender (Income <= 5L ceiling, NSFDC/NBCFDC schemes)",
            "Financial Calculator (6.5%-8% Concessional EMI with 3-12m Moratorium)",
            "Geo-Spatial Partner Locator & Router (NPA & Fund Utilization Health Filtering)",
            "Sahayak Conversational AI Agent (tool-grounded scheme/EMI/partner advisory)"
        ]
    }


@api_router.get("/health", tags=["Health"])
def health():
    return {"status": "ok"}
