import Link from "next/link";
import Image from "next/image";
import {
  CalendarDays,
  ClipboardList,
  ShieldCheck,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const services = [
  {
    label: "ID Card Replacement",
    // New: Specific Student ID/Lanyard photo
    image:
      "https://images.unsplash.com/photo-1621252179027-94459d278660?auto=format&fit=crop&q=80&w=800",
    description: "Request a new student or staff identification card.",
  },
  {
    label: "Result Slip Printing",
    image:
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800",
    description: "Official printouts of your semester or final results.",
  },
  {
    label: "Transcript Request",
    // New: Top-down view of academic paperwork/forms
    image:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=800",
    description: "Detailed academic records for transfer or employment.",
  },
  {
    label: "Archive Retrieval",
    image:
      "https://images.unsplash.com/photo-1568667256549-094345857637?auto=format&fit=crop&q=80&w=800",
    description: "Access old records and historic student files.",
  },
  {
    label: "Certificate Collection",
    image:
      "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&q=80&w=800",
    description: "Schedule a time to pick up your original certificates.",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="container mx-auto grid min-h-[85vh] items-center gap-12 px-6 py-12 lg:grid-cols-2">
        <div className="flex flex-col items-start gap-6 text-left">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            <CheckCircle2 className="h-4 w-4" /> Official CIB Records Portal
          </div>
          <h1 className="text-balance text-5xl font-extrabold tracking-tight text-foreground lg:text-7xl">
            Manage Your <span className="text-primary">Academic</span> Records
          </h1>
          <p className="max-w-[500px] text-lg leading-relaxed text-muted-foreground">
            The official portal for CIB students and alumni to book appointments
            for transcripts, ID replacements, and document retrievals.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <Button
              asChild
              size="lg"
              className="px-8 py-6 text-lg shadow-lg shadow-primary/20"
            >
              <Link href="/book">Book an Appointment</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="px-8 py-6 text-lg"
            >
              <Link href="/auth/login">Staff Portal</Link>
            </Button>
          </div>
        </div>

        <div className="relative hidden aspect-square w-full lg:block">
          <div className="absolute -left-6 -top-6 h-full w-full rounded-[2rem] bg-primary/5" />
          <div className="relative h-full w-full overflow-hidden rounded-[2rem] shadow-2xl bg-muted">
            <Image
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1000"
              alt="CIB Administration Office"
              fill
              style={{ objectFit: "cover" }}
              priority
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-muted/30 py-24">
        <div className="container mx-auto px-6">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold md:text-4xl">How It Works</h2>
            <p className="mt-4 text-muted-foreground text-lg">
              Get your documents in three easy steps
            </p>
          </div>
          <div className="grid gap-12 md:grid-cols-3">
            {[
              {
                title: "Select Service",
                desc: "Choose the specific record or ID service you require.",
                icon: ClipboardList,
              },
              {
                title: "Choose Time",
                desc: "Pick a date and time that fits your schedule.",
                icon: Clock,
              },
              {
                title: "Receive Update",
                desc: "Get an email confirmation and status notifications.",
                icon: ShieldCheck,
              },
            ].map((step, i) => (
              <div
                key={i}
                className="group flex flex-col items-center text-center"
              >
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-background text-primary shadow-sm transition-all group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground">
                  <step.icon className="h-10 w-10" />
                </div>
                <h3 className="mb-3 text-xl font-bold">{step.title}</h3>
                <p className="max-w-[250px] leading-relaxed text-muted-foreground">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="container mx-auto px-6 py-24">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Available Services
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            Everything you need for your academic documentation
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <Card
              key={service.label}
              className="group overflow-hidden border-none bg-card shadow-md transition-all hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative h-56 w-full overflow-hidden bg-muted">
                <Image
                  src={service.image}
                  alt={service.label}
                  fill
                  style={{ objectFit: "cover" }}
                  className="transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-foreground">
                  {service.label}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {service.description}
                </p>
                <Button
                  variant="link"
                  className="mt-4 h-auto p-0 font-bold text-primary"
                  asChild
                >
                  <Link href="/book">Book Appointment →</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/20 py-12 text-center">
        <div className="container mx-auto px-6">
          <p className="font-medium text-lg">
            CIB Records & Appointment Portal
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            © {new Date().getFullYear()} All Rights Reserved. Professionalism &
            Integrity.
          </p>
        </div>
      </footer>
    </main>
  );
}
