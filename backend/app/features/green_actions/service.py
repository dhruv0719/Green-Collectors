# backend/app/features/green_actions/service.py

from sqlalchemy.ext.asyncio import AsyncSession

from app.features.auth.model import User
from app.features.green_actions.model import GreenAction
from app.features.green_actions.schema import GreenActionCreate
from app.core.carbon_calculator import calculate_co2_saved
from app.features.green_actions.repository import create_green_action

async def log_green_action(db: AsyncSession, current_user: User, data: GreenActionCreate) -> GreenAction:
    co2_saved = calculate_co2_saved(
        category=data.category,
        activity=data.activity,
        quantity=data.quantity,
        unit=data.unit
    )

    created_green_action = await create_green_action(db=db, data=data, user_id=current_user.id, co2_saved=co2_saved)

    return created_green_action