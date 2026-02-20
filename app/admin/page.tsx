import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AdminDashboardClient } from "./admin-dashboard-client"

export const metadata = {
  title: "Admin Dashboard - CIB Portal",
  description: "Manage appointments and bookings",
}

export default async function AdminDashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  return <AdminDashboardClient userEmail={user.email || ""} />
}
