# backend/app/main.py

from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"status": "success", "message": "FastAPI is up and running!"}

@app.get("/health")
def health():
    return {
        "status": "healthy",
        "version": "0.1.0"
    }
