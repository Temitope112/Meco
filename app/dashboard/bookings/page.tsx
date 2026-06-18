"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { CalendarDays, Clock } from "lucide-react";

type Booking = {
  id: number;
  service_title: string;
  total: number;
  booking_date: string;
  booking_time: string;
  payment_status: string;
  status: string;
};

export default function DashboardBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .eq("customer_email", user.email)
        .order("created_at", { ascending: false });

      if (error) {
        console.log(error);
        return;
      }

      setBookings(data || []);
      setLoading(false);
    };

    fetchBookings();
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">My Bookings</h1>

        <p className="mt-2 text-white/60">
          View all your service bookings.
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
          {bookings.map((booking) => (
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
                </div>

                <div className="flex flex-col gap-3 lg:items-end">
                  <p className="text-xl font-bold text-yellow-400">
                    ₦{booking.total.toLocaleString()}
                  </p>

                  <div className="flex gap-3">
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
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}