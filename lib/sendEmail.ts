import "server-only";

import { Resend } from "resend";

type SendEmailOptions = {
  to: string;
  subject: string;
  message: string;
};

export async function sendEmail({
  to,
  subject,
  message,
}: SendEmailOptions) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    throw new Error("RESEND_API_KEY is missing.");
  }

  const resend = new Resend(apiKey);

  const { data, error } = await resend.emails.send({
    from: process.env.EMAIL_FROM || "onboarding@resend.dev",
    to,
    subject,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.7;">
        <h2 style="color: #111;">MECO</h2>
        <p>${message.replace(/\n/g, "<br />")}</p>
        <p style="margin-top: 24px; color: #666;">
          Thank you for using MECO.
        </p>
      </div>
    `,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}