from typing import List, Literal
from pydantic import BaseModel


class AnalyzeRequest(BaseModel):
    text: str


class Breakdown(BaseModel):
    contact: float
    corporate: float
    location: float
    family: float
    routine: float


class AnalyzeResponse(BaseModel):
    score: float
    risk_level: Literal["Low", "Medium", "High"]
    breakdown: Breakdown
    recommendations: List[str]
    risk_summary: str
    attacker_inference: List[str]

    class Config:
        allow_population_by_field_name = True