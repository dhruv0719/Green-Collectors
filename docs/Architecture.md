~~~
Clinet

↓

API

↓

Router

↓

Service

↓

Business logic / Core

↓

Repository

↓

Database
~~~

---

### Where should business logic live? 
---> Business logic live at core and that will be at the server 

### Where should validation happen?
---> At the Repository

### Where should database queries happen?
---> At Service

---

## API Design

### Authentication
~~~
POST /auth/signup

POST /auth/login

GET /auth/me
~~~

### Action
~~~
POST /actions --> Add data

GET /actions ---> Fetch data
~~~

### Carbon
~~~
GET /carbon ---> Add data

POST /carbon/calculate ---> Logical and Fetching
~~~

---

## Frontend Architecture
~~~
..src//

    app/

    components/

    hooks/

    services/

    types/

    utils/

    styles/

    core/
~~~

