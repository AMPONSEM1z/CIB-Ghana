import { LoginForm } from "@/components/login-form"

export const metadata = {
  title: "Admin Login - CIB Portal",
  description: "Admin authentication for the CIB appointment management dashboard",
}

export default function LoginPage() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center px-4 py-12">
      <LoginForm />
    </main>
  )
}
