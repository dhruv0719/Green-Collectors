// frontend/src/app/green-actions/page.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { clearTokens } from "@/src/lib/api/auth";
import { getCurrentUser } from "@/src/lib/api";
import { getGreenActionStats, listGreenActions } from "@/src/lib/api/green_actions";
import type { User } from "@/src/types/user";
import type { GreenActionStats, GreenActionResponse } from "@/src/types/green_action";
import StatCard from "@/src/components/ui/StatCard";
import { CategoryBars, WeeklyTrend } from "@/src/components/dashboard/charts";
import WeeklyScore from "@/src/components/ui/WeeklyScore";
import Link from "next/link";

export default function GreenActionsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<GreenActionStats | null>(null);
  const [recent, setRecent] = useState<GreenActionResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  const loadData = useCallback(async () => {
    try {
      setError("");
      const [u, s, r] = await Promise.all([
        getCurrentUser(),
        getGreenActionStats(),
        listGreenActions({ limit: 10 }),
      ]);
      setUser(u);
      setStats(s);
      setRecent(r);
    } catch {
      clearTokens();
      setError("Session expired. Please sign in again.");
      router.replace("/login");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (loading) {
    return <p className="p-4 text-white">Loading…</p>;
  }

  if (error) {
    return <p className="p-4 text-red-400">{error}</p>;
  }

  const totalSaved = stats?.total_co2_saved ?? 0;
  const totalTrees = stats?.total_trees ?? 0;
  const totalActions = stats?.total_actions ?? 0;

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 md:p-6">
      {/* Header */}
      <header className="rounded-[32px] border border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(111,207,69,0.2),_transparent_55%)] p-6 shadow-[0_25px_70px_rgba(0,0,0,0.3)]">
        <h1 className="text-3xl font-semibold text-white">
          Green Actions
        </h1>
        <p className="mt-2 text-sm text-white/70">
          Log, view and analyse your sustainable activities.
        </p>
      </header>

      {/* Weekly Score */}
      <WeeklyScore greenStats={stats} carbonStats={null} />

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="CO₂ Saved" value={totalSaved.toFixed(2)} unit="kg" accent="#6fcf45" sub={`${totalActions} actions`} />
        <StatCard label="Trees Planted" value={String(totalTrees)} accent="#9de86a" />
        <StatCard label="Total Actions" value={String(totalActions)} accent="#6fcf45" />
      </div>

      {/* Weekly trend */}
      <div className="rounded-[28px] border border-white/10 bg-[#07140d] p-5 shadow-[0_22px_70px_rgba(0,0,0,0.35)]">
        <h2 className="mb-3 text-lg font-semibold text-white">Weekly Trend</h2>
        <WeeklyTrend saved={stats?.weekly_trend ?? []} emitted={[]} />
      </div>

      {/* Category breakdown */}
      <div className="rounded-[28px] border border-white/10 bg-[#07140d] p-5 shadow-[0_22px_70px_rgba(0,0,0,0.35)]">
        <h2 className="mb-3 text-lg font-semibold text-white">Savings by Category</h2>
        <CategoryBars
          items={(stats?.by_category ?? []).map((c) => ({ label: c.category, value: c.co2_saved }))}
          unit="kg"
          accent="#6fcf45"
        />
      </div>

      {/* Recent actions list */}
      <div className="rounded-[28px] border border-white/10 bg-[#07140d] p-5 shadow-[0_22px_70px_rgba(0,0,0,0.35)]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Recent Green Actions</h2>
          <Link href="/green-actions/log" className="text-sm font-medium text-[#6fcf45] hover:underline">
            Log new action
          </Link>
        </div>
        {recent.length === 0 ? (
          <p className="text-sm text-white/45">No actions logged yet.</p>
        ) : (
          <ul className="space-y-2">
            {recent.map((a) => (
              <li key={a.id} className="flex justify-between rounded border border-white/5 bg-white/5 px-3 py-2">
                <div>
                  <p className="text-sm font-medium capitalize text-white/85">
                    {a.activity} · {a.quantity} {a.unit}
                  </p>
                  <p className="text-[10px] text-white/40">
                    {a.category} · {new Date(a.created_at).toLocaleDateString()}
                  </p>
                </div>
                <span className="text-sm font-semibold text-[#6fcf45]">-{a.co2_saved.toFixed(2)} kg</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
