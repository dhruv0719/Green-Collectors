// frontend/src/app/profile/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { clearTokens } from "@/src/lib/api/auth";
import { getCurrentUser } from "@/src/lib/api";
import type { User } from "@/src/types/user";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const u = await getCurrentUser();
        setUser(u);
      } catch {
        clearTokens();
        router.replace("/login");
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  if (loading) {
    return <p className="p-4 text-white">Loading…</p>;
  }

  if (!user) {
    return null; // redirect handled above
  }

  return (
    <div className="mx-auto max-w-2xl rounded-[28px] border border-white/10 bg-[#07140d] p-6 shadow-[0_25px_70px_rgba(0,0,0,0.35)]">
      <h1 className="mb-4 text-2xl font-semibold text-white">Profile</h1>
      <p className="mb-2 text-white/80">First name: {user.first_name}</p>
      <p className="mb-2 text-white/80">Last name: {user.last_name}</p>
      <p className="mb-4 text-white/80">Email: {user.email}</p>
      <button
        onClick={() => {
          clearTokens();
          router.replace("/login");
        }}
        className="rounded-xl bg-gradient-to-r from-[#6fcf45] to-[#2d6e45] px-4 py-2 font-semibold text-[#07140d]"
      >
        Logout
      </button>
    </div>
  );
}
