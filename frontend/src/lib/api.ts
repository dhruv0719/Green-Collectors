// frontend/src/lib/api.ts
import { clearStoredToken, getStoredToken } from "./api/auth";
import type  { AuthResponse } from "../types/auth";
import type  { User } from "../types/user";

const API_BASE_URL = "http://127.0.0.1:8000/api/v1";

async function parseApiResponse(response: Response) {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return response.json();
  }

  return response.text();
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const data = await parseApiResponse(response);

  if (!response.ok) {
    throw new Error(data?.detail ?? "Invalid email or password");
  }

  return data;
}

export async function signup(
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  city: string,
  country: string
): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      first_name: firstName,
      last_name: lastName,
      email,
      password,
      city,
      country,
    }),
  });

  const data = await parseApiResponse(response);

  if (!response.ok) {
    throw new Error(data?.detail ?? "Signup failed");
  }

  return data;
}

export async function getCurrentUser(): Promise<User> {
  const token = getStoredToken();

  if (!token) {
    throw new Error("Unauthorized");
  }

  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await parseApiResponse(response);

  if (!response.ok) {
    clearStoredToken();
    throw new Error(data?.detail ?? "Unauthorized");
  }

  return data;
}