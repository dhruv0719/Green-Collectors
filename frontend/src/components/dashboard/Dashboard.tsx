// frontend/src/components/dashboard/Dashboard.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { clearStoredToken } from "@/src/lib/api/auth";
import { getCurrentUser } from "@/src/lib/api";

type UserProfile = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  city?: string | null;
  country?: string | null;
};

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadUser() {
      try {
        const data = await getCurrentUser();

        if (isMounted) {
          setUser(data);
        }
      } catch {
        if (!isMounted) {
          return;
        }

        clearStoredToken();
        setError("Your session has expired. Please sign in again.");
        router.replace("/login");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadUser();

    return () => {
      isMounted = false;
    };
  }, [router]);

  function handleLogout() {
    clearStoredToken();
    router.replace("/login");
  }

  if (loading) {
    return (
      <div className="mx-auto flex max-w-4xl flex-col gap-4 rounded-2xl bg-white p-8 shadow-lg">
        <p className="text-lg font-semibold text-gray-700">Loading your dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto flex max-w-4xl flex-col gap-4 rounded-2xl bg-white p-8 shadow-lg">
        <p className="text-lg font-semibold text-red-600">{error}</p>
        <button
          onClick={() => router.replace("/login")}
          className="rounded-lg bg-green-600 px-4 py-2 font-semibold text-white"
        >
          Go to login
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6 rounded-2xl bg-white p-8 shadow-xl">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-green-600">
            Dashboard
          </p>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.first_name ?? "there"}
          </h1>
          <p className="mt-2 text-gray-600">
            Your account is ready and connected to the Green Collectors platform.
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-gray-100"
        >
          Logout
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
          <p className="text-sm font-medium text-gray-500">Full name</p>
          <p className="mt-2 text-lg font-semibold text-gray-900">
            {user?.first_name} {user?.last_name}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
          <p className="text-sm font-medium text-gray-500">Email</p>
          <p className="mt-2 text-lg font-semibold text-gray-900">{user?.email}</p>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-green-50 p-5">
        <p className="text-sm font-medium text-green-700">Account details</p>
        <p className="mt-2 text-gray-700">
          City: {user?.city || "Not provided"}
        </p>
        <p className="mt-1 text-gray-700">
          Country: {user?.country || "Not provided"}
        </p>
      </div>
    </div>
  );
}
