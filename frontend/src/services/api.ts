// frontend/app/services/api.ts

import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000", // Replace with your API base URL
  headers: {
    "Content-Type": "application/json",
  },
});

export async function getHealth() {
  return api.get("/health");
}

