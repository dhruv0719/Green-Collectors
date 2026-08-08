// frontend/src/components/navigation/AppShell.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import MobileBottomNav from "./MobileBottomNav";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const navItems = [
    { href: "/home", label: "Home" },
    { href: "/carbon-footprint", label: "CO₂ Footprint" },
    { href: "/green-actions", label: "Green Actions" },
    { href: "/profile", label: "Profile" },
  ];

  return (
    <div className="min-h-screen bg-[#06100a] text-white">
      <header className="border-b border-white/10 bg-[#020907] px-4 py-4 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <Link href="/home" className="flex items-center gap-3 text-xl font-bold text-[#6fcf45]">
            <span className="text-2xl">🌿</span>
            <span>Green Collectors</span>
          </Link>

          <nav className="hidden items-center gap-4 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  pathname === item.href ? "bg-[#6fcf45] text-[#020907]" : "text-white/70 hover:bg-white/5"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl flex-1 p-4 sm:p-6">{children}</main>

      <MobileBottomNav />
    </div>
  );
}
