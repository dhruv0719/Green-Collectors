# backend/app/features/carbon_footprint/constants.py

from enum import Enum

class Category(str, Enum):
    TRANSPORT = "transport"
    HOME_ENERGY = "home_energy"
    FOOD = "food"
    FLIGHT = "flight"
    SHOPPING = "shopping"
    WASTE = "waste"


class TransportActivity(str, Enum):
    PETROL_CAR = "petrol_car"
    DIESEL_CAR = "diesel_car"
    ELECTRIC_CAR = "electric_car"
    BUS = "bus"
    TRAIN = "train"
    METRO = "metro"
    MOTORBIKE = "motorbike"


class HomeEnergyActivity(str, Enum):
    ELECTRICITY = "electricity"
    LPG = "lpg"
    NATURAL_GAS = "natural_gas"


class FoodActivity(str, Enum):
    BEEF = "beef"
    LAMB = "lamb"
    PORK = "pork"
    CHICKEN = "chicken"
    FISH = "fish"
    VEGETARIAN = "vegetarian"
    VEGAN = "vegan"
    DAIRY = "dairy"


class FlightActivity(str, Enum):
    DOMESTIC = "domestic"
    SHORT_HAUL = "short_haul"
    LONG_HAUL = "long_haul"


class ShoppingActivity(str, Enum):
    CLOTHING = "clothing"
    ELECTRONICS = "electronics"
    FURNITURE = "furniture"


class WasteActivity(str, Enum):
    GENERAL_WASTE = "general_waste"


class Unit(str, Enum):
    KILOMETER = "km"
    KWH = "kwh"
    KILOGRAM = "kg"
    LITER = "liter"
    COUNT = "count"
    TONNE = "tonne"