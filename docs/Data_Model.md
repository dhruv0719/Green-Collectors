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