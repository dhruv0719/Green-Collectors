"use client";

import { useEffect, useState } from "react";

import { logCarbonFootprint } from "@/src/lib/api/carbon_footprint";

type CarbonFootprintPayload = {
  category: string;
  activity: string;
  quantity: number;
  unit: string;
};

type CarbonFootprintResponse = {
  category: string;
  activity: string;
  quantity: number;
  unit: string;
  co2_emitted: number;
};

const CATEGORY_OPTIONS = [
  { value: "transport", label: "Transport", icon: "🚗", description: "Cars, buses, trains and rides" },
  { value: "home_energy", label: "Home Energy", icon: "🏠", description: "Electricity and heating" },
  { value: "food", label: "Food", icon: "🍽️", description: "Meals and diet choices" },
  { value: "flight", label: "Flight", icon: "✈️", description: "Domestic and long-haul travel" },
  { value: "shopping", label: "Shopping", icon: "🛍️", description: "Goods and everyday purchases" },
  { value: "waste", label: "Waste", icon: "🗑️", description: "Waste disposal impact" },
] as const;

const ACTIVITY_OPTIONS: Record<string, Array<{ value: string; label: string }>> = {
  transport: [
    { value: "petrol_car", label: "Petrol car" },
    { value: "diesel_car", label: "Diesel car" },
    { value: "electric_car", label: "Electric car" },
    { value: "bus", label: "Bus" },
    { value: "train", label: "Train" },
    { value: "metro", label: "Metro" },
    { value: "motorbike", label: "Motorbike" },
  ],
  home_energy: [
    { value: "electricity", label: "Electricity" },
    { value: "lpg", label: "LPG" },
    { value: "natural_gas", label: "Natural gas" },
  ],
  food: [
    { value: "beef", label: "Beef" },
    { value: "lamb", label: "Lamb" },
    { value: "pork", label: "Pork" },
    { value: "chicken", label: "Chicken" },
    { value: "fish", label: "Fish" },
    { value: "vegetarian", label: "Vegetarian" },
    { value: "vegan", label: "Vegan" },
    { value: "dairy", label: "Dairy" },
  ],
  flight: [
    { value: "domestic", label: "Domestic" },
    { value: "short_haul", label: "Short haul" },
    { value: "long_haul", label: "Long haul" },
  ],
  shopping: [
    { value: "clothing", label: "Clothing" },
    { value: "electronics", label: "Electronics" },
    { value: "furniture", label: "Furniture" },
  ],
  waste: [{ value: "general_waste", label: "General waste" }],
};

const UNIT_OPTIONS: Record<string, Record<string, Array<{ value: string; label: string }>>> = {
  transport: {
    petrol_car: [{ value: "km", label: "km" }],
    diesel_car: [{ value: "km", label: "km" }],
    electric_car: [{ value: "km", label: "km" }],
    bus: [{ value: "km", label: "km" }],
    train: [{ value: "km", label: "km" }],
    metro: [{ value: "km", label: "km" }],
    motorbike: [{ value: "km", label: "km" }],
  },
  home_energy: {
    electricity: [{ value: "kwh", label: "kWh" }],
    lpg: [{ value: "liter", label: "liter" }],
    natural_gas: [{ value: "liter", label: "liter" }],
  },
  food: {
    beef: [{ value: "kg", label: "kg" }],
    lamb: [{ value: "kg", label: "kg" }],
    pork: [{ value: "kg", label: "kg" }],
    chicken: [{ value: "kg", label: "kg" }],
    fish: [{ value: "kg", label: "kg" }],
    vegetarian: [{ value: "kg", label: "kg" }],
    vegan: [{ value: "kg", label: "kg" }],
    dairy: [{ value: "kg", label: "kg" }],
  },
  flight: {
    domestic: [{ value: "km", label: "km" }],
    short_haul: [{ value: "km", label: "km" }],
    long_haul: [{ value: "km", label: "km" }],
  },
  shopping: {
    clothing: [{ value: "count", label: "count" }],
    electronics: [{ value: "count", label: "count" }],
    furniture: [{ value: "count", label: "count" }],
  },
  waste: {
    general_waste: [{ value: "kg", label: "kg" }],
  },
};

export default function CarbonFootprintLogScreen() {
  const [category, setCategory] = useState("transport");
  const [activity, setActivity] = useState("petrol_car");
  const [quantity, setQuantity] = useState("10");
  const [unit, setUnit] = useState("km");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState<CarbonFootprintResponse | null>(null);

  useEffect(() => {
    const nextActivities = ACTIVITY_OPTIONS[category] ?? ACTIVITY_OPTIONS.transport;
    setActivity((current) => {
      return nextActivities.some((item) => item.value === current) ? current : nextActivities[0].value;
    });
  }, [category]);

  useEffect(() => {
    const nextUnits = UNIT_OPTIONS[category]?.[activity] ?? UNIT_OPTIONS.transport.petrol_car;
    setUnit((current) => {
      return nextUnits.some((item) => item.value === current) ? current : nextUnits[0].value;
    });
  }, [activity, category]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");

      const payload: CarbonFootprintPayload = {
        category,
        activity,
        quantity: Number(quantity),
        unit,
      };

      const data = await logCarbonFootprint(payload);
      setSuccess(data);
      setQuantity("1");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("We could not save your footprint right now.");
      }
    } finally {
      setLoading(false);
    }
  }

  const selectedCategory = CATEGORY_OPTIONS.find((item) => item.value === category);

  return (
    <div className="w-full overflow-hidden rounded-[30px] border border-white/10 bg-[#07140d] shadow-[0_22px_70px_rgba(0,0,0,0.35)]">
      <div className="bg-[radial-gradient(circle_at_top_left,_rgba(232,92,58,0.18),_transparent_55%)] p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#f07030] to-[#e85c3a] text-xl shadow-lg shadow-orange-900/20">
            🌍
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#f07030]">
              Carbon Footprint
            </p>
            <h2 className="text-xl font-semibold text-white">Track what you emit</h2>
          </div>
        </div>

        <p className="mt-4 text-sm leading-6 text-white/65">
          Log the activities that add to your environmental impact and understand the carbon they produce.
        </p>

        <div className="mt-5 rounded-2xl border border-white/10 bg-[#24110c] p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/45">
                Pick a category
              </p>
              <p className="mt-1 text-sm text-white/75">{selectedCategory?.description}</p>
            </div>
            <div className="rounded-full border border-[#f07030]/30 bg-[#f07030]/10 px-3 py-1 text-[11px] font-semibold text-[#f07030]">
              {selectedCategory?.label}
            </div>
          </div>

          <div className="mt-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/70">
            Unit is automatically matched to your chosen activity so the request stays compatible with the backend.
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {CATEGORY_OPTIONS.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => setCategory(item.value)}
                className={`rounded-full border px-3 py-2 text-sm font-medium transition ${
                  category === item.value
                    ? "border-[#f07030] bg-[#f07030] text-[#07140d]"
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
              value={activity}
              onChange={(event) => setActivity(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-[#f07030] focus:ring-2 focus:ring-[#f07030]/20"
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
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-[#f07030] focus:ring-2 focus:ring-[#f07030]/20"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.2em] text-white/45">
                Unit
              </label>
              <select
                value={unit}
                onChange={(event) => setUnit(event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-[#f07030] focus:ring-2 focus:ring-[#f07030]/20"
              >
                {UNIT_OPTIONS[category]?.[activity]?.map((item) => (
                  <option key={item.value} value={item.value} className="bg-[#07140d] text-white">
                    {item.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-gradient-to-r from-[#f07030] to-[#e85c3a] py-3 text-sm font-semibold text-white shadow-lg shadow-orange-900/20 transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Saving footprint..." : "Log carbon footprint"}
          </button>
        </form>

        {success && (
          <div className="mt-4 rounded-2xl border border-[#f07030]/20 bg-gradient-to-r from-[#6c2b16] to-[#8d341d] p-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#ffb08a]">
              Saved successfully
            </p>
            <p className="mt-2 text-sm text-white/85">
              Your footprint entry was logged and it produced about {success.co2_emitted.toFixed(2)} kg of CO₂.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
