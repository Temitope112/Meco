import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { to, subject, message } = await request.json();

    if (!to || !subject || !message) {
      return NextResponse.json(
        { message: "Missing email fields" },
        { status: 400 }
      );
    }
   console.log("Sending email to:", to);
console.log("EMAIL_FROM:", process.env.EMAIL_FROM);
console.log("HAS_RESEND_KEY:", !!process.env.RESEND_API_KEY);
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || "MECO <onboarding@resend.dev>",
      to,
      subject,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.7;">
          <h2 style="color:#111;">MECO</h2>
          <p>${message.replace(/\n/g, "<br />")}</p>
          <br />
          <p style="color:#666;">Thank you for using MECO.</p>
        </div>
      `,
    });

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Unable to send email" },
      { status: 500 }
    );
  }
}