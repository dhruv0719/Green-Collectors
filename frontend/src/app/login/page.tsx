// frontend/src/app/login/page.tsx
import LoginForm from "@/src/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <LoginForm />
    </main>
  );
}