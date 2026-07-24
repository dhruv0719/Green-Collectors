In later version i need make the sperated model for the models, in which this will happen 
~~~
app/
│
├── models/
│      ├── __init__.py
│      ├── auth.py
│      ├── carbon.py
│      └── leaderboard.py
~~~ 

So that env.py can do this 
~~~
import app.models
~~~

so that everytime we don't need to add models in the env.py right because we have the __init__.py so in that this is there 

model/__init__.py
~~~
from app.features.auth.model import User
from app.features.carbon.model import CarbonRecord
from app.features.leaderboard.model import Leaderboard
~~~

Making the env.py to an synchronous engine to asynchronous engine :)) "date: 24/07/26"