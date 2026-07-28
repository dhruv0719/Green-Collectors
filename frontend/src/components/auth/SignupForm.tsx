// frontend/src/components/auth/SignupForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { signup } from "@/src/lib/api";
import { setStoredToken } from "@/src/lib/api/auth";

export default function SignUpForm() {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const data = await signup(
        firstName,
        lastName,
        email,
        password,
        city,
        country
      );

      console.log(data);

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
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md overflow-hidden rounded-[28px] border border-white/10 bg-[#07140d] shadow-[0_25px_70px_rgba(0,0,0,0.35)]"
    >
      <div className="bg-[radial-gradient(circle_at_top_left,_rgba(111,207,69,0.24),_transparent_55%)] p-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6fcf45] to-[#2d6e45] text-xl shadow-lg shadow-green-900/30">
            🌱
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#6fcf45]">
              Join Green Collectors
            </p>
            <h1 className="text-xl font-semibold text-white">Create your account</h1>
          </div>
        </div>

        <p className="mb-6 text-sm leading-6 text-white/65">
          Start collecting positive impact and unlock your eco profile today.
        </p>

        {error && (
          <div className="mb-4 rounded-xl border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
            {error}
          </div>
        )}

        <div className="grid gap-3 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.2em] text-white/45">
              First Name
            </label>
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-[#6fcf45] focus:ring-2 focus:ring-[#6fcf45]/20"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.2em] text-white/45">
              Last Name
            </label>
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-[#6fcf45] focus:ring-2 focus:ring-[#6fcf45]/20"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.2em] text-white/45">
              Email
            </label>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-[#6fcf45] focus:ring-2 focus:ring-[#6fcf45]/20"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.2em] text-white/45">
              Password
            </label>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-[#6fcf45] focus:ring-2 focus:ring-[#6fcf45]/20"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.2em] text-white/45">
              City
            </label>
            <input
              type="text"
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-[#6fcf45] focus:ring-2 focus:ring-[#6fcf45]/20"
            />
          </div>

          <div>
            <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.2em] text-white/45">
              Country
            </label>
            <input
              type="text"
              placeholder="Country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-[#6fcf45] focus:ring-2 focus:ring-[#6fcf45]/20"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-5 w-full rounded-2xl bg-gradient-to-r from-[#6fcf45] to-[#2d6e45] py-3 text-sm font-semibold text-[#07140d] shadow-lg shadow-green-900/30 transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? "Creating Account..." : "Create Account"}
        </button>

        <div className="mt-5 text-center text-sm text-white/45">
          Already have an account?{' '}
          <a href="/login" className="font-semibold text-[#6fcf45] hover:underline">
            Sign in
          </a>
        </div>
      </div>
    </form>
  );
}