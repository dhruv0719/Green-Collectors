## Password Hashing
Argon2 
```
from argon2 import PasswordHasher
ph = PasswordHasher()
hashed = ph.hash("user_password")   # store this
ph.verify(hashed, "user_password")  # raises exception if wrong
```

---

## JWT 
- Short-lived access token (15 min) + longer-lived refresh token (7 days), not one long-lived token. If an access token leaks, damage window is small.

- Store JWT secret in environment variables, never in code/git.

- Put minimal data in the payload (user_id) — JWTs are base64, not encrypted, anyone can decode and read them. Never put passwords/sensitive data in the payload.

- Verify signature + expiry on every protected request.

---

## Protected Routes
This is just middleware/dependency that runs before your route handler:
```
# FastAPI example
def get_current_user(token: str = Depends(oauth2_scheme)):
    payload = decode_jwt(token)  # raises 401 if invalid/expired
    return get_user(payload["user_id"])

@app.post("/log-action")
def log_action(data: ActionIn, user = Depends(get_current_user)):
    ...
```

~ Rule: every route that touches user-specific data must depend on this. Don't trust a user_id sent in the request body — always derive the user from the verified token, never from client input. (This is a real, common vulnerability — if you take user_id from the request body instead of the token, anyone can log actions or view data as any other user.)

---

## Input Validation
- Use Pydantic models (if FastAPI) to define exactly what shape/type every request must be — reject anything that doesn't match automatically, before your logic even runs.

- Validate at the boundary, not deep inside business logic: quantity must be positive number, category must be one of your enum values, email must match email format, etc.

- Don't trust any client input — including the "chips" in your Log Action screen (category selector). Client-side restriction is UX, not security; validate again server-side.

---

## SQL Injection Prevention
- Never string-concatenate SQL. If you're writing raw SQL, always use parameterized queries:
~~~
# BAD
cursor.execute(f"SELECT * FROM users WHERE email = '{email}'")
# GOOD
cursor.execute("SELECT * FROM users WHERE email = ?", (email,))
~~~
- Better: use an ORM (SQLAlchemy) so this is handled for you by default — you'd have to actively work around it to be vulnerable.

---

## Rate Limiting

~~~
After MVP :)
~~~
