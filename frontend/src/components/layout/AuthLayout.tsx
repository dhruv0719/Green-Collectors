"use client";

import { usePathname } from "next/navigation";
import AppShell from "@/src/components/navigation/AppShell";

/**
 * AuthLayout wraps the page content and decides whether to display the main
 * application navigation (AppShell) based on the current route. It is a client
 * component because it relies on `usePathname`, which is only available on the
 * client side.
 */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/signup");

  return isAuthPage ? <>{children}</> : <AppShell>{children}</AppShell>;
}
