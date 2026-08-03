// frontend/src/types/green_action.ts

export interface GreenActionCreate {
  category: string;
  activity: string;
  quantity: number;
  unit: string;
  location: string;
}

export interface GreenActionResponse {
  id: string;
  category: string;
  activity: string;
  quantity: number;
  unit: string;
  location: string;
  co2_saved: number;
  created_at: string;
  updated_at: string;
}

export interface GreenActionCategoryBreakdown {
  category: string;
  co2_saved: number;
}

export interface TrendPoint {
  week_start: string;
  total: number;
}

export interface GreenActionStats {
  total_co2_saved: number;
  total_trees: number;
  total_actions: number;
  by_category: GreenActionCategoryBreakdown[];
  weekly_trend: TrendPoint[];
}
