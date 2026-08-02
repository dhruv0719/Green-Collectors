from typing import Annotated

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.config.database import get_db
from app.core.dependencies import get_current_user
from app.features.auth.model import User
from app.features.green_actions import schema, service

router = APIRouter(prefix="/green-actions", tags=["Green Actions"])

DBSession = Annotated[AsyncSession, Depends(get_db)]
CurrentUser = Annotated[User, Depends(get_current_user)]


@router.post("/", response_model=schema.GreenActionResponse, status_code=status.HTTP_201_CREATED)
async def create_green_action(data: schema.GreenActionCreate, db: DBSession, current_user: CurrentUser):
    return await service.log_green_action(db=db, current_user=current_user, data=data)


@router.get("/", response_model=list[schema.GreenActionResponse])
async def list_green_actions(
    db: DBSession,
    current_user: CurrentUser,
    limit: Annotated[int, Query(ge=1, le=100)] = 50,
    offset: Annotated[int, Query(ge=0)] = 0,
):
    return await service.list_my_green_actions(db, current_user, limit=limit, offset=offset)


@router.get("/stats", response_model=schema.GreenActionStats)
async def green_action_stats(db: DBSession, current_user: CurrentUser):
    return await service.get_green_action_stats(db, current_user)
