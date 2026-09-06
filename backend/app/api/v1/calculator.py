from fastapi import APIRouter
from app.schemas.calculator import EMICalculationRequest, EMICalculationResponse
from app.services.financial_calculator import FinancialCalculatorService

router = APIRouter()


@router.post("/calculate", response_model=EMICalculationResponse, tags=["Financial Calculator"])
async def calculate_emi(request: EMICalculationRequest):
    """
    Dynamic Financial Calculator for Concessional Channel Finance:
    - Accounts for project cost and promoter share (covers up to 90%)
    - Handles concessional interest rates (e.g. 6.5% - 8.0%)
    - Supports moratorium periods (3 to 12 months)
    - Compares savings vs commercial bank benchmarks (12% - 15%)
    - Generates month-by-month amortization schedule
    """
    return FinancialCalculatorService.calculate_emi_and_schedule(request)
