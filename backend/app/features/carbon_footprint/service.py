# backend/app/features/carbon_footprint/service.py
from sqlalchemy.ext.asyncio import AsyncSession

from app.features.auth.model import User
from app.features.carbon_footprint.model import CarbonFootprint
from app.features.carbon_footprint.schema import CarbonFootprintCreate
from app.core.carbon_calculator import calculate_co2_emitted
from app.features.carbon_footprint.repository import create_carbon_footprint

async def log_carbon_footprint(db: AsyncSession, current_user: User, data: CarbonFootprintCreate) -> CarbonFootprint:
    co2_emitted = calculate_co2_emitted(
        category=data.category,
        activity=data.activity,
        quantity=data.quantity,
        unit=data.unit
    )

    created_carbon_footprint = await create_carbon_footprint(db=db, data=data, user_id=current_user.id, co2_emitted=co2_emitted)

    return created_carbon_footprint