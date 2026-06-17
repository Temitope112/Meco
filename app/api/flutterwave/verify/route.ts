import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const { transactionId, txRef } = await request.json();

    if (!transactionId || !txRef) {
      return NextResponse.json(
        { message: "Transaction ID and tx_ref are required" },
        { status: 400 }
      );
    }

    const secretKey = process.env.FLW_SECRET_KEY;

    if (!secretKey) {
      return NextResponse.json(
        { message: "Flutterwave secret key is missing" },
        { status: 500 }
      );
    }

    const bookingId = txRef.split("-")[1];

    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .select("*")
      .eq("id", bookingId)
      .single();

    if (bookingError || !booking) {
      return NextResponse.json(
        { message: "Booking not found" },
        { status: 404 }
      );
    }

    const response = await fetch(
      `https://api.flutterwave.com/v3/transactions/${transactionId}/verify`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${secretKey}`,
        },
      }
    );

    const result = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: result.message || "Payment verification failed" },
        { status: 400 }
      );
    }

    const payment = result.data;

    const isSuccessful =
      payment.status === "successful" &&
      payment.tx_ref === txRef &&
      payment.currency === "NGN" &&
      Number(payment.amount) >= Number(booking.total);

    if (!isSuccessful) {
      return NextResponse.json(
        { message: "Payment was not successful" },
        { status: 400 }
      );
    }

    const { error: updateError } = await supabase
      .from("bookings")
      .update({
        payment_status: "paid",
        payment_reference: txRef,
        payment_channel: payment.payment_type || "flutterwave",
        paid_at: new Date().toISOString(),
        status: "confirmed",
      })
      .eq("id", bookingId);

    if (updateError) {
      return NextResponse.json(
        { message: updateError.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      message: "Payment verified successfully",
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}