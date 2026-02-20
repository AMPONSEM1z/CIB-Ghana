import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import nodemailer from "npm:nodemailer"

serve(async (req) => {
  try {
    if (req.method !== 'POST') {
      return new Response("Method Not Allowed", { status: 405 });
    }

    const body = await req.json();
    const brandColor = "#0f172a"; // Elegant Navy
    const accentColor = "#3b82f6"; // Professional Blue

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: Deno.env.get("GMAIL_USER"),
        pass: Deno.env.get("GMAIL_PASS"), 
      },
    });

    // 1. DESIGNED CUSTOMER EMAIL TEMPLATE
    const userHtml = `
      <div style="background-color: #f4f4f5; padding: 30px 10px; font-family: sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
          <div style="background-color: ${brandColor}; padding: 25px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 22px; letter-spacing: 1px;">CIB SERVICES</h1>
          </div>
          <div style="padding: 30px;">
            <div style="text-align: center; margin-bottom: 20px;">
               <span style="background-color: #dcfce7; color: #166534; padding: 5px 15px; border-radius: 50px; font-size: 13px; font-weight: bold;">Confirmed</span>
            </div>
            <p style="font-size: 16px; color: #333;">Hello <b>${body.full_name}</b>,</p>
            <p style="font-size: 15px; color: #555;">Your booking for <b>${body.service_type}</b> has been successfully received.</p>
            
            <div style="margin: 25px 0; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; background-color: #fafafa;">
              <table style="width: 100%;">
                <tr>
                  <td style="color: #71717a; font-size: 14px; padding: 5px 0;">Date</td>
                  <td style="text-align: right; font-weight: bold; font-size: 14px;">${body.appointment_date}</td>
                </tr>
                <tr>
                  <td style="color: #71717a; font-size: 14px; padding: 5px 0;">Time</td>
                  <td style="text-align: right; font-weight: bold; font-size: 14px;">${body.appointment_time}</td>
                </tr>
              </table>
            </div>
            <p style="font-size: 13px; color: #999; text-align: center;">If you need to reschedule, please contact our support team.</p>
          </div>
        </div>
      </div>
    `;

    // 2. DESIGNED ADMIN EMAIL TEMPLATE
    const adminHtml = `
      <div style="font-family: sans-serif; padding: 20px;">
        <div style="border-left: 4px solid ${accentColor}; padding-left: 15px;">
          <h2 style="margin: 0; font-size: 18px;">New Booking Alert</h2>
          <p style="color: #666; font-size: 14px;">A new appointment has been scheduled via the portal.</p>
        </div>
        <div style="margin-top: 20px; background: #f8fafc; padding: 15px; border-radius: 5px;">
          <p><b>Client:</b> ${body.full_name}</p>
          <p><b>Service:</b> ${body.service_type}</p>
          <p><b>Schedule:</b> ${body.appointment_date} @ ${body.appointment_time}</p>
          <p><b>Contact:</b> ${body.email}</p>
        </div>
      </div>
    `;

    // 3. Send Emails
    await Promise.all([
      transporter.sendMail({
        from: `"CIB Booking" <${Deno.env.get("GMAIL_USER")}>`,
        to: body.email,
        subject: "Appointment Confirmed - CIB Services",
        html: userHtml,
      }),
      transporter.sendMail({
        from: `"System Alert" <${Deno.env.get("GMAIL_USER")}>`,
        to: Deno.env.get("GMAIL_USER"),
        subject: `🚨 New Booking: ${body.full_name}`,
        html: adminHtml,
      })
    ]);

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error("FUNCTION ERROR:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
})




