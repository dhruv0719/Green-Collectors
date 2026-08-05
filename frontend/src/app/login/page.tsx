// frontend/src/app/login/page.tsx
import LoginClient from "@/src/components/auth/LoginClient";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(111,207,69,0.16),_transparent_32%),linear-gradient(135deg,_#07140d_0%,_#0f2318_100%)] p-4 sm:p-6">
      <LoginClient />
    </main>
  );
}