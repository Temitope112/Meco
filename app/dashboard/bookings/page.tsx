"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { CalendarDays, Clock, Trash2, CreditCard } from "lucide-react";

type Booking = {
  id: number;
  service_title: string;
  total: number;
  booking_date: string;
  booking_time: string;
  payment_status: string;
  status: string;
  customer_email: string;
  customer_name: string;
};

export default function DashboardBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);

  const fetchBookings = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .eq("customer_email", user.email)
      .order("created_at", { ascending: false });

    if (error) {
      console.log(error);
      setLoading(false);
      return;
    }

    setBookings(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const payPendingBooking = async (booking: Booking) => {
    try {
      setProcessingId(booking.id);

      const res = await fetch("/api/flutterwave/initialize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: booking.customer_email,
          amount: booking.total,
          bookingId: booking.id,
          customerName: booking.customer_name,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Unable to restart payment.");
        return;
      }

      window.location.href = data.paymentLink;
    } catch (error) {
      console.log(error);
      alert("Unable to restart payment. Please try again.");
    } finally {
      setProcessingId(null);
    }
  };

  const deletePendingBooking = async (id: number) => {
    const confirmDelete = confirm("Delete this unpaid booking?");

    if (!confirmDelete) return;

    const { error } = await supabase
      .from("bookings")
      .delete()
      .eq("id", id)
      .eq("payment_status", "unpaid");

    if (error) {
      alert(error.message);
      return;
    }

    setBookings((prev) => prev.filter((booking) => booking.id !== id));
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">My Bookings</h1>

        <p className="mt-2 text-white/60">
          View your bookings, complete unpaid payments, or remove pending
          bookings.
        </p>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          Loading bookings...
        </div>
      ) : bookings.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          No bookings found.
        </div>
      ) : (
        <div className="space-y-5">
          {bookings.map((booking) => {
            const isUnpaid = booking.payment_status === "unpaid";

            return (
              <div
                key={booking.id}
                className="rounded-2xl border border-white/10 bg-white/5 p-6"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <h2 className="text-xl font-semibold">
                      {booking.service_title}
                    </h2>

                    <div className="mt-3 flex flex-wrap gap-5 text-sm text-white/60">
                      <div className="flex items-center gap-2">
                        <CalendarDays size={16} />
                        {booking.booking_date}
                      </div>

                      <div className="flex items-center gap-2">
                        <Clock size={16} />
                        {booking.booking_time}
                      </div>
                    </div>

                    {isUnpaid && (
                      <p className="mt-4 text-sm text-yellow-400">
                        This booking is pending payment. You can complete the
                        payment or delete it.
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-3 lg:items-end">
                    <p className="text-xl font-bold text-yellow-400">
                      ₦{booking.total.toLocaleString()}
                    </p>

                    <div className="flex flex-wrap gap-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          booking.payment_status === "paid"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-yellow-500/20 text-yellow-400"
                        }`}
                      >
                        Payment: {booking.payment_status}
                      </span>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          booking.status === "completed"
                            ? "bg-green-500/20 text-green-400"
                            : booking.status === "confirmed"
                            ? "bg-blue-500/20 text-blue-400"
                            : "bg-yellow-500/20 text-yellow-400"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </div>

                    {isUnpaid && (
                      <div className="flex flex-wrap gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => payPendingBooking(booking)}
                          disabled={processingId === booking.id}
                          className="flex items-center gap-2 rounded-lg bg-yellow-400 px-4 py-2 text-sm font-bold text-black transition hover:bg-yellow-300 disabled:opacity-60"
                        >
                          <CreditCard size={16} />
                          {processingId === booking.id
                            ? "Processing..."
                            : "Pay Now"}
                        </button>

                        <button
                          type="button"
                          onClick={() => deletePendingBooking(booking.id)}
                          className="flex items-center gap-2 rounded-lg border border-red-500/30 px-4 py-2 text-sm font-bold text-red-400 transition hover:bg-red-500/10"
                        >
                          <Trash2 size={16} />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}