import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const bookingData = await req.json();

    console.log("New booking:", bookingData);

    return NextResponse.json(
      {
        success: true,
        message: "Booking saved successfully!",
        booking: bookingData,
      },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to save booking.",
      },
      { status: 500 }
    );
  }
}