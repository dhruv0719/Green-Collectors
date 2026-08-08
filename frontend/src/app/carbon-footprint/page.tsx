"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { clearTokens } from "@/src/lib/api/auth";
import { getCurrentUser } from "@/src/lib/api";
import { getCarbonFootprintStats, listCarbonFootprints } from "@/src/lib/api/carbon_footprint";
import type { User } from "@/src/types/user";
import type { CarbonFootprintStats, CarbonFootprintResponse } from "@/src/types/carbon_footprint";

const CATEGORY_DEFINITIONS = [
  { key: "transport", label: "Transport", icon: "🚗", accent: "#6fcf45" },
  { key: "food & diet", label: "Food & Diet", icon: "🍖", accent: "#f0a830" },
  { key: "home energy", label: "Home Energy", icon: "🏠", accent: "#4ab8e8" },
  { key: "shopping", label: "Shopping", icon: "🛍️", accent: "#9de86a" },
  { key: "flights", label: "Flights", icon: "✈️", accent: "#e85c3a" },
];

const INDIA_AVERAGE = 1.9;
const WORLD_AVERAGE = 4.7;
const TARGET_ANNUAL = 2.0;
const GAUGE_PATH_LENGTH = 170;

function toTonnes(kg: number) {
  return kg / 1000;
}

function buildTip(stats: CarbonFootprintStats | null) {
  if (!stats) {
    return "Log a CO₂ entry to get personalized insights and see your annual impact.";
  }

  const annual = toTonnes(stats.total_co2_emitted);
  const topCategory = [...stats.by_category]
    .sort((a, b) => b.co2_emitted - a.co2_emitted)
    .map((item) => ({
      ...item,
      key: item.category.toLowerCase(),
      tonnes: toTonnes(item.co2_emitted),
    }))[0];

  if (topCategory?.tonnes > 0.7 && topCategory.key.includes("flight")) {
    return "Flights are your biggest emitter. Reducing one round-trip flight can cut your annual footprint significantly.";
  }
  if (topCategory?.tonnes > 0.7 && topCategory.key.includes("transport")) {
    return "Transport is the largest contributor. Swapping a few car trips for walking, cycling, or public transit can lower your yearly emissions.";
  }
  if (topCategory?.tonnes > 0.7 && topCategory.key.includes("food")) {
    return "Food and diet make up a large part of your footprint. More plant-based meals can have a strong climate benefit.";
  }
  if (annual > TARGET_ANNUAL) {
    return "You are above the climate-safe target. Focus on one high-impact category this week to move toward a lower annual footprint.";
  }

  return "Great work! Keep logging your CO₂ entries to keep your annual footprint under the target and compare progress over time.";
}

function normalizeCategoryKey(category: string) {
  return category.replace(/[_\s]+/g, " ").toLowerCase();
}

export default function CarbonFootprintPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<CarbonFootprintStats | null>(null);
  const [recent, setRecent] = useState<CarbonFootprintResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  const loadData = useCallback(async () => {
    try {
      setError("");
      const [u, s, r] = await Promise.all([
        getCurrentUser(),
        getCarbonFootprintStats(),
        listCarbonFootprints({ limit: 10 }),
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

  const categoryItems = useMemo(() => {
    const breakdown = stats?.by_category ?? [];
    return CATEGORY_DEFINITIONS.map((definition) => {
      const match = breakdown.find((item) => normalizeCategoryKey(item.category) === definition.key);
      const valueTonnes = toTonnes(match?.co2_emitted ?? 0);
      return { ...definition, valueTonnes };
    });
  }, [stats]);

  const maxCategoryValue = Math.max(...categoryItems.map((item) => item.valueTonnes), 1);
  const annualTonnes = toTonnes(stats?.total_co2_emitted ?? 0);
  const entriesCount = stats?.total_entries ?? 0;
  const gaugePercent = Math.min(100, Math.round((annualTonnes / WORLD_AVERAGE) * 100));
  const dashOffset = Math.round(GAUGE_PATH_LENGTH - (gaugePercent / 100) * GAUGE_PATH_LENGTH);
  const tipText = buildTip(stats);

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl p-4 md:p-6">
        <div className="rounded-[28px] border border-white/10 bg-[#07140d] p-8 text-center text-white shadow-[0_25px_70px_rgba(0,0,0,0.35)]">
          Loading your CO₂ footprint…
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-6xl p-4 md:p-6">
        <div className="rounded-[28px] border border-white/10 bg-[#07140d] p-8 text-center text-red-300 shadow-[0_25px_70px_rgba(0,0,0,0.35)]">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 md:p-6">
      <div className="flex flex-col gap-4 rounded-[32px] border border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(111,207,69,0.2),_transparent_55%)] p-6 shadow-[0_25px_70px_rgba(0,0,0,0.3)] sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#6fcf45]">CO₂ Footprint</p>
          <h1 className="mt-3 text-3xl font-semibold text-white">Your annual emissions at a glance</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/70">
            Visualize your yearly footprint, compare it to global benchmarks, and add new emissions entries quickly.
          </p>
        </div>

        <Link
          href="/carbon-footprint/log"
          className="inline-flex items-center justify-center rounded-full bg-[#6fcf45] px-5 py-3 text-sm font-semibold text-[#07140d] shadow-[0_20px_50px_rgba(111,207,69,0.22)] transition hover:bg-[#7ce35b]"
        >
          + Quick Add
        </Link>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-[32px] border border-white/10 bg-[#07140d] p-6 shadow-[0_22px_70px_rgba(0,0,0,0.35)]">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#6fcf45]">Your Annual Emission</p>
              <p className="mt-2 text-sm text-white/70">Based on your logged CO₂ footprint entries.</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-3xl bg-white/5 p-4 text-center">
                <p className="text-xs uppercase tracking-[0.24em] text-white/50">Entries</p>
                <p className="mt-2 text-2xl font-semibold text-white">{entriesCount}</p>
              </div>
              <div className="rounded-3xl bg-white/5 p-4 text-center">
                <p className="text-xs uppercase tracking-[0.24em] text-white/50">Target</p>
                <p className="mt-2 text-2xl font-semibold text-[#6fcf45]">{TARGET_ANNUAL}t</p>
              </div>
              <div className="rounded-3xl bg-white/5 p-4 text-center">
                <p className="text-xs uppercase tracking-[0.24em] text-white/50">Benchmark</p>
                <p className="mt-2 text-2xl font-semibold text-[#f0a830]">{WORLD_AVERAGE}t</p>
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="rounded-[28px] bg-[#020907] p-6 text-center shadow-[0_25px_40px_rgba(0,0,0,0.25)]">
              <svg viewBox="0 0 140 76" className="mx-auto h-48 w-full">
                <path
                  d="M 16 70 A 54 54 0 0 1 124 70"
                  fill="none"
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
                <path
                  d="M 16 70 A 54 54 0 0 1 124 70"
                  fill="none"
                  stroke="url(#annualGradient)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${GAUGE_PATH_LENGTH}`}
                  strokeDashoffset={`${dashOffset}`}
                />
                <defs>
                  <linearGradient id="annualGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#6fcf45" />
                    <stop offset="50%" stopColor="#f0a830" />
                    <stop offset="100%" stopColor="#e85c3a" />
                  </linearGradient>
                </defs>
                <text x="70" y="46" textAnchor="middle" fontFamily="Fraunces,serif" fontSize="30" fill="#f0a830" fontWeight="900">
                  {annualTonnes.toFixed(1)}
                </text>
                <text x="70" y="61" textAnchor="middle" fontFamily="DM Sans,Arial,Helvetica,sans-serif" fontSize="10" fill="rgba(255,255,255,0.45)">
                  tonnes CO₂/yr
                </text>
              </svg>
              <div className="mt-4 flex items-center justify-between text-[11px] uppercase tracking-[0.2em] text-white/40">
                <span>LOW</span>
                <span>HIGH</span>
              </div>
            </div>

            <div className="space-y-4 rounded-[28px] border border-white/10 bg-[#020907] p-5 text-sm text-white/70">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-white/50">
                  <span>India average</span>
                  <span className="font-semibold text-white">{INDIA_AVERAGE}t</span>
                </div>
                <div className="h-2 rounded-full bg-white/5">
                  <div className="h-full rounded-full bg-[#6fcf45]" style={{ width: `${Math.min(100, (INDIA_AVERAGE / WORLD_AVERAGE) * 100)}%` }} />
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-white/50">
                  <span>World average</span>
                  <span className="font-semibold text-white">{WORLD_AVERAGE}t</span>
                </div>
                <div className="h-2 rounded-full bg-white/5">
                  <div className="h-full rounded-full bg-[#f0a830]" style={{ width: "100%" }} />
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-white/50">
                  <span>Target</span>
                  <span className="font-semibold text-[#6fcf45]">{TARGET_ANNUAL}t</span>
                </div>
                <div className="h-2 rounded-full bg-white/5">
                  <div className="h-full rounded-full bg-[#6fcf45]" style={{ width: `${Math.min(100, (TARGET_ANNUAL / WORLD_AVERAGE) * 100)}%` }} />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[32px] border border-white/10 bg-[#07140d] p-6 shadow-[0_22px_70px_rgba(0,0,0,0.35)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#6fcf45]">Breakdown by Category</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Where your CO₂ comes from</h2>
            </div>
            <span className="rounded-3xl bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.22em] text-white/70">
              {annualTonnes.toFixed(1)}t total
            </span>
          </div>
          <div className="mt-6 space-y-4">
            {categoryItems.map((item) => {
              const width = maxCategoryValue > 0 ? Math.max(6, Math.round((item.valueTonnes / maxCategoryValue) * 100)) : 6;
              return (
                <div key={item.key} className="space-y-2 rounded-[24px] bg-white/5 p-4">
                  <div className="flex items-center justify-between gap-3 text-sm font-medium text-white">
                    <div className="flex items-center gap-3">
                      <span className="rounded-2xl bg-white/10 px-3 py-2 text-lg">{item.icon}</span>
                      <span>{item.label}</span>
                    </div>
                    <span className="text-white/80">{item.valueTonnes.toFixed(1)}t</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${width}%`, backgroundColor: item.accent }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-[32px] border border-white/10 bg-[#07140d] p-6 shadow-[0_22px_70px_rgba(0,0,0,0.35)]">
          <div className="flex items-start gap-3">
            <div className="mt-1 rounded-2xl bg-[#6fcf45]/10 p-3 text-xl">💡</div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#6fcf45]">Sustainability Insight</p>
              <p className="mt-3 text-base leading-7 text-white/75">{tipText}</p>
            </div>
          </div>
        </section>

        <section className="rounded-[32px] border border-white/10 bg-[#07140d] p-6 shadow-[0_22px_70px_rgba(0,0,0,0.35)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#6fcf45]">Recent CO₂ Entries</p>
              <p className="mt-2 text-sm text-white/70">Keep track of your latest footprint logs.</p>
            </div>
            <Link href="/carbon-footprint/log" className="text-sm font-medium text-[#6fcf45] hover:underline">
              Add new
            </Link>
          </div>
          <div className="mt-6 space-y-3">
            {recent.length === 0 ? (
              <p className="text-sm text-white/45">No footprint entries available yet.</p>
            ) : (
              recent.slice(0, 5).map((entry) => (
                <div key={entry.id} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-white">{entry.activity}</p>
                      <p className="text-xs text-white/50">{entry.category} · {entry.quantity} {entry.unit}</p>
                    </div>
                    <span className="text-sm font-semibold text-[#f07030]">+{toTonnes(entry.co2_emitted).toFixed(2)}t</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
