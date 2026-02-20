import Link from "next/link"
import { CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export const metadata = {
  title: "Booking Confirmed - CIB Portal",
  description: "Your appointment has been successfully booked",
}

export default function BookingSuccessPage() {
  return (
    <main className="flex min-h-[60vh] items-center justify-center px-4 py-12">
      <Card className="mx-auto w-full max-w-md border-border bg-card text-center">
        <CardContent className="flex flex-col items-center gap-4 pt-8 pb-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <CheckCircle2 className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-card-foreground">Booking Confirmed</h1>
          <p className="text-muted-foreground leading-relaxed">
            Your appointment request has been submitted successfully.
            You will receive a confirmation once your booking is approved by the admin.
          </p>
          <div className="flex gap-3 pt-4">
            <Button asChild>
              <Link href="/">Back to Home</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/book">Book Another</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
