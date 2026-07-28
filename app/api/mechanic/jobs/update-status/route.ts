import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import {
  sendJobAcceptedEmail,
  sendJobCompletedEmail,
} from "@/lib/emailNotifications";

type AllowedStatus = "accepted" | "completed";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const bookingId = Number(body.bookingId);
    const status = body.status as AllowedStatus;
    const mechanicEmail = String(body.mechanicEmail || "")
      .trim()
      .toLowerCase();

    if (!bookingId || !mechanicEmail) {
      return NextResponse.json(
        { message: "Booking ID and mechanic email are required." },
        { status: 400 }
      );
    }

    if (status !== "accepted" && status !== "completed") {
      return NextResponse.json(
        { message: "Invalid job status." },
        { status: 400 }
      );
    }

    const { data: mechanic, error: mechanicError } = await supabaseAdmin
      .from("mechanics")
      .select("id, email, is_approved, status")
      .eq("email", mechanicEmail)
      .single();

    if (mechanicError || !mechanic) {
      return NextResponse.json(
        { message: "Mechanic account not found." },
        { status: 404 }
      );
    }

    if (!mechanic.is_approved) {
      return NextResponse.json(
        { message: "Mechanic account is not approved." },
        { status: 403 }
      );
    }

    const { data: booking, error: bookingError } = await supabaseAdmin
      .from("bookings")
      .select("*")
      .eq("id", bookingId)
      .eq("assigned_mechanic_id", mechanic.id)
      .single();

    if (bookingError || !booking) {
      return NextResponse.json(
        { message: "Assigned booking not found." },
        { status: 404 }
      );
    }

    if (booking.status === "completed") {
      return NextResponse.json(
        { message: "This job has already been completed." },
        { status: 409 }
      );
    }

    if (status === "completed" && booking.status !== "accepted") {
      return NextResponse.json(
        { message: "Accept the job before marking it completed." },
        { status: 400 }
      );
    }

    const { data: updatedBooking, error: updateError } = await supabaseAdmin
      .from("bookings")
      .update({ status })
      .eq("id", bookingId)
      .eq("assigned_mechanic_id", mechanic.id)
      .select("*")
      .single();

    if (updateError || !updatedBooking) {
      return NextResponse.json(
        {
          message:
            updateError?.message || "Unable to update the booking status.",
        },
        { status: 400 }
      );
    }

let emailSent = false;

try {
  if (status === "accepted") {
    await sendJobAcceptedEmail(updatedBooking);
  } else {
    await sendJobCompletedEmail(updatedBooking);
  }

 emailSent = true;
} catch (emailError) {
  console.error("Job status email failed:", emailError);
}

return NextResponse.json({
  success: true,
  booking: updatedBooking,
  emailSent,
});
  } catch (error) {
    console.error("Update job status error:", error);

    return NextResponse.json(
      { message: "Something went wrong while updating the job." },
      { status: 500 }
    );
  }
}