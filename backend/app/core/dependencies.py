# backend/app/core/dependencies.py
from uuid import UUID
from typing import Annotated
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

from sqlalchemy.ext.asyncio import AsyncSession

from app.config.database import get_db
from app.features.auth.model import User
from app.core.security import decode_token
from app.features.auth.repository import get_user_by_id


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")

async def get_current_user(db: Annotated[AsyncSession, Depends(get_db)], token: Annotated[str, Depends(oauth2_scheme)]) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = decode_token(token)

        user_id = payload.get("sub")
        if user_id is None:
            raise credentials_exception

        if payload.get("type") != "access":
            raise credentials_exception

        user = await get_user_by_id(db, UUID(user_id))
        if user is None:
            raise credentials_exception

    except ValueError:
        raise credentials_exception
    
    return user