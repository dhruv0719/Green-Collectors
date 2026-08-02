from typing import Annotated

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.config.database import get_db
from app.core.dependencies import get_current_user
from app.features.auth.model import User
from app.features.carbon_footprint import schema, service

router = APIRouter(prefix="/carbon-footprint", tags=["Carbon Footprint"])

DBSession = Annotated[AsyncSession, Depends(get_db)]
CurrentUser = Annotated[User, Depends(get_current_user)]


@router.post("/", response_model=schema.CarbonFootprintResponse, status_code=status.HTTP_201_CREATED)
async def create_carbon_footprint(data: schema.CarbonFootprintCreate, db: DBSession, current_user: CurrentUser):
    return await service.log_carbon_footprint(db=db, current_user=current_user, data=data)


@router.get("/", response_model=list[schema.CarbonFootprintResponse])
async def list_carbon_footprints(
    db: DBSession,
    current_user: CurrentUser,
    limit: Annotated[int, Query(ge=1, le=100)] = 50,
    offset: Annotated[int, Query(ge=0)] = 0,
):
    return await service.list_my_carbon_footprints(db, current_user, limit=limit, offset=offset)


@router.get("/stats", response_model=schema.CarbonFootprintStats)
async def carbon_footprint_stats(db: DBSession, current_user: CurrentUser):
    return await service.get_carbon_footprint_stats(db, current_user)
