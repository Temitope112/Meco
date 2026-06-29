import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({
  to,
  subject,
  message,
}: {
  to: string;
  subject: string;
  message: string;
}) {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || "onboarding@resend.dev",
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
      console.log("RESEND EMAIL ERROR:", error);
      return { success: false, error };
    }

    console.log("RESEND EMAIL SENT:", data);
    return { success: true, data };
  } catch (error) {
    console.log("SEND EMAIL FAILED:", error);
    return { success: false, error };
  }
}