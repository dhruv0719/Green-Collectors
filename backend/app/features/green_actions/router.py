# backend/app/features/green_actions/router.py

from fastapi import APIRouter, Depends, status

from sqlalchemy.ext.asyncio import AsyncSession

from app.config.database import get_db
from app.core.dependencies import get_current_user

from app.features.auth.model import User
from app.features.green_actions import schema, service, model

router = APIRouter(prefix="/green-actions", tags=["Green Actions"])

@router.post("/", response_model=schema.GreenActionResponse, status_code=status.HTTP_201_CREATED)
async def create_green_action(data: schema.GreenActionCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    return await service.log_green_action(
        db=db,
        current_user=current_user,
        data=data,
    )