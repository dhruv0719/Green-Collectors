// frontend/src/lib/api.ts
// Auth API surface (login / signup / refresh / me), backed by the shared client.

import { apiRequest } from "./api/client";
import { setTokens } from "./api/auth";
import type { AuthResponse } from "../types/auth";
import type { User } from "../types/user";

/** Normalize empty strings to null so the backend stores real NULLs. */
function toNullable(value: string): string | null {
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const data = await apiRequest<AuthResponse>("/auth/login", {
    method: "POST",
    auth: false,
    body: JSON.stringify({ email, password }),
  });
  setTokens(data.access_token, data.refresh_token);
  return data;
}

export async function signup(params: {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  city?: string;
  country?: string;
}): Promise<AuthResponse> {
  const data = await apiRequest<AuthResponse>("/auth/signup", {
    method: "POST",
    auth: false,
    body: JSON.stringify({
      first_name: params.first_name,
      last_name: params.last_name,
      email: params.email,
      password: params.password,
      city: toNullable(params.city ?? ""),
      country: toNullable(params.country ?? ""),
    }),
  });
  setTokens(data.access_token, data.refresh_token);
  return data;
}

export async function refresh(refreshToken: string): Promise<AuthResponse> {
  const data = await apiRequest<AuthResponse>("/auth/refresh", {
    method: "POST",
    auth: false,
    body: JSON.stringify({ refresh_token: refreshToken }),
  });
  setTokens(data.access_token, data.refresh_token);
  return data;
}

export async function getCurrentUser(): Promise<User> {
  return apiRequest<User>("/auth/me");
}
