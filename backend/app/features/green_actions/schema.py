# backend/app/features/green_actions/schema.py
from uuid import UUID
from datetime import datetime
from pydantic import BaseModel, ConfigDict

from app.features.green_actions.constants import Category, Unit

class GreenActionCreate(BaseModel):
    category: Category
    activity: str
    quantity: float
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