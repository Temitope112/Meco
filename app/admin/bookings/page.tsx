"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Booking = {
  id: number;
  service_title: string;
  service_price: number;
  customer_name: string;
  customer_email: string;
  vehicle_year: string;
  vehicle_model: string;
  booking_date: string;
  booking_time: string;
  total: number;
  payment_status: string;
  status: string;
  created_at: string;
};

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    setBookings(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <div>
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Bookings</h1>
          <p className="mt-2 text-white/60">
            View and manage customer bookings.
          </p>
        </div>

        <button
          onClick={fetchBookings}
          className="rounded-lg bg-yellow-400 px-4 py-2 text-sm font-bold text-black"
        >
          Refresh
        </button>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        {loading ? (
          <p className="text-white/50">Loading bookings...</p>
        ) : bookings.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-white/50">
                <tr>
                  <th className="py-3">Customer</th>
                  <th>Email</th>
                  <th>Service</th>
                  <th>Vehicle</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Total</th>
                  <th>Payment</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.id} className="border-t border-white/10">
                    <td className="py-4">{booking.customer_name}</td>
                    <td className="text-white/60">{booking.customer_email}</td>
                    <td>{booking.service_title}</td>
                    <td className="text-white/60">
                      {booking.vehicle_year} {booking.vehicle_model}
                    </td>
                    <td className="text-white/60">{booking.booking_date}</td>
                    <td className="text-white/60">{booking.booking_time}</td>
                    <td className="font-bold text-yellow-400">
                      ₦{booking.total?.toLocaleString()}
                    </td>

                    <td>
                      <span
                        className={`rounded-md px-3 py-1 text-xs ${
                          booking.payment_status === "paid"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-yellow-400/20 text-yellow-400"
                        }`}
                      >
                        {booking.payment_status || "unpaid"}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`rounded-md px-3 py-1 text-xs ${
                          booking.status === "confirmed"
                            ? "bg-blue-500/20 text-blue-400"
                            : booking.status === "completed"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-yellow-400/20 text-yellow-400"
                        }`}
                      >
                        {booking.status || "pending"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-white/50">No bookings yet.</p>
        )}
      </div>
    </div>
  );
}