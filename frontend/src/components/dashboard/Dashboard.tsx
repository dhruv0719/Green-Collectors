// frontend/src/components/dashboard/Dashboard.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { clearStoredToken } from "@/src/lib/api/auth";
import { getCurrentUser } from "@/src/lib/api";
import GreenActionLogScreen from "@/src/components/green_actions/GreenActionLogScreen";

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
      <div className="mx-auto flex max-w-6xl flex-col gap-4 rounded-[28px] border border-white/10 bg-[#07140d] p-8 shadow-[0_25px_70px_rgba(0,0,0,0.35)]">
        <p className="text-lg font-semibold text-white">Loading your dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto flex max-w-6xl flex-col gap-4 rounded-[28px] border border-white/10 bg-[#07140d] p-8 shadow-[0_25px_70px_rgba(0,0,0,0.35)]">
        <p className="text-lg font-semibold text-red-300">{error}</p>
        <button
          onClick={() => router.replace("/login")}
          className="rounded-xl bg-gradient-to-r from-[#6fcf45] to-[#2d6e45] px-4 py-2 font-semibold text-[#07140d]"
        >
          Go to login
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <div className="rounded-[32px] border border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(111,207,69,0.2),_transparent_55%)] p-6 shadow-[0_25px_70px_rgba(0,0,0,0.3)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#6fcf45]">
              Dashboard
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-white">
              Welcome back, {user?.first_name ?? "there"}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/65">
              Your account is ready and connected to the Green Collectors platform.
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/80 transition hover:bg-white/10"
          >
            Logout
          </button>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm font-medium text-white/45">Full name</p>
            <p className="mt-2 text-lg font-semibold text-white">
              {user?.first_name} {user?.last_name}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm font-medium text-white/45">Email</p>
            <p className="mt-2 text-lg font-semibold text-white">{user?.email}</p>
          </div>
        </div>
      </div>

      <GreenActionLogScreen />
    </div>
  );
}
