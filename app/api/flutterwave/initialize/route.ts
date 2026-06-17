import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email, amount, bookingId, customerName } = await request.json();

    const secretKey = process.env.FLW_SECRET_KEY;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

    if (!secretKey || !siteUrl) {
      return NextResponse.json(
        { message: "Flutterwave environment variables missing" },
        { status: 500 }
      );
    }

    const txRef = `MECO-${bookingId}-${Date.now()}`;

    const response = await fetch("https://api.flutterwave.com/v3/payments", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tx_ref: txRef,
        amount,
        currency: "NGN",
        redirect_url: `${siteUrl}/payment/callback`,
        customer: {
          email,
          name: customerName,
        },
        customizations: {
          title: "MECO Booking Payment",
          description: "Payment for car service booking",
        },
        meta: {
          bookingId,
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || "Unable to initialize payment" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      paymentLink: data.data.link,
      txRef,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}