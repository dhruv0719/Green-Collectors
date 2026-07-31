# backend/app/core/carbon_calculator.py
from app.core.emission_factors import EMISSION_FACTORS
from app.features.green_actions.constants import Category, Unit

def calculate_co2_saved(category: Category, activity: str, quantity: float, unit: Unit) -> float:
    category_data = EMISSION_FACTORS[category]
    activity_data = category_data[activity]
    expected_unit = activity_data["unit"]

    if expected_unit != unit:
        raise ValueError("Invalid unit for this activity")

    return quantity * activity_data["factor"]