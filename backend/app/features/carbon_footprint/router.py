# backend/app/features/carbon_footprint/router.py

from fastapi import APIRouter, Depends, status

from sqlalchemy.ext.asyncio import AsyncSession

from app.config.database import get_db
from app.core.dependencies import get_current_user

from app.features.auth.model import User
from app.features.carbon_footprint import schema, service, model

router = APIRouter(prefix="/carbon-footprint", tags=["Carbon Footprint"])

@router.post("/", response_model=schema.CarbonFootprintResponse, status_code=status.HTTP_201_CREATED)
async def create_carbon_footprint(data: schema.CarbonFootprintCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    return await service.log_carbon_footprint(
        db=db,
        current_user=current_user,
        data=data,
    )