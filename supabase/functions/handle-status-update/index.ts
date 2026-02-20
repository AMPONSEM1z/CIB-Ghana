import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import nodemailer from "npm:nodemailer"

serve(async (req) => {
  try {
    const payload = await req.json();
    const { record, old_record } = payload; // Supabase Webhook data structure

    // Only send email if the status actually changed
    if (record.status === old_record?.status) {
      return new Response("No status change", { status: 200 });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: Deno.env.get("GMAIL_USER"),
        pass: Deno.env.get("GMAIL_PASS"),
      },
    });

    // Dynamic content based on status
    const statusThemes: any = {
      Approved: { color: "#3b82f6", icon: "✅", message: "Your appointment has been officially approved." },
      Completed: { color: "#10b981", icon: "🎉", message: "Your service is complete. Thank you for choosing CIB!" },
      Cancelled: { color: "#ef4444", icon: "❌", message: "Your appointment has been cancelled." },
    };

    const theme = statusThemes[record.status] || { color: "#6b7280", icon: "ℹ️", message: `Status update: ${record.status}` };

    const emailHtml = `
      <div style="background-color: #f4f4f5; padding: 30px 10px; font-family: sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden;">
          <div style="background-color: ${theme.color}; padding: 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 20px;">Appointment ${record.status}</h1>
          </div>
          <div style="padding: 30px; text-align: center;">
            <div style="font-size: 50px; margin-bottom: 10px;">${theme.icon}</div>
            <p style="font-size: 18px; color: #1f2937;">Hello <b>${record.full_name}</b>,</p>
            <p style="color: #4b5563; line-height: 1.6;">${theme.message}</p>
            
            <div style="margin-top: 25px; padding: 15px; border-top: 1px solid #e5e7eb; text-align: left;">
              <p style="margin: 5px 0; font-size: 14px;"><b>Service:</b> ${record.service_type}</p>
              <p style="margin: 5px 0; font-size: 14px;"><b>Date:</b> ${record.appointment_date}</p>
            </div>
          </div>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: `"CIB Updates" <${Deno.env.get("GMAIL_USER")}>`,
      to: record.email,
      subject: `Update: Appointment ${record.status}`,
      html: emailHtml,
    });

    return new Response(JSON.stringify({ sent: true }), { status: 200 });
  } catch (error) {
    return new Response(error.message, { status: 500 });
  }
})