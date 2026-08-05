// frontend/src/app/green-actions/log/page.tsx
"use client"

import { useRouter } from "next/navigation"
import GreenActionLogScreen from "@/src/components/green_actions/GreenActionLogScreen"

export default function GreenActionLogPage() {
  const router = useRouter()

  const handleLogged = () => {
    // After a successful log, go back to the main green‑actions page
    router.replace("/green-actions")
  }

  return <GreenActionLogScreen onLogged={handleLogged} />
}
