## User
~~~
id
name
email
password_hash
created_at
~~~


## Green Action
~~~
id 
user_id
category
quantity
location
date
points
carbon save / carbon offset
~~~

## Carbon footprint
~~~
id
user_id
transport
food
shopping
energy
flight
total
Net Carbon Impact
~~~

---

# Database Relationships
~~~
User 
|
|-------------------|
|                   |
▼                   ▼
Green Action        Carbon Footprint
    ^                    ^
    |                    |
    |--------------------|

~~~

---

## Added later after the Business logic

### Emission factors
~~~
id
category
subcategory
unit
factor_kgco2e
source
region
year
~~~

### Activity Logs 

~~~
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

### Action points
~~~
  action_type                  
  tree_planted                 
  cleanup_participated         
  low_carbon_transport_logged  
  eco_purchase                 
~~~
