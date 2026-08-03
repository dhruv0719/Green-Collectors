// frontend/src/types/carbon_footprint.ts

export interface CarbonFootprintCreate {
  category: string;
  activity: string;
  quantity: number;
  unit: string;
}

export interface CarbonFootprintResponse {
  id: string;
  category: string;
  activity: string;
  quantity: number;
  unit: string;
  co2_emitted: number;
  created_at: string;
  updated_at: string;
}

export interface CarbonFootprintCategoryBreakdown {
  category: string;
  co2_emitted: number;
}

export interface CarbonFootprintStats {
  total_co2_emitted: number;
  total_entries: number;
  by_category: CarbonFootprintCategoryBreakdown[];
  weekly_trend: import("./green_action").TrendPoint[];
}
