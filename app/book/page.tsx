import { BookingForm } from "@/components/booking-form"

export const metadata = {
  title: "Book Appointment - CIB Portal",
  description: "Schedule your appointment for records and administrative services",
}

export default function BookPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <BookingForm />
    </main>
  )
}
