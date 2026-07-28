import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import {
  sendMechanicAssignedEmail,
  sendNewJobEmail,
} from "@/lib/emailNotifications";

export async function POST(request: Request) {
  try {
    const { bookingId, mechanicId } = await request.json();

    if (!bookingId || !mechanicId) {
      return NextResponse.json(
        { message: "Booking ID and Mechanic ID are required." },
        { status: 400 }
      );
    }

    const { data: booking, error: bookingError } = await supabaseAdmin
      .from("bookings")
      .select("*")
      .eq("id", bookingId)
      .single();

    if (bookingError || !booking) {
      return NextResponse.json(
        { message: "Booking not found." },
        { status: 404 }
      );
    }

    const { data: mechanic, error: mechanicError } = await supabaseAdmin
      .from("mechanics")
      .select("*")
      .eq("id", mechanicId)
      .single();

    if (mechanicError || !mechanic) {
      return NextResponse.json(
        { message: "Mechanic not found." },
        { status: 404 }
      );
    }

    const { data: updatedBooking, error: updateError } = await supabaseAdmin
      .from("bookings")
      .update({
        assigned_mechanic_id: mechanic.id,
        assigned_mechanic_name: mechanic.full_name,
      })
      .eq("id", booking.id)
      .select("*")
      .single();

    if (updateError || !updatedBooking) {
      return NextResponse.json(
        { message: updateError?.message ?? "Unable to assign mechanic." },
        { status: 400 }
      );
    }

    let customerEmailSent = false;
    let mechanicEmailSent = false;

    try {
      await sendMechanicAssignedEmail(updatedBooking, mechanic);
      customerEmailSent = true;
    } catch (err) {
      console.error("Customer email failed:", err);
    }

    try {
      await sendNewJobEmail(updatedBooking, mechanic);
      mechanicEmailSent = true;
    } catch (err) {
      console.error("Mechanic email failed:", err);
    }

    return NextResponse.json({
      success: true,
      booking: updatedBooking,
      customerEmailSent,
      mechanicEmailSent,
    });
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );
  }
}