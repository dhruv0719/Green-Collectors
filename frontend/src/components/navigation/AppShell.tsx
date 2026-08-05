// frontend/src/components/navigation/AppShell.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import DesktopSidebar from "./DesktopSidebar";
import MobileBottomNav from "./MobileBottomNav";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const navItems = [
    { href: "/home", label: "Home" },
    { href: "/green-actions", label: "Green Actions" },
    { href: "/carbon-footprint", label: "CO₂" },
    { href: "/profile", label: "Profile" },
  ];

  return (
    <div className="flex min-h-screen bg-[#06100a] text-white">
      {/* Desktop sidebar */}
      <DesktopSidebar />

      {/* Main area */}
      <div className="flex flex-1 flex-col">
        {/* Header for mobile (optional) */}
        <header className="flex items-center justify-between border-b border-white/10 bg-[#020907] px-4 py-3 md:hidden">
          <Link href="/home" className="text-2xl font-bold text-[#6fcf45]">
            🌿 Green Collectors
          </Link>
          {/* Simple mobile nav links (optional) */}
          <nav className="flex gap-4 text-sm font-medium">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded px-2 py-1 transition-colors ${pathname === item.href ? "bg-[#6fcf45] text-[#020907]" : "text-white/70 hover:bg-white/5"}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">{children}</main>

        {/* Mobile bottom navigation */}
        <MobileBottomNav />
      </div>
    </div>
  );
}
