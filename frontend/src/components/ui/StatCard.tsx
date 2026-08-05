// frontend/src/components/ui/StatCard.tsx
"use client";

interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  accent: string;
  sub?: string;
}

export default function StatCard({ label, value, unit, accent, sub }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/45">{label}</p>
      <p className="mt-2 text-2xl font-semibold" style={{ color: accent }}>
        {value}{unit && <span className="ml-1 text-sm font-normal text-white/45">{unit}</span>}
      </p>
      {sub && <p className="mt-1 text-xs text-white/40">{sub}</p>}
    </div>
  );
}
