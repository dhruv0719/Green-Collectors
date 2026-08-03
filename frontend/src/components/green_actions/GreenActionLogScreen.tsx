"use client";

import { useMemo, useState } from "react";

import { logGreenAction } from "@/src/lib/api/green_actions";
import type { GreenActionCreate, GreenActionResponse } from "@/src/types/green_action";

const CATEGORY_OPTIONS = [
  {
    value: "transport",
    label: "Transport",
    icon: "🚲",
    description: "Cycling, walking or public transit",
  },
  {
    value: "recycling",
    label: "Recycling",
    icon: "♻️",
    description: "Sort and reuse everyday waste",
  },
  {
    value: "energy",
    label: "Energy",
    icon: "💡",
    description: "Lower power consumption",
  },
  {
    value: "nature",
    label: "Nature",
    icon: "🌳",
    description: "Planting and caring for green spaces",
  },
] as const;

const ACTIVITY_OPTIONS: Record<string, Array<{ value: string; label: string }>> = {
  transport: [
    { value: "cycling", label: "Cycling" },
    { value: "walking", label: "Walking" },
    { value: "bus", label: "Bus" },
    { value: "train", label: "Train" },
    { value: "metro", label: "Metro" },
  ],
  recycling: [
    { value: "plastic", label: "Plastic" },
    { value: "paper", label: "Paper" },
    { value: "glass", label: "Glass" },
  ],
  energy: [
    { value: "led_bulb", label: "LED bulb" },
    { value: "solar_panel", label: "Solar panel" },
  ],
  nature: [{ value: "tree_planting", label: "Tree planting" }],
};

const UNIT_OPTIONS: Record<string, Array<{ value: string; label: string }>> = {
  transport: [{ value: "km", label: "km" }],
  recycling: [{ value: "kg", label: "kg" }],
  energy: [{ value: "kwh", label: "kWh" }],
  nature: [{ value: "count", label: "count" }],
};

export default function GreenActionLogScreen({ onLogged }: { onLogged?: () => void }) {
  const [category, setCategory] = useState("transport");
  const [activity, setActivity] = useState("cycling");
  const [quantity, setQuantity] = useState("5");
  const [unit, setUnit] = useState("km");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState<GreenActionResponse | null>(null);

  const availableActivities = useMemo(
    () => ACTIVITY_OPTIONS[category] ?? ACTIVITY_OPTIONS.transport,
    [category]
  );

  const availableUnits = useMemo(
    () => UNIT_OPTIONS[category] ?? UNIT_OPTIONS.transport,
    [category]
  );

  const resolvedActivity = useMemo(() => {
    return availableActivities.some((item) => item.value === activity)
      ? activity
      : availableActivities[0]?.value ?? "cycling";
  }, [activity, availableActivities]);

  const resolvedUnit = useMemo(() => {
    return availableUnits.some((item) => item.value === unit)
      ? unit
      : availableUnits[0]?.value ?? "km";
  }, [unit, availableUnits]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");
      setSuccess(null);

      const payload: GreenActionCreate = {
        category,
        activity,
        quantity: Number(quantity),
        unit,
        location,
      };

      const data = await logGreenAction(payload);
      setSuccess(data);
      setLocation("");
      setQuantity("1");
      onLogged?.();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("We could not save your action right now.");
      }
    } finally {
      setLoading(false);
    }
  }

  const selectedCategory = CATEGORY_OPTIONS.find((item) => item.value === category);

  return (
    <div className="w-full overflow-hidden rounded-[30px] border border-white/10 bg-[#07140d] shadow-[0_22px_70px_rgba(0,0,0,0.35)]">
      <div className="bg-[radial-gradient(circle_at_top_left,_rgba(111,207,69,0.2),_transparent_55%)] p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6fcf45] to-[#2d6e45] text-xl shadow-lg shadow-green-900/30">
            🌿
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#6fcf45]">
              Log Green Action
            </p>
            <h2 className="text-xl font-semibold text-white">Track your impact</h2>
          </div>
        </div>

        <p className="mt-4 text-sm leading-6 text-white/65">
          Capture the eco choices you made today and let the platform calculate the carbon you saved.
        </p>

        <div className="mt-5 rounded-2xl border border-white/10 bg-[#0d2615] p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/45">
                Choose a category
              </p>
              <p className="mt-1 text-sm text-white/75">{selectedCategory?.description}</p>
            </div>
            <div className="rounded-full border border-[#6fcf45]/30 bg-[#6fcf45]/10 px-3 py-1 text-[11px] font-semibold text-[#6fcf45]">
              {selectedCategory?.label}
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {CATEGORY_OPTIONS.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => setCategory(item.value)}
                className={`rounded-full border px-3 py-2 text-sm font-medium transition ${
                  category === item.value
                    ? "border-[#6fcf45] bg-[#6fcf45] text-[#07140d]"
                    : "border-white/10 bg-white/5 text-white/70"
                }`}
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded-2xl border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <div>
            <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.2em] text-white/45">
              Activity
            </label>
            <select
              value={resolvedActivity}
              onChange={(event) => setActivity(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-[#6fcf45] focus:ring-2 focus:ring-[#6fcf45]/20"
            >
              {ACTIVITY_OPTIONS[category]?.map((item) => (
                <option key={item.value} value={item.value} className="bg-[#07140d] text-white">
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.2em] text-white/45">
                Quantity
              </label>
              <input
                type="number"
                min="1"
                step="0.1"
                value={quantity}
                onChange={(event) => setQuantity(event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-[#6fcf45] focus:ring-2 focus:ring-[#6fcf45]/20"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.2em] text-white/45">
                Unit
              </label>
              <select
                value={resolvedUnit}
                onChange={(event) => setUnit(event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-[#6fcf45] focus:ring-2 focus:ring-[#6fcf45]/20"
              >
                {availableUnits.map((item) => (
                  <option key={item.value} value={item.value} className="bg-[#07140d] text-white">
                    {item.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.2em] text-white/45">
              Location
            </label>
            <input
              type="text"
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              placeholder="Where did you do it?"
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-[#6fcf45] focus:ring-2 focus:ring-[#6fcf45]/20"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-gradient-to-r from-[#6fcf45] to-[#2d6e45] py-3 text-sm font-semibold text-[#07140d] shadow-lg shadow-green-900/30 transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Saving your action..." : "Log green action"}
          </button>
        </form>

        {success && (
          <div className="mt-4 rounded-2xl border border-[#6fcf45]/20 bg-gradient-to-r from-[#164d24] to-[#1f6b31] p-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#9de86a]">
              Saved successfully
            </p>
            <p className="mt-2 text-sm text-white/85">
              Your action was logged and you saved about {success.co2_saved.toFixed(2)} kg of CO₂.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
