// frontend/src/lib/api/carbon_footprint.ts

import { apiRequest } from "./client";
import type {
  CarbonFootprintCreate,
  CarbonFootprintResponse,
  CarbonFootprintStats,
} from "@/src/types/carbon_footprint";

export async function logCarbonFootprint(
  payload: CarbonFootprintCreate
): Promise<CarbonFootprintResponse> {
  return apiRequest<CarbonFootprintResponse>("/carbon-footprint/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function listCarbonFootprints(
  params: { limit?: number; offset?: number } = {}
): Promise<CarbonFootprintResponse[]> {
  const query = new URLSearchParams();
  if (params.limit) query.set("limit", String(params.limit));
  if (params.offset) query.set("offset", String(params.offset));
  const qs = query.toString();
  return apiRequest<CarbonFootprintResponse[]>(`/carbon-footprint/${qs ? `?${qs}` : ""}`);
}

export async function getCarbonFootprintStats(): Promise<CarbonFootprintStats> {
  return apiRequest<CarbonFootprintStats>("/carbon-footprint/stats");
}
