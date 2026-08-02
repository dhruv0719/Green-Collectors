# backend/app/core/exceptions.py
"""Domain-level exceptions for the Green Collectors API.

Raised by core/service code and translated into HTTP errors at the router
boundary so invalid client input never surfaces as a generic 500.
"""


class CalculationError(ValueError):
    """Invalid inputs to a CO2 calculation (bad unit / activity / category)."""
