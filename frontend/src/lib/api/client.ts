// frontend/src/lib/api/client.ts
// Shared fetch wrapper for the Green Collectors API.
//
// Responsibilities:
//  - resolve the API base URL once
//  - attach the Bearer access token to every request
//  - parse JSON (or text) responses consistently
//  - surface a single ApiError type with the backend `detail` message
//  - transparently refresh a short-lived access token once on 401, then retry

import {
  getAccessToken,
  getRefreshToken,
  setTokens,
  clearTokens,
} from "./auth";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000/api/v1";

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

async function parseBody(response: Response): Promise<unknown> {
  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return response.json();
  }
  return response.text();
}

function extractMessage(data: unknown, fallback: string): string {
  if (data && typeof data === "object" && "detail" in data) {
    const detail = (data as { detail: unknown }).detail;
    if (typeof detail === "string") {
      return detail;
    }
  }
  return fallback;
}

async function doFetch(
  path: string,
  options: RequestInit,
  accessToken: string | null
): Promise<Response> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> | undefined),
  };
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }
  return fetch(`${API_BASE_URL}${path}`, { ...options, headers });
}

// A single in-flight refresh promise so concurrent 401s share one refresh.
let refreshing: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  if (refreshing) {
    return refreshing;
  }

  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    return null;
  }

  refreshing = (async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      setTokens(data.access_token, data.refresh_token);
      return data.access_token as string;
    } catch {
      return null;
    } finally {
      refreshing = null;
    }
  })();

  return refreshing;
}

export interface RequestOptions extends RequestInit {
  /** Skip the access token + refresh behavior (e.g. for /auth/login). */
  auth?: boolean;
}

/**
 * Perform an authenticated API request. On a 401 it tries to refresh the
 * access token once and retries; if that fails the user is signed out.
 */
export async function apiRequest<T = unknown>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const { auth = true, ...init } = options;
  const accessToken = auth ? getAccessToken() : null;

  const response = await doFetch(path, init, accessToken);
  const data = await parseBody(response);

  if (response.ok) {
    return data as T;
  }

  // One transparent refresh + retry on expired access tokens.
  if (response.status === 401 && auth && refreshTokenWorthTrying()) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      const retry = await doFetch(path, init, newToken);
      const retryData = await parseBody(retry);
      if (retry.ok) {
        return retryData as T;
      }
      throw new ApiError(retry.status, extractMessage(retryData, "Request failed"));
    }
    // Refresh failed — session is over.
    clearTokens();
    if (typeof window !== "undefined") {
      window.location.assign("/login");
    }
  }

  throw new ApiError(response.status, extractMessage(data, "Something went wrong."));
}

function refreshTokenWorthTrying(): boolean {
  return getRefreshToken() !== null;
}
