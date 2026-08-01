import { getStoredToken } from "../api/auth";

const API_BASE_URL = "http://127.0.0.1:8000/api/v1";

async function parseApiResponse(response: Response) {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return response.json();
  }

  return response.text();
}

export async function logCarbonFootprint(payload: {
  category: string;
  activity: string;
  quantity: number;
  unit: string;
}) {
  const token = getStoredToken();

  if (!token) {
    throw new Error("Please sign in first.");
  }

  const response = await fetch(`${API_BASE_URL}/carbon-footprint/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await parseApiResponse(response);

  if (!response.ok) {
    throw new Error(data?.detail ?? "Unable to save your carbon footprint.");
  }

  return data;
}
