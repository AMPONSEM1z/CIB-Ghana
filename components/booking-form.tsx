"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CalendarDays, Loader2 } from "lucide-react";

const serviceTypes = [
  "ID Card Replacement",
  "Result Slip Printing",
  "Transcript Request",
  "Archive File Retrieval",
  "Certificate Collection",
] as const;

const bookingSchema = z.object({
  full_name: z.string().min(2, "Full name is required"),
  member_id: z.string().min(1, "Member ID is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(7, "Valid phone number is required"),
  service_type: z.enum(serviceTypes, {
    required_error: "Please select a service",
  }),
  appointment_date: z.string().min(1, "Please select a date"),
  appointment_time: z.string().min(1, "Please select a time"),
  notes: z.string().optional(),
});

type BookingFormData = z.infer<typeof bookingSchema>;

export function BookingForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
  });

  const onSubmit = async (data: BookingFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const supabase = createClient();
      const { error: insertError } = await supabase
        .from("appointments")
        .insert({
          full_name: data.full_name,
          member_id: data.member_id,
          email: data.email,
          phone: data.phone,
          service_type: data.service_type,
          appointment_date: data.appointment_date,
          appointment_time: data.appointment_time,
          notes: data.notes || null,
          status: "Pending",
        });

      if (insertError) {
        throw new Error(insertError.message);
      }

      router.push("/book/success");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Compute minimum date (tomorrow)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  return (
    <Card className="mx-auto w-full max-w-2xl border-border bg-card">
      <CardHeader className="text-center">
        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
          <CalendarDays className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-2xl text-card-foreground">
          Book an Appointment
        </CardTitle>
        <CardDescription>
          Fill in your details below to schedule your appointment
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          {error && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="grid gap-5 md:grid-cols-2">
            {/* Full Name */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                placeholder="John Doe"
                {...register("full_name")}
                aria-invalid={!!errors.full_name}
              />
              {errors.full_name && (
                <p className="text-xs text-destructive">
                  {errors.full_name.message}
                </p>
              )}
            </div>

            {/* Member ID */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="member_id">Member ID</Label>
              <Input
                id="member_id"
                placeholder="e.g. CIB-12345"
                {...register("member_id")}
                aria-invalid={!!errors.member_id}
              />
              {errors.member_id && (
                <p className="text-xs text-destructive">
                  {errors.member_id.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                {...register("email")}
                aria-invalid={!!errors.email}
              />
              {errors.email && (
                <p className="text-xs text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1 (555) 000-0000"
                {...register("phone")}
                aria-invalid={!!errors.phone}
              />
              {errors.phone && (
                <p className="text-xs text-destructive">
                  {errors.phone.message}
                </p>
              )}
            </div>
          </div>

          {/* Service Type */}
          <div className="flex flex-col gap-1.5">
            <Label>Service Type</Label>
            <Select
              onValueChange={(value) =>
                setValue(
                  "service_type",
                  value as BookingFormData["service_type"],
                )
              }
            >
              <SelectTrigger aria-invalid={!!errors.service_type}>
                <SelectValue placeholder="Select a service" />
              </SelectTrigger>
              <SelectContent>
                {serviceTypes.map((service) => (
                  <SelectItem key={service} value={service}>
                    {service}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.service_type && (
              <p className="text-xs text-destructive">
                {errors.service_type.message}
              </p>
            )}
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {/* Date */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="appointment_date">Preferred Date</Label>
              <Input
                id="appointment_date"
                type="date"
                min={minDate}
                {...register("appointment_date")}
                aria-invalid={!!errors.appointment_date}
              />
              {errors.appointment_date && (
                <p className="text-xs text-destructive">
                  {errors.appointment_date.message}
                </p>
              )}
            </div>

            {/* Time */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="appointment_time">Preferred Time</Label>
              <Input
                id="appointment_time"
                type="time"
                {...register("appointment_time")}
                aria-invalid={!!errors.appointment_time}
              />
              {errors.appointment_time && (
                <p className="text-xs text-destructive">
                  {errors.appointment_time.message}
                </p>
              )}
            </div>
          </div>

          {/* Notes */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="notes">Additional Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Any special requests or information..."
              rows={3}
              {...register("notes")}
            />
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Booking"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
