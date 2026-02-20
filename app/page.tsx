import Link from "next/link"
import { CalendarDays, ClipboardList, ShieldCheck, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const services = [
  { label: "ID Card Replacement", icon: ClipboardList },
  { label: "Result Slip Printing", icon: ClipboardList },
  { label: "Transcript Request", icon: ClipboardList },
  { label: "Archive File Retrieval", icon: ClipboardList },
  { label: "Certificate Collection", icon: ClipboardList },
]

export default function HomePage() {
  return (
    <main>
      {/* Hero */}
      <section className="flex flex-col items-center gap-6 px-4 pb-16 pt-20 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary">
          <CalendarDays className="h-8 w-8 text-primary-foreground" />
        </div>
        <h1 className="max-w-2xl text-balance text-4xl font-bold tracking-tight text-foreground md:text-5xl">
          CIB Records & Appointment Portal
        </h1>
        <p className="max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
          Schedule your appointments for records and administrative services.
          Fast, secure, and convenient online booking.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Button asChild size="lg">
            <Link href="/book">Book an Appointment</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/auth/login">Admin Login</Link>
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-5xl px-4 pb-20">
        <h2 className="mb-2 text-center text-2xl font-semibold text-foreground">
          How It Works
        </h2>
        <p className="mb-10 text-center text-muted-foreground">
          Three simple steps to book your appointment
        </p>
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="border-border bg-card">
            <CardContent className="flex flex-col items-center gap-3 pt-6 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <CalendarDays className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-card-foreground">Choose a Service</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Select from our available services including ID replacement,
                transcripts, and more.
              </p>
            </CardContent>
          </Card>
          <Card className="border-border bg-card">
            <CardContent className="flex flex-col items-center gap-3 pt-6 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-card-foreground">Pick Date & Time</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Select your preferred date and time slot for your appointment.
              </p>
            </CardContent>
          </Card>
          <Card className="border-border bg-card">
            <CardContent className="flex flex-col items-center gap-3 pt-6 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <ShieldCheck className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-card-foreground">Get Confirmation</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Receive instant confirmation and await admin approval for your booking.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Services */}
      <section className="mx-auto max-w-5xl px-4 pb-20">
        <h2 className="mb-2 text-center text-2xl font-semibold text-foreground">
          Available Services
        </h2>
        <p className="mb-10 text-center text-muted-foreground">
          We offer the following records and administrative services
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <Card key={service.label} className="border-border bg-card">
              <CardContent className="flex items-center gap-3 py-4">
                <service.icon className="h-5 w-5 shrink-0 text-primary" />
                <span className="text-sm font-medium text-card-foreground">{service.label}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        <p>CIB Records & Appointment Portal. All rights reserved.</p>
      </footer>
    </main>
  )
}
