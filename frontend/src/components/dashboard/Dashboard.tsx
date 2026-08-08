// frontend/src/components/dashboard/Dashboard.tsx
"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { clearTokens } from "@/src/lib/api/auth";
import { getCurrentUser } from "@/src/lib/api";
import {
  getGreenActionStats,
  listGreenActions,
} from "@/src/lib/api/green_actions";
import {
  getCarbonFootprintStats,
  listCarbonFootprints,
} from "@/src/lib/api/carbon_footprint";
import type { User } from "@/src/types/user";
import type {
  GreenActionStats,
  GreenActionResponse,
} from "@/src/types/green_action";
import type {
  CarbonFootprintStats,
  CarbonFootprintResponse,
} from "@/src/types/carbon_footprint";

import GreenActionLogScreen from "@/src/components/green_actions/GreenActionLogScreen";
import CarbonFootprintLogScreen from "@/src/components/carbon_footprint/CarbonFootprintLogScreen";
import { CategoryBars, WeeklyTrend } from "./charts";

type DashboardData = {
  user: User | null;
  greenStats: GreenActionStats | null;
  carbonStats: CarbonFootprintStats | null;
  recentGreen: GreenActionResponse[];
  recentCarbon: CarbonFootprintResponse[];
};

const EMPTY_DASHBOARD: DashboardData = {
  user: null,
  greenStats: null,
  carbonStats: null,
  recentGreen: [],
  recentCarbon: [],
};

function StatCard({
  label,
  value,
  unit,
  accent,
  sub,
}: {
  label: string;
  value: string;
  unit?: string;
  accent: string;
  sub?: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/45">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold" style={{ color: accent }}>
        {value}
        {unit && <span className="ml-1 text-sm font-normal text-white/45">{unit}</span>}
      </p>
      {sub && <p className="mt-1 text-xs text-white/40">{sub}</p>}
    </div>
  );
}

function formatRelative(iso: string): string {
  // Avoid hydration mismatches by not using Date.now on the server.
  if (typeof window === "undefined") {
    // Server-side render: return an empty placeholder.
    return "";
  }
  const then = new Date(iso).getTime();
  const diff = Date.now() - then;
  const mins = Math.round(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString(undefined, { day: "2-digit", month: "short" });
}

const prettify = (s: string) => s.replace(/_/g, " ");

export default function Dashboard() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData>(EMPTY_DASHBOARD);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = useCallback(async () => {
    try {
      setError("");
      const [user, greenStats, carbonStats, recentGreen, recentCarbon] = await Promise.all([
        getCurrentUser(),
        getGreenActionStats(),
        getCarbonFootprintStats(),
        listGreenActions({ limit: 5 }),
        listCarbonFootprints({ limit: 5 }),
      ]);
      setData({ user, greenStats, carbonStats, recentGreen, recentCarbon });
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

  function handleLogout() {
    clearTokens();
    router.replace("/login");
  }

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
  const totalEmitted = data.carbonStats?.total_co2_emitted ?? 0;
  const netImpact = totalEmitted - totalSaved; // positive = net emitter

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      {/* Header */}
      <div className="rounded-[32px] border border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(111,207,69,0.2),_transparent_55%)] p-6 shadow-[0_25px_70px_rgba(0,0,0,0.3)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#6fcf45]">
              Dashboard
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-white">
              Welcome back, {data.user?.first_name ?? "there"}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/65">
              Track your green actions, understand your carbon footprint, and watch your
              impact grow.
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/80 transition hover:bg-white/10"
          >
            Logout
          </button>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          <StatCard
            label="CO₂ Saved"
            value={totalSaved.toFixed(2)}
            unit="kg"
            accent="#6fcf45"
            sub={`${data.greenStats?.total_actions ?? 0} actions`}
          />
          <StatCard
            label="CO₂ Emitted"
            value={totalEmitted.toFixed(2)}
            unit="kg"
            accent="#f07030"
            sub={`${data.carbonStats?.total_entries ?? 0} entries`}
          />
          <StatCard
            label="Trees Planted"
            value={String(data.greenStats?.total_trees ?? 0)}
            accent="#9de86a"
          />
          <StatCard
            label="Net Impact"
            value={netImpact.toFixed(2)}
            unit="kg"
            accent={netImpact <= 0 ? "#6fcf45" : "#f07030"}
            sub={netImpact <= 0 ? "net positive 🌍" : "net emitter"}
          />
        </div>
      </div>

      {/* Weekly trend */}
      <div className="rounded-[28px] border border-white/10 bg-[#07140d] p-5 shadow-[0_22px_70px_rgba(0,0,0,0.35)] sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#6fcf45]">
              Weekly Trend
            </p>
            <h2 className="text-lg font-semibold text-white">Last 6 weeks</h2>
          </div>
          <div className="flex items-center gap-3 text-[10px] text-white/55">
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-[#6fcf45]" /> Saved
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-[#f07030]" /> Emitted
            </span>
          </div>
        </div>
        <WeeklyTrend
          saved={data.greenStats?.weekly_trend ?? []}
          emitted={data.carbonStats?.weekly_trend ?? []}
        />
      </div>

      {/* Category breakdowns */}
      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-[28px] border border-white/10 bg-[#07140d] p-5 shadow-[0_22px_70px_rgba(0,0,0,0.35)] sm:p-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#6fcf45]">
            Savings by Category
          </p>
          <h2 className="mb-4 text-lg font-semibold text-white">Where your CO₂ savings come from</h2>
          <CategoryBars
            items={(data.greenStats?.by_category ?? []).map((c) => ({
              label: c.category,
              value: c.co2_saved,
            }))}
            unit="kg"
            accent="#6fcf45"
          />
        </div>

        <div className="rounded-[28px] border border-white/10 bg-[#07140d] p-5 shadow-[0_22px_70px_rgba(0,0,0,0.35)] sm:p-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#f07030]">
            Emissions by Category
          </p>
          <h2 className="mb-4 text-lg font-semibold text-white">Where your CO₂ comes from</h2>
          <CategoryBars
            items={(data.carbonStats?.by_category ?? []).map((c) => ({
              label: c.category,
              value: c.co2_emitted,
            }))}
            unit="kg"
            accent="#f07030"
          />
        </div>
      </div>

      {/* Recent activity */}
      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-[28px] border border-white/10 bg-[#07140d] p-5 shadow-[0_22px_70px_rgba(0,0,0,0.35)] sm:p-6">
          <h2 className="mb-4 text-lg font-semibold text-white">Recent Green Actions</h2>
          {data.recentGreen.length === 0 ? (
            <p className="text-sm text-white/45">No actions logged yet — log one below!</p>
          ) : (
            <ul className="space-y-2">
              {data.recentGreen.map((a) => (
                <li
                  key={a.id}
                  className="flex items-center justify-between rounded-xl border border-white/5 bg-white/5 px-3 py-2"
                >
                  <div>
                    <p className="text-sm font-medium capitalize text-white/85">
                      {prettify(a.activity)} · {a.quantity} {a.unit}
                    </p>
                    <p className="text-[10px] text-white/40">
                      {prettify(a.category)} · {formatRelative(a.created_at)}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-[#6fcf45]">
                    −{a.co2_saved.toFixed(2)} kg
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-[28px] border border-white/10 bg-[#07140d] p-5 shadow-[0_22px_70px_rgba(0,0,0,0.35)] sm:p-6">
          <h2 className="mb-4 text-lg font-semibold text-white">Recent Footprint Entries</h2>
          {data.recentCarbon.length === 0 ? (
            <p className="text-sm text-white/45">No footprint entries yet — log one below!</p>
          ) : (
            <ul className="space-y-2">
              {data.recentCarbon.map((c) => (
                <li
                  key={c.id}
                  className="flex items-center justify-between rounded-xl border border-white/5 bg-white/5 px-3 py-2"
                >
                  <div>
                    <p className="text-sm font-medium capitalize text-white/85">
                      {prettify(c.activity)} · {c.quantity} {c.unit}
                    </p>
                    <p className="text-[10px] text-white/40">
                      {prettify(c.category)} · {formatRelative(c.created_at)}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-[#f07030]">
                    +{c.co2_emitted.toFixed(2)} kg
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Log screens */}
      <div className="grid gap-6 xl:grid-cols-2">
        <GreenActionLogScreen onLogged={loadDashboard} />
        <CarbonFootprintLogScreen onLogged={loadDashboard} />
      </div>
    </div>
  );
}
