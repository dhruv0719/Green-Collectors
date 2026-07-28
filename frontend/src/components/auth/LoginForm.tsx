// frontend/src/components/auth/LoginForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { login } from "@/src/lib/api";
import { setStoredToken } from "@/src/lib/api/auth";

export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const data = await login(email, password);
      setStoredToken(data.access_token);
      router.push("/dashboard");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md overflow-hidden rounded-[28px] border border-white/10 bg-[#07140d] shadow-[0_25px_70px_rgba(0,0,0,0.35)]">
      <div className="bg-[radial-gradient(circle_at_top_left,_rgba(111,207,69,0.24),_transparent_55%)] p-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6fcf45] to-[#2d6e45] text-xl shadow-lg shadow-green-900/30">
            🌿
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#6fcf45]">
              Green Collectors
            </p>
            <h1 className="text-xl font-semibold text-white">Welcome back</h1>
          </div>
        </div>

        <p className="mb-6 text-sm leading-6 text-white/65">
          Sign in to continue your eco journey and track your positive impact.
        </p>

        {error && (
          <div className="mb-4 rounded-xl border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.2em] text-white/45">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-[#6fcf45] focus:ring-2 focus:ring-[#6fcf45]/20"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.2em] text-white/45">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-[#6fcf45] focus:ring-2 focus:ring-[#6fcf45]/20"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-gradient-to-r from-[#6fcf45] to-[#2d6e45] py-3 text-sm font-semibold text-[#07140d] shadow-lg shadow-green-900/30 transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Signing In..." : "Login"}
          </button>
        </form>

        <div className="mt-5 text-center text-sm text-white/45">
          New here?{' '}
          <a href="/signup" className="font-semibold text-[#6fcf45] hover:underline">
            Create an account
          </a>
        </div>
      </div>
    </div>
  );
}