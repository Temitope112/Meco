import { NextResponse } from "next/server";
import { sendWelcomeEmail } from "@/lib/emailNotifications";

export async function POST(request: Request) {
  try {
    const { email, name } = await request.json();

    if (!email || !name) {
      return NextResponse.json(
        { message: "Email and name are required." },
        { status: 400 }
      );
    }

    await sendWelcomeEmail(email, name);

    return NextResponse.json({
      success: true,
      message: "Welcome email sent.",
    });
  } catch (error) {
    console.error("Welcome email error:", error);

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Unable to send welcome email.",
      },
      { status: 500 }
    );
  }
}