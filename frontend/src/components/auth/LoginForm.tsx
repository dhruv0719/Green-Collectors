// frontend/src/components/auth/LoginForm.tsx
"use client";

import { useState } from "react";

import { login } from "@/src/lib/api"

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
        const data = await login(email, password);
        
        console.log(data);
        
    } catch (error) {
        console.error(error);
    }

    // Later:
    // await fetch("http://localhost:8000/api/v1/auth/login", ...)
  }

  return (
    <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
      <h1 className="text-3xl font-bold text-center mb-2">
        Welcome Back
      </h1>

      <p className="text-center text-gray-500 mb-8">
        Login to your account
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">

        <div>
          <label className="block mb-2 font-medium">
            Email
          </label>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-green-600"
            required
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Password
          </label>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-green-600"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-green-600 py-3 font-semibold text-white hover:bg-green-700"
        >
          Login
        </button>

      </form>
    </div>
  );
}