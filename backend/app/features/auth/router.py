# backend/app/feature/auth/router.py
from typing import Annotated
from fastapi import APIRouter, Depends

from sqlalchemy.ext.asyncio import AsyncSession

from app.config.database import get_db
from app.core.dependencies import get_current_user
from app.features.auth import schema, service, model

router = APIRouter(prefix="/auth", tags=["Authentication"])

DBSession = Annotated[AsyncSession, Depends(get_db)]
CurrentUser = Annotated[model.User, Depends(get_current_user)]

@router.post("/signup", response_model=schema.AuthResponse, status_code=201)
async def signup(payload: schema.UserSignupRequest, db: DBSession):
    return await service.signup(db=db, data=payload)

@router.post("/login", response_model=schema.AuthResponse)
async def login(payload: schema.UserLoginRequest, db: DBSession):
    return await service.login(db=db, data=payload)

@router.get("/me", response_model=schema.UserResponse)
async def me(current_user: CurrentUser):
    return current_user