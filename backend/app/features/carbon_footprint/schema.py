# backend/app/features/carbon_footprint/schema.py
from uuid import UUID
from datetime import date, datetime
from pydantic import BaseModel, ConfigDict, Field

from app.features.carbon_footprint.constants import Category, Unit
from app.features.green_actions.schema import TrendPoint

class CarbonFootprintCreate(BaseModel):
    category: Category
    activity: str
    quantity: float = Field(gt=0, description="Quantity must be positive")
    unit: Unit

class CarbonFootprintResponse(BaseModel):
    id: UUID
    category: Category
    activity: str
    quantity: float
    unit: Unit
    co2_emitted: float
    created_at: datetime
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)


class CarbonFootprintCategoryBreakdown(BaseModel):
    category: str
    co2_emitted: float


class CarbonFootprintStats(BaseModel):
    total_co2_emitted: float
    total_entries: int
    by_category: list[CarbonFootprintCategoryBreakdown]
    weekly_trend: list[TrendPoint]