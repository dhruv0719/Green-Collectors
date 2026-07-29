# backend/app/features/green_actions/schema.py
from pydantic import BaseModel
from datetime import datetime
from uuid import UUID

class GreenActionCreate(BaseModel):
    category: str
    activity: str
    quantity: float
    unit: str
    location: str

class GreenActionResponse(BaseModel):
    id: UUID
    category: str
    activity: str
    quantity: float
    unit: str
    location: str
    co2_saved: float
    created_at: datetime
    updated_at: datetime