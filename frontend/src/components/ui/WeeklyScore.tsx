// frontend/src/components/ui/WeeklyScore.tsx
"use client";

import type { GreenActionStats } from "@/src/types/green_action";
import type { CarbonFootprintStats } from "@/src/types/carbon_footprint";

interface WeeklyScoreProps {
  greenStats: GreenActionStats | null;
  carbonStats: CarbonFootprintStats | null;
}

export default function WeeklyScore({ greenStats, carbonStats }: WeeklyScoreProps) {
  const saved = greenStats?.total_co2_saved ?? 0;
  const emitted = carbonStats?.total_co2_emitted ?? 0;
  const total = saved + emitted;
  const percent = total > 0 ? Math.round((saved / total) * 100) : null;

  return (
    <div className="flex flex-col items-center justify-center rounded-2xl bg-[#020907] p-6 text-center shadow-[0_15px_40px_rgba(0,0,0,0.25)]">
      <h2 className="mb-2 text-xl font-semibold text-white">Weekly Green Score</h2>
      {percent !== null ? (
        <div className="relative mb-2">
          <svg viewBox="0 0 36 36" className="h-24 w-24">
            <path
              className="stroke-white/20"
              strokeWidth="3.5"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831"
            />
            <path
              className="stroke-[#6fcf45]"
              strokeWidth="3.5"
              fill="none"
              strokeDasharray={`${percent} ${100 - percent}`}
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-[#6fcf45]">{percent}%</div>
        </div>
      ) : (
        <p className="text-sm text-white/60">Score will be available soon.</p>
      )}
      <p className="text-sm text-white/70">You offset {saved.toFixed(2)} kg CO₂ this week.</p>
    </div>
  );
}
