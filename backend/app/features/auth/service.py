# backend/app/features/auth/service.py
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException, status

from app.features.auth import schema
from app.features.auth.model import User
from app.features.auth.repository import create_user, get_user_by_email, get_user_by_id
from app.core.security import (
    hash_password,
    verify_password,
    create_access_token,
    create_refresh_token,
    decode_token,
)


def build_auth_response(user: User) -> schema.AuthResponse:
    access_token = create_access_token(subject=str(user.id))
    refresh_token = create_refresh_token(subject=str(user.id))

    return schema.AuthResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        user_id=user.id,
    )

async def signup(db: AsyncSession, data: schema.UserSignupRequest) -> schema.AuthResponse:
    existing_user = await get_user_by_email(db, data.email)
    if existing_user is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already exists",
        )

    hashed_password = hash_password(data.password)
    user_data = schema.UserCreate(
        first_name = data.first_name,
        last_name = data.last_name,
        email = data.email,
        hashed_password = hashed_password,
        city = data.city,
        country = data.country
    )

    created_user  = await create_user(db, user_data)

    return build_auth_response(created_user)

async def login(db: AsyncSession, data: schema.UserLoginRequest) -> schema.AuthResponse:
    user = await get_user_by_email(db, data.email)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    if not verify_password(user.hashed_password, data.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    return build_auth_response(user)


async def refresh_access_token(db: AsyncSession, data: schema.RefreshRequest) -> schema.AuthResponse:
    """Exchange a valid refresh token for a fresh access + refresh pair.

    Refresh tokens are stateless JWTs (signed, type-scoped, expiring). A real
    production system would also store issued refresh tokens so they can be
    revoked; see note.md. For the MVP we validate signature + type + expiry
    and confirm the user still exists.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or expired refresh token",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = decode_token(data.refresh_token)
    except ValueError:
        raise credentials_exception from None

    if payload.get("type") != "refresh":
        raise credentials_exception

    user_id = payload.get("sub")
    if user_id is None:
        raise credentials_exception

    user = await get_user_by_id(db, UUID(user_id))
    if user is None:
        raise credentials_exception

    return build_auth_response(user)
