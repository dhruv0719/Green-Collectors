// frontend/src/components/dashboard/Dashboard.tsx
"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { clearTokens } from "@/src/lib/api/auth";
import { getCurrentUser } from "@/src/lib/api";
import { getGreenActionStats } from "@/src/lib/api/green_actions";
import { getCarbonFootprintStats } from "@/src/lib/api/carbon_footprint";
import type { User } from "@/src/types/user";
import type { GreenActionStats } from "@/src/types/green_action";
import type { CarbonFootprintStats } from "@/src/types/carbon_footprint";

import StatCard from "@/src/components/ui/StatCard";

type DashboardData = {
  user: User | null;
  greenStats: GreenActionStats | null;
  carbonStats: CarbonFootprintStats | null;
};

const EMPTY_DASHBOARD: DashboardData = {
  user: null,
  greenStats: null,
  carbonStats: null,
};


export default function Dashboard() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData>(EMPTY_DASHBOARD);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = useCallback(async () => {
    try {
      setError("");
      const [user, greenStats, carbonStats] = await Promise.all([
        getCurrentUser(),
        getGreenActionStats(),
        getCarbonFootprintStats(),
      ]);
      setData({ user, greenStats, carbonStats });
    } catch {
      clearTokens();
      setError("Your session has expired. Please sign in again.");
      router.replace("/login");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      await loadDashboard();
      if (!isMounted) return;
    })();
    return () => {
      isMounted = false;
    };
  }, [loadDashboard]);

  if (loading) {
    return (
      <div className="mx-auto flex max-w-6xl flex-col gap-4 rounded-[28px] border border-white/10 bg-[#07140d] p-8 shadow-[0_25px_70px_rgba(0,0,0,0.35)]">
        <p className="text-lg font-semibold text-white">Loading your dashboard…</p>
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

  const totalSaved = data.greenStats?.total_co2_saved ?? 0;
  const totalTrees = data.greenStats?.total_trees ?? 0;
  const weeklySaved = data.greenStats?.weekly_trend?.at(-1)?.total ?? 0;
  const weeklyEmitted = data.carbonStats?.weekly_trend?.at(-1)?.total ?? 0;
  const weeklyTotal = weeklySaved + weeklyEmitted;
  const weeklyScore = weeklyTotal > 0 ? Math.round((weeklySaved / weeklyTotal) * 100) : 0;

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 pb-24 md:pb-0">
      <section className="rounded-[32px] border border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(111,207,69,0.18),_transparent_55%)] p-6 shadow-[0_25px_70px_rgba(0,0,0,0.35)]">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#6fcf45]">Good day</p>
            <h1 className="mt-4 text-4xl font-semibold text-white">Hi, {data.user?.first_name ?? "there"}.</h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-white/75">
              Your dashboard is your overview for weekly progress, CO₂ impact, and today’s green actions.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Link
              href="/green-actions"
              className="inline-flex items-center justify-center rounded-3xl bg-[#6fcf45] px-6 py-4 text-sm font-semibold text-[#07140d] shadow-[0_20px_50px_rgba(111,207,69,0.22)] transition hover:opacity-95"
            >
              Log Today’s Green Action
            </Link>
            <Link
              href="/carbon-footprint"
              className="inline-flex items-center justify-center rounded-3xl border border-white/10 bg-white/5 px-6 py-4 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              CO₂ Footprint
            </Link>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
        <div className="rounded-[32px] border border-white/10 bg-[#07140d] p-6 shadow-[0_22px_70px_rgba(0,0,0,0.35)]">
          <div className="flex flex-col items-center gap-6 text-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#6fcf45]">
                Weekly Green Score
              </p>
              <p className="mt-2 text-sm text-white/60">
                Your current CO₂ offset balance for the week.
              </p>
            </div>
            <div className="relative">
              <svg viewBox="0 0 36 36" className="h-36 w-36">
                <path
                  className="stroke-white/10"
                  strokeWidth="3.5"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831"
                />
                <path
                  className="stroke-[#6fcf45]"
                  strokeWidth="3.5"
                  fill="none"
                  strokeDasharray={`${weeklyScore} ${100 - weeklyScore}`}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-semibold text-[#6fcf45]">{weeklyScore}%</span>
                <span className="text-xs uppercase text-white/50">green score</span>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-white/70">
                You offset <span className="text-white">{weeklySaved.toFixed(1)} kg</span> CO₂ this week.
              </p>
              <p className="text-sm text-white/50">
                {weeklyTotal > 0
                  ? `Keep going to improve your green score and close the gap.`
                  : "Log a green action or footprint entry to start your weekly score."}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <StatCard
            label="Trees Planted"
            value={String(totalTrees)}
            accent="#9de86a"
          />
          <StatCard
            label="Clean-Ups"
            value="Soon"
            accent="#4ab8e8"
            sub="Future feature"
          />
          <StatCard
            label="Total CO₂ Saved"
            value={totalSaved.toFixed(1)}
            unit="kg"
            accent="#6fcf45"
          />
          <StatCard
            label="Global Rank"
            value="Soon"
            accent="#f0a830"
            sub="Future feature"
          />
        </div>
      </div>
    </div>
  );
}
