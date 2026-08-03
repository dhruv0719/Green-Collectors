// frontend/src/lib/api/green_actions.ts

import { apiRequest } from "./client";
import type {
  GreenActionCreate,
  GreenActionResponse,
  GreenActionStats,
} from "@/src/types/green_action";

export async function logGreenAction(
  payload: GreenActionCreate
): Promise<GreenActionResponse> {
  return apiRequest<GreenActionResponse>("/green-actions/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function listGreenActions(
  params: { limit?: number; offset?: number } = {}
): Promise<GreenActionResponse[]> {
  const query = new URLSearchParams();
  if (params.limit) query.set("limit", String(params.limit));
  if (params.offset) query.set("offset", String(params.offset));
  const qs = query.toString();
  return apiRequest<GreenActionResponse[]>(`/green-actions/${qs ? `?${qs}` : ""}`);
}

export async function getGreenActionStats(): Promise<GreenActionStats> {
  return apiRequest<GreenActionStats>("/green-actions/stats");
}
