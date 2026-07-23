### How is carbon calculated?
--> Core formula
~~~
Emissions (kgCO2e) = Activity Data × Emission Factor
~~~
- Activity data = what the user did (km driven, kWh used, kg of beef eaten, ₹ spent)
- Emission factor = a published constant, "kg CO2e per unit of activity"

### Mapped to your 5 categories from the mockup:
| Category       | Activity Input                              | Factor Source                                                                                                                           | Example                                                                                                   |
|----------------|----------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------|
| Transport      | Distance (km) × transport mode (car, bus, train, flight) | DEFRA / EPA emission factors (per-km factors by vehicle type)                                                                            | Petrol car ≈ **0.17 kgCO₂e/km**                                                                          |
| Home Energy    | Electricity (kWh), LPG/gas units             | National grid emission factors (country-specific). For India, use **Central Electricity Authority (CEA)** grid emission factors.         | India electricity grid ≈ **0.7–0.8 kgCO₂e/kWh**                                                          |
| Food & Diet    | Diet type or quantity (kg) of specific foods | Life Cycle Assessment (LCA) databases / DEFRA food emission factors                                                                       | Beef ≈ **27 kgCO₂e/kg** vs Vegetables ≈ **2 kgCO₂e/kg**                                                  |
| Shopping       | Amount spent (₹) by spending category        | DEFRA spend-based emission multipliers (used when detailed product data is unavailable)                                                  | Fallback method when only spending data is available                                                     |
| Flights        | Flight distance (km) × travel class          | DEFRA aviation emission factors (economy, premium economy, business, first class)                                                        | Long-haul economy ≈ **0.117 kgCO₂e per passenger-km**                                                    |

----

### How are points calculated?

--> Points as a flat, tiered reward table (simpler, common in real apps)
~~~
action_points table:
  action_type                  | base_points
  tree_planted                 | 20
  cleanup_participated         | 15
  low_carbon_transport_logged  | 5
  eco_purchase                 | 10 + bonus if "plants a tree"
~~~
~~~
total_score = Σ base_points(action) + Σ (kgCO2_offset × bonus_multiplier)
~~~

""" Store both co2_offset_kg and points_earned per logged action — never derive one from the other implicitly, always compute and store both explicitly at log time. That way, if you change your formula later, historical logs don't silently change value. """

---

### How is history generated?
-->
~~~
activity_log table:
  id
  user_id 
  action_type 
  category 
  quantity 
  unit
  co2_offset_kg
  points_earned 
  location
  timestamp
~~~
