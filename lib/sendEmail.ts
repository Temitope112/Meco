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
    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    const res = await fetch(`${baseUrl}/api/send-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ to, subject, message }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.log("Email API error:", data);
    }

    return data;
  } catch (error) {
    console.log("Email failed:", error);
  }
}