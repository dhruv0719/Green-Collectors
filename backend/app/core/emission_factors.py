# backend/app/core/emission_factors.py

from app.features.green_actions.constants import (
    Category,
    TransportActivity,
    RecyclingActivity,
    EnergyActivity,
    NatureActivity,
    Unit,
)

from app.features.carbon_footprint.constants import (
    Category as CarbonCategory,
    TransportActivity as CarbonTransportActivity,
    HomeEnergyActivity,
    FoodActivity,
    FlightActivity,
    ShoppingActivity,
    WasteActivity,
    Unit as CarbonUnit,
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

CARBON_FOOTPRINT_EMISSION_FACTORS  = {
    CarbonCategory.TRANSPORT: {
        CarbonTransportActivity.PETROL_CAR: {
            "factor": 0.192,
            "unit": CarbonUnit.KILOMETER,
        },
        CarbonTransportActivity.DIESEL_CAR: {
            "factor": 0.171,
            "unit": CarbonUnit.KILOMETER,
        },
        CarbonTransportActivity.ELECTRIC_CAR: {
            "factor": 0.073,
            "unit": CarbonUnit.KILOMETER,
        },
        CarbonTransportActivity.BUS: {
            "factor": 0.105,
            "unit": CarbonUnit.KILOMETER,
        },
        CarbonTransportActivity.TRAIN: {
            "factor": 0.041,
            "unit": CarbonUnit.KILOMETER,
        },
        CarbonTransportActivity.METRO: {
            "factor": 0.045,
            "unit": CarbonUnit.KILOMETER,
        },
        CarbonTransportActivity.MOTORBIKE: {
            "factor": 0.103,
            "unit": CarbonUnit.KILOMETER,
        },
    },

    CarbonCategory.HOME_ENERGY: {
        HomeEnergyActivity.ELECTRICITY: {
            "factor": 0.233,
            "unit": CarbonUnit.KWH,
        },
        HomeEnergyActivity.LPG: {
            "factor": 1.51,
            "unit": CarbonUnit.LITER,
        },
        HomeEnergyActivity.NATURAL_GAS: {
            "factor": 2.03,
            "unit": CarbonUnit.LITER,
        },
    },

    CarbonCategory.FOOD: {
        FoodActivity.BEEF: {
            "factor": 27.00,
            "unit": CarbonUnit.KILOGRAM,
        },
        FoodActivity.LAMB: {
            "factor": 39.20,
            "unit": CarbonUnit.KILOGRAM,
        },
        FoodActivity.PORK: {
            "factor": 12.10,
            "unit": CarbonUnit.KILOGRAM,
        },
        FoodActivity.CHICKEN: {
            "factor": 6.90,
            "unit": CarbonUnit.KILOGRAM,
        },
        FoodActivity.FISH: {
            "factor": 5.10,
            "unit": CarbonUnit.KILOGRAM,
        },
        FoodActivity.VEGETARIAN: {
            "factor": 2.00,
            "unit": CarbonUnit.KILOGRAM,
        },
        FoodActivity.VEGAN: {
            "factor": 1.50,
            "unit": CarbonUnit.KILOGRAM,
        },
        FoodActivity.DAIRY: {
            "factor": 3.20,
            "unit": CarbonUnit.KILOGRAM,
        },
    },

    CarbonCategory.FLIGHT: {
        FlightActivity.DOMESTIC: {
            "factor": 0.254,
            "unit": CarbonUnit.KILOMETER,
        },
        FlightActivity.SHORT_HAUL: {
            "factor": 0.195,
            "unit": CarbonUnit.KILOMETER,
        },
        FlightActivity.LONG_HAUL: {
            "factor": 0.150,
            "unit": CarbonUnit.KILOMETER,
        },
    },

    CarbonCategory.SHOPPING: {
        ShoppingActivity.CLOTHING: {
            "factor": 15.00,
            "unit": CarbonUnit.COUNT,
        },
        ShoppingActivity.ELECTRONICS: {
            "factor": 50.00,
            "unit": CarbonUnit.COUNT,
        },
        ShoppingActivity.FURNITURE: {
            "factor": 30.00,
            "unit": CarbonUnit.COUNT,
        },
    },

    CarbonCategory.WASTE: {
        WasteActivity.GENERAL_WASTE: {
            "factor": 0.50,
            "unit": CarbonUnit.KILOGRAM,
        },
    },
}
