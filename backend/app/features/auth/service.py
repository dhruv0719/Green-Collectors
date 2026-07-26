# backend/app/features/auth/service.py
from sqlalchemy.ext.asyncio import AsyncSession

from app.features.auth import schema
from app.features.auth.model import User
from app.features.auth.repository import create_user, get_user_by_email
from app.core.security import hash_password, verify_password, create_access_token, create_refresh_token


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
        raise ValueError("Email already exists")

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
        raise ValueError("Invalid email or password")

    if not verify_password(user.hashed_password, data.password):
        raise ValueError("Invalid email or password")

    return build_auth_response(user)
