// frontend/src/components/navigation/DesktopSidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/home", label: "Home", icon: "🏠" },
  { href: "/green-actions", label: "Actions", icon: "🌿" },
  { href: "/carbon-footprint", label: "CO₂", icon: "⚖️" },
  { href: "/profile", label: "Profile", icon: "👤" },
];

export default function DesktopSidebar() {
  const pathname = usePathname();
  return (
    <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-white/10 bg-[#020907] md:block">
      <nav className="flex h-full flex-col p-4">
        <div className="mb-8 text-2xl font-bold text-[#6fcf45]">🌿 Green Collectors</div>
        <ul className="flex-1 space-y-2">
          {items.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center gap-3 rounded px-3 py-2 text-sm font-medium transition-colors ${pathname === item.href ? "bg-[#6fcf45] text-[#020907]" : "text-white/70 hover:bg-white/5"}`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
