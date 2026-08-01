# backend/app/features/carbon_footprint/schema.py
from uuid import UUID
from datetime import datetime
from pydantic import BaseModel, ConfigDict

from app.features.carbon_footprint.constants import Category, Unit

class CarbonFootprintCreate(BaseModel):
    category: Category
    activity: str
    quantity: float
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