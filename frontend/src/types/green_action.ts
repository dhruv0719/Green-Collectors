// frontend/src/types/green_action.ts
export interface GreenActionCreate {
    category: string;
    activity: string;
    quantity: number;
    unit: string;
    location: string;
}

export interface GreenActionResponse {
    category: string;
    activity: string;
    quantity: number;
    unit: string;
    location: string;
    co2_saved: number;
}