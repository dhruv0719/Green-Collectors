// frontend/src/components/dashboard/charts.tsx
// Lightweight, dependency-free charts for the dashboard (no chart library —
// just SVG/divs). Keeps the MVP bundle small and avoids a new dependency.

type BreakdownItem = { label: string; value: number };

/** Horizontal category bars scaled to the largest value. */
export function CategoryBars({
  items,
  unit = "kg",
  accent = "#6fcf45",
}: {
  items: BreakdownItem[];
  unit?: string;
  accent?: string;
}) {
  const max = items.reduce((m, i) => Math.max(m, i.value), 0) || 1;

  if (items.length === 0) {
    return (
      <p className="text-sm text-white/45">No data logged in this category yet.</p>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item) => {
        const pct = Math.max(4, Math.round((item.value / max) * 100));
        return (
          <div key={item.label}>
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="font-medium capitalize text-white/70">{item.label}</span>
              <span className="text-white/55">
                {item.value.toLocaleString(undefined, { maximumFractionDigits: 2 })} {unit}
              </span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/5">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${pct}%`, backgroundColor: accent }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

type TrendPoint = { week_start: string; total: number };

/** Vertical weekly trend columns. Two series: saved (green) vs emitted (orange). */
export function WeeklyTrend({
  saved,
  emitted,
}: {
  saved: TrendPoint[];
  emitted: TrendPoint[];
}) {
  const all = [...saved, ...emitted];
  if (all.length === 0) {
    return <p className="text-sm text-white/45">No activity recorded in the last 6 weeks.</p>;
  }

  const max = all.reduce((m, p) => Math.max(m, p.total), 0) || 1;
  const weeks = saved.length > 0 ? saved : emitted;

  return (
    <div className="flex h-40 items-end justify-between gap-2">
      {weeks.map((point, i) => {
        const emittedPoint = emitted[i] ?? { total: 0 };
        const savedH = Math.round((point.total / max) * 100);
        const emittedH = Math.round((emittedPoint.total / max) * 100);
        const label = new Date(point.week_start).toLocaleDateString(undefined, {
          day: "2-digit",
          month: "short",
        });
        return (
          <div key={point.week_start} className="flex flex-1 flex-col items-center gap-1">
            <div className="flex h-32 w-full items-end justify-center gap-1">
              <div
                className="w-1/2 max-w-3 rounded-t bg-[#6fcf45]"
                style={{ height: `${Math.max(2, savedH)}%` }}
                title={`Saved: ${point.total.toFixed(2)} kg`}
              />
              <div
                className="w-1/2 max-w-3 rounded-t bg-[#f07030]"
                style={{ height: `${Math.max(2, emittedH)}%` }}
                title={`Emitted: ${emittedPoint.total.toFixed(2)} kg`}
              />
            </div>
            <span className="text-[9px] text-white/40">{label}</span>
          </div>
        );
      })}
    </div>
  );
}
