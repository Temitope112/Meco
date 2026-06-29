import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET() {
  try {
    const { data, error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "temitopeeniola295@gmail.com",
      subject: "MECO Test Email",
      html: "<p>This is a test email from MECO.</p>",
    });

    if (error) {
      console.log("RESEND TEST ERROR:", error);
      return NextResponse.json({ error }, { status: 500 });
    }

    console.log("RESEND TEST SUCCESS:", data);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.log("TEST EMAIL CATCH ERROR:", error);
    return NextResponse.json({ error }, { status: 500 });
  }
}