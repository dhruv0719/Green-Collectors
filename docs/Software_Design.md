# Software Design

## User Journey
```
Open App
    │
    ▼
Signup/Login
    │
    ▼
Dashboard
    │
    ├── View Carbon Summary
    │
    ├── Log Green Action
    │
    └── View Carbon History
    │
    ▼
Logout
```
---


## Screen FLow
~~~
Landing Page / Project Info

Authentication
├── Login
└── Signup

Dashboard
├── Dashboard
├── Log Green Action
├── Carbon History
└── Profile
~~~

---

## Features

### Authentication
~~~
Purpose: Allow users to securly create an account and login.

Inputs: Email, Password

Outputs: JWT, Logged-in User

Dependencies: Database, Hashing
~~~

### Dashboard

~~~
Purpose: User can see there progress and score

Inputs: Shoutcut buttons or easliy navigation buttons clickable

Output: Show the score of Total tree plant, CLean-up, CO2 Saved, Global rank of them, Weekly Green Score. and Shortcut for Log today's green action

Dependencies: Need the access of Tree plant table, clean up, CO2 saved table. and then compairing them to show the rank and progress graph. 
~~~

## Green Action Logging

~~~
Purpose: Check the action taken by the user. and add the green action taken by the user to add them...

Inputs: Category, Quantity, Location

Output: Add logs into recent actions and Suggestion for the task.

Dependencies: Proper define Category and Points user will get for the activity. 
~~~

## CO₂ Tracking / CO₂ Footprint

~~~
Purpose: See the breakdown of Carbon Foodprint made by the user and show them there Emission per annual 

Input: Take Activity from user which they did and after that takeout record that how much footprint they were cretated

Output: Show then howmuch carbon footprint they made in and breakdown them into category or activities which they did

Dependencies: Making the formules and algoroithms bas on the how much footprint user made base on the activity they did
~~~


