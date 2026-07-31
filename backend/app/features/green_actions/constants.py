# backend/app/features/green_actions/constants.py

from enum import Enum


class Category(str, Enum):
    TRANSPORT = "transport"
    RECYCLING = "recycling"
    ENERGY = "energy"
    NATURE = "nature"


class TransportActivity(str, Enum):
    CYCLING = "cycling"
    WALKING = "walking"
    BUS = "bus"
    TRAIN = "train"
    METRO = "metro"


class RecyclingActivity(str, Enum):
    PLASTIC = "plastic"
    PAPER = "paper"
    GLASS = "glass"


class EnergyActivity(str, Enum):
    LED_BULB = "led_bulb"
    SOLAR_PANEL = "solar_panel"


class NatureActivity(str, Enum):
    TREE_PLANTING = "tree_planting"


class Unit(str, Enum):
    KILOMETER = "km"
    KILOGRAM = "kg"
    KWH = "kwh"
    COUNT = "count"


CATEGORY_ACTIVITIES = {
    Category.TRANSPORT: TransportActivity,
    Category.RECYCLING: RecyclingActivity,
    Category.ENERGY: EnergyActivity,
    Category.NATURE: NatureActivity,
}