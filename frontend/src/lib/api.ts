// frontend/src/lib/api.ts
const API_BASE_URL = "http://127.0.0.1:8000/api/v1";

export async function login(email: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email,
            password,
        }),
    });

    if (!response.ok) {
        throw new Error("Invalid email or password");
    }

    return response.json();
}