// frontend/src/lib/api/auth.ts
// Token storage for the Green Collectors frontend. Tokens live in localStorage
// (client-side session). See backend note.md — server-side storage with
// revocation is a later improvement.

const ACCESS_TOKEN_STORAGE_KEY = "access_token";
const REFRESH_TOKEN_STORAGE_KEY = "refresh_token";

function read(key: string): string | null {
  if (typeof window === "undefined") {
    return null;
  }
  return window.localStorage.getItem(key);
}

function write(key: string, value: string) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(key, value);
  }
}

function remove(key: string) {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(key);
  }
}

export function getAccessToken(): string | null {
  return read(ACCESS_TOKEN_STORAGE_KEY);
}

export function getRefreshToken(): string | null {
  return read(REFRESH_TOKEN_STORAGE_KEY);
}

export function setTokens(access: string, refresh: string) {
  write(ACCESS_TOKEN_STORAGE_KEY, access);
  write(REFRESH_TOKEN_STORAGE_KEY, refresh);
}

export function clearTokens() {
  remove(ACCESS_TOKEN_STORAGE_KEY);
  remove(REFRESH_TOKEN_STORAGE_KEY);
}

// Backwards-compatible names used by older components.
export const getStoredToken = getAccessToken;
export const setStoredToken = (token: string) => write(ACCESS_TOKEN_STORAGE_KEY, token);
