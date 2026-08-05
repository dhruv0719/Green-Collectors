// frontend/src/components/navigation/MobileBottomNav.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/home", label: "Home", icon: "🏠" },
  { href: "/green-actions", label: "Actions", icon: "🌿" },
  { href: "/carbon-footprint", label: "CO₂", icon: "⚖️" },
  { href: "/profile", label: "Profile", icon: "👤" },
];

export default function MobileBottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed inset-x-0 bottom-0 bg-[#020907] border-t border-white/10 backdrop-blur-sm md:hidden">
      <ul className="flex justify-around py-2">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className={`flex flex-col items-center text-xs ${pathname === item.href ? "text-[#6fcf45]" : "text-white/70"}`}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
