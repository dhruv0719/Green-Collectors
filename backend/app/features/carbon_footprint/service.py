from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException, status

from app.features.auth.model import User
from app.features.carbon_footprint.model import CarbonFootprint
from app.features.carbon_footprint.schema import CarbonFootprintCreate, CarbonFootprintStats
from app.core.carbon_calculator import calculate_co2_emitted
from app.core.exceptions import CalculationError
from app.features.carbon_footprint.repository import (
    create_carbon_footprint,
    list_carbon_footprints,
    get_carbon_footprint_totals,
    get_carbon_footprint_totals_by_category,
)
from app.features.green_actions.repository import get_weekly_trend


async def log_carbon_footprint(db: AsyncSession, current_user: User, data: CarbonFootprintCreate) -> CarbonFootprint:
    try:
        co2_emitted = calculate_co2_emitted(
            category=data.category,
            activity=data.activity,
            quantity=data.quantity,
            unit=data.unit,
        )
    except CalculationError as exc:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(exc)) from exc

    return await create_carbon_footprint(db=db, data=data, user_id=current_user.id, co2_emitted=co2_emitted)


async def list_my_carbon_footprints(
    db: AsyncSession, current_user: User, *, limit: int = 50, offset: int = 0
) -> list[CarbonFootprint]:
    return await list_carbon_footprints(db, current_user.id, limit=limit, offset=offset)


async def get_carbon_footprint_stats(db: AsyncSession, current_user: User) -> CarbonFootprintStats:
    totals = await get_carbon_footprint_totals(db, current_user.id)
    by_category = await get_carbon_footprint_totals_by_category(db, current_user.id)
    trend = await get_weekly_trend(
        db, current_user.id, CarbonFootprint, CarbonFootprint.co2_emitted, weeks=6
    )
    return CarbonFootprintStats(
        **totals,
        by_category=by_category,
        weekly_trend=trend,
    )
