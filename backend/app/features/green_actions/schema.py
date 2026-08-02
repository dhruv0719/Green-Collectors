# backend/app/features/green_actions/schema.py
from uuid import UUID
from datetime import date, datetime
from pydantic import BaseModel, ConfigDict, Field

from app.features.green_actions.constants import Category, Unit


class TrendPoint(BaseModel):
    """One bucket in a weekly trend series."""
    week_start: date
    total: float

class GreenActionCreate(BaseModel):
    category: Category
    activity: str
    quantity: float = Field(gt=0, description="Quantity must be positive")
    unit: Unit
    location: str

class GreenActionResponse(BaseModel):
    id: UUID
    category: Category
    activity: str
    quantity: float
    unit: Unit
    location: str
    co2_saved: float
    created_at: datetime
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)


class GreenActionCategoryBreakdown(BaseModel):
    category: str
    co2_saved: float


class GreenActionStats(BaseModel):
    total_co2_saved: float
    total_trees: int
    total_actions: int
    by_category: list[GreenActionCategoryBreakdown]
    weekly_trend: list[TrendPoint]
