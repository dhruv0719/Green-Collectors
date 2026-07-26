# backend/app/features/auth/service.py
from app.features.auth import schema
from sqlalchemy.ext.asyncio import AsyncSession
from app.features.auth.repository import create_user, get_user_by_email
from app.core.security import hash_password, verify_password, create_access_token, create_refresh_token

async def signup(db: AsyncSession, data: schema.UserSignupRequest) -> schema.UserResponse:
    user_email = await get_user_by_email(db, data.email)
    if user_email is not None:
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

    user_response = schema.UserResponse(
        id = created_user.id,
        first_name = created_user.first_name,
        last_name=created_user.last_name,
        email=created_user.email,
        city=created_user.city,
        country=created_user.country
    )

    return user_response

async def login(db: AsyncSession, data: schema.UserLoginRequest) -> schema.TokenResponse:
    user = await get_user_by_email(db, data.email)
    if user is None:
        raise ValueError("Invalid email or password")

    if not verify_password(user.hashed_password, data.password):
        raise ValueError("Invalid email or password")

    access_token = create_access_token(subject=str(user.id))
    refresh_token = create_refresh_token(subject=str(user.id))

    return schema.TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token
    )