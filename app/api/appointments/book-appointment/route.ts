export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const supabase = await createServerClient();

    const { data, error } = await supabase
      .from("appointments")
      .insert([{ ...body, status: "Pending" }])
      .select()
      .single();

    if (error) {
      console.error(error);
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    // --- Email Templates ---
    const brandColor = "#2563eb"; // A clean professional blue

    const userHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; color: #374151;">
        <h2 style="color: ${brandColor}; border-bottom: 2px solid ${brandColor}; padding-bottom: 10px;">Appointment Confirmed</h2>
        <p>Hello <strong>${body.full_name}</strong>,</p>
        <p>Thank you for choosing CIB. Your appointment has been successfully scheduled. Here are your details:</p>
        <div style="background-color: #f9fafb; padding: 15px; border-radius: 6px; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>Service:</strong> ${body.service_type}</p>
          <p style="margin: 5px 0;"><strong>Date:</strong> ${body.appointment_date}</p>
          <p style="margin: 5px 0;"><strong>Time:</strong> ${body.appointment_time}</p>
        </div>
        <p>If you need to reschedule or have any questions, please contact our support team.</p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
        <p style="font-size: 12px; color: #6b7280;">This is an automated message from CIB Booking System.</p>
      </div>
    `;

    const adminHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #e5e7eb; padding: 20px;">
        <h2 style="color: #111827;">New Booking Notification</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr style="border-bottom: 1px solid #f3f4f6;"><td style="padding: 10px; font-weight: bold;">Client:</td><td>${body.full_name}</td></tr>
          <tr style="border-bottom: 1px solid #f3f4f6;"><td style="padding: 10px; font-weight: bold;">Email:</td><td>${body.email}</td></tr>
          <tr style="border-bottom: 1px solid #f3f4f6;"><td style="padding: 10px; font-weight: bold;">Service:</td><td>${body.service_type}</td></tr>
          <tr style="border-bottom: 1px solid #f3f4f6;"><td style="padding: 10px; font-weight: bold;">Schedule:</td><td>${body.appointment_date} at ${body.appointment_time}</td></tr>
        </table>
        <div style="margin-top: 20px;">
          <a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin/appointments" style="background-color: ${brandColor}; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View in Dashboard</a>
        </div>
      </div>
    `;

    // Send both simultaneously
    await Promise.all([
      transporter.sendMail({
        from: `"CIB Booking" <${process.env.GMAIL_USER}>`,
        to: body.email,
        subject: "Confirmation: Your CIB Appointment",
        html: userHtml,
      }),
      transporter.sendMail({
        from: `"System Alert" <${process.env.GMAIL_USER}>`,
        to: process.env.GMAIL_USER,
        subject: `🚨 New Booking: ${body.full_name}`,
        html: adminHtml,
      })
    ]);

    return NextResponse.json({ success: true, appointment: data });

  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}