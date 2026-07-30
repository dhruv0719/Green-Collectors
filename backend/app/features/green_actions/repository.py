# backend/app/features/green_actions/repository.py
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from app.features.green_actions.model import GreenAction
from app.features.green_actions.schema import GreenActionCreate

async def create_green_action(db: AsyncSession, data: GreenActionCreate, user_id: UUID, co2_saved: float) -> GreenAction:
    green_action = GreenAction(
        user_id = user_id,
        category = data.category,
        activity = data.activity,
        quantity = data.quantity,
        unit = data.unit,
        location = data.location,
        co2_saved = co2_saved
    ) 

    try: 
        db.add(green_action)
        await db.commit()
        await db.refresh(green_action)

    except Exception:
        await db.rollback()
        raise

    return green_action