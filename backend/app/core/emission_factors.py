# backend/app/core/emission_factors.py

from app.features.green_actions.constants import (
    Category,
    TransportActivity,
    RecyclingActivity,
    EnergyActivity,
    NatureActivity,
    Unit,
)

EMISSION_FACTORS = {
    Category.TRANSPORT: {
        TransportActivity.CYCLING: {
            "factor": 0.17,
            "unit": Unit.KILOMETER,
        },
        TransportActivity.WALKING: {
            "factor": 0.17,
            "unit": Unit.KILOMETER,
        },
        TransportActivity.BUS: {
            "factor": 0.08,
            "unit": Unit.KILOMETER,
        },
        TransportActivity.TRAIN: {
            "factor": 0.03,
            "unit": Unit.KILOMETER,
        },
        TransportActivity.METRO: {
            "factor": 0.04,
            "unit": Unit.KILOMETER,
        },
    },

    Category.RECYCLING: {
        RecyclingActivity.PLASTIC: {
            "factor": 1.50,
            "unit": Unit.KILOGRAM,
        },
        RecyclingActivity.PAPER: {
            "factor": 0.90,
            "unit": Unit.KILOGRAM,
        },
        RecyclingActivity.GLASS: {
            "factor": 0.30,
            "unit": Unit.KILOGRAM,
        },
    },

    Category.ENERGY: {
        EnergyActivity.LED_BULB: {
            "factor": 0.75,
            "unit": Unit.KWH,
        },
        EnergyActivity.SOLAR_PANEL: {
            "factor": 0.75,
            "unit": Unit.KWH,
        },
    },

    Category.NATURE: {
        NatureActivity.TREE_PLANTING: {
            "factor": 21.77,
            "unit": Unit.COUNT,
        },
    },
}