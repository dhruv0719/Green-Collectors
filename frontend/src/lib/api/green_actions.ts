// frontend/src/lib/api/green_actions.ts

import { getStoredToken } from "../api/auth";
import type { GreenActionCreate, GreenActionResponse } from "@/src/types/green_action";

const API_BASE_URL = "http://127.0.0.1:8000/api/v1";

async function parseApiResponse(response: Response) {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return response.json();
  }

  return response.text();
}

export async function logGreenAction(payload: GreenActionCreate): Promise<GreenActionResponse> {
  const token = getStoredToken();

  if (!token) {
    throw new Error("Please sign in first.");
  }

  const response = await fetch(`${API_BASE_URL}/green-actions/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await parseApiResponse(response);

  if (!response.ok) {
    throw new Error(data?.detail ?? "Unable to save your green action.");
  }

  return data;
}