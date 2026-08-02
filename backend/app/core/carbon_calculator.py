# backend/app/core/carbon_calculator.py
from app.core.emission_factors import EMISSION_FACTORS, CARBON_FOOTPRINT_EMISSION_FACTORS
from app.features.green_actions.constants import Category, Unit
from app.features.carbon_footprint.constants import (
    Category as CarbonCategory,
    Unit as CarbonUnit,
)
from app.core.exceptions import CalculationError


def _lookup(
    table: dict,
    category: str,
    activity: str,
    quantity: float,
    unit: str,
) -> float:
    """Shared factor lookup + multiplication for a CO2 calculation.

    Validates that the activity belongs to the category and that the unit
    matches the activity's expected unit. Anything invalid becomes a
    CalculationError (mapped to HTTP 422 at the router), never a KeyError 500.
    """
    if quantity <= 0:
        raise CalculationError("Quantity must be greater than zero")

    category_data = table.get(category)
    if category_data is None:
        raise CalculationError(f"Unknown category: {category!r}")

    activity_data = category_data.get(activity)
    if activity_data is None:
        raise CalculationError(
            f"Activity {activity!r} is not part of category {category!r}"
        )

    if activity_data["unit"] != unit:
        raise CalculationError(
            f"Unit {unit!r} is not valid for {category}/{activity} "
            f"(expected {activity_data['unit']!r})"
        )

    return round(quantity * activity_data["factor"], 2)


def calculate_co2_saved(category: Category, activity: str, quantity: float, unit: Unit) -> float:
    return _lookup(EMISSION_FACTORS, category, activity, quantity, unit)


def calculate_co2_emitted(category: CarbonCategory, activity: str, quantity: float, unit: CarbonUnit) -> float:
    return _lookup(CARBON_FOOTPRINT_EMISSION_FACTORS, category, activity, quantity, unit)
