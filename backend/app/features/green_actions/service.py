from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException, status

from app.features.auth.model import User
from app.features.green_actions.model import GreenAction
from app.features.green_actions.schema import GreenActionCreate, GreenActionStats
from app.core.carbon_calculator import calculate_co2_saved
from app.core.exceptions import CalculationError
from app.features.green_actions.repository import (
    create_green_action,
    list_green_actions,
    get_green_action_totals,
    get_green_action_totals_by_category,
    get_weekly_trend,
)


async def log_green_action(db: AsyncSession, current_user: User, data: GreenActionCreate) -> GreenAction:
    try:
        co2_saved = calculate_co2_saved(
            category=data.category,
            activity=data.activity,
            quantity=data.quantity,
            unit=data.unit,
        )
    except CalculationError as exc:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(exc)) from exc

    return await create_green_action(db=db, data=data, user_id=current_user.id, co2_saved=co2_saved)


async def list_my_green_actions(
    db: AsyncSession, current_user: User, *, limit: int = 50, offset: int = 0
) -> list[GreenAction]:
    return await list_green_actions(db, current_user.id, limit=limit, offset=offset)


async def get_green_action_stats(db: AsyncSession, current_user: User) -> GreenActionStats:
    totals = await get_green_action_totals(db, current_user.id)
    by_category = await get_green_action_totals_by_category(db, current_user.id)
    trend = await get_weekly_trend(
        db, current_user.id, GreenAction, GreenAction.co2_saved, weeks=6
    )
    return GreenActionStats(
        **totals,
        by_category=by_category,
        weekly_trend=trend,
    )
