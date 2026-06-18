"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  Calendar,
  CreditCard,
  Clock,
  Wallet,
} from "lucide-react";

type Booking = {
  id: number;
  service_title: string;
  total: number;
  payment_status: string;
  booking_date: string;
};

export default function DashboardPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data } = await supabase
        .from("bookings")
        .select("*")
        .eq("customer_email", user.email)
        .order("created_at", { ascending: false });

      setBookings(data || []);
      setLoading(false);
    };

    fetchBookings();
  }, []);

  const totalBookings = bookings.length;

  const paidBookings = bookings.filter(
    (booking) => booking.payment_status === "paid"
  ).length;

  const pendingBookings = bookings.filter(
    (booking) => booking.payment_status !== "paid"
  ).length;

  const totalSpent = bookings
    .filter((booking) => booking.payment_status === "paid")
    .reduce((sum, booking) => sum + booking.total, 0);

  return (
    <div>
      <div className="mb-10">
        <h1 className="text-3xl font-bold">
          Welcome Back 👋
        </h1>

        <p className="mt-2 text-white/60">
          Manage your bookings and services.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Bookings"
          value={totalBookings}
          icon={<Calendar size={20} />}
        />

        <StatCard
          title="Paid Bookings"
          value={paidBookings}
          icon={<CreditCard size={20} />}
        />

        <StatCard
          title="Pending"
          value={pendingBookings}
          icon={<Clock size={20} />}
        />

        <StatCard
          title="Total Spent"
          value={`₦${totalSpent.toLocaleString()}`}
          icon={<Wallet size={20} />}
        />
      </div>

      <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="mb-5 text-xl font-bold">
          Recent Bookings
        </h2>

        {loading ? (
          <p className="text-white/60">
            Loading bookings...
          </p>
        ) : bookings.length === 0 ? (
          <p className="text-white/60">
            No bookings yet.
          </p>
        ) : (
          <div className="space-y-4">
            {bookings.slice(0, 5).map((booking) => (
              <div
                key={booking.id}
                className="flex items-center justify-between rounded-xl border border-white/10 bg-black/30 p-4"
              >
                <div>
                  <h3 className="font-semibold">
                    {booking.service_title}
                  </h3>

                  <p className="text-sm text-white/50">
                    {booking.booking_date}
                  </p>
                </div>

                <div
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    booking.payment_status === "paid"
                      ? "bg-green-500/20 text-green-400"
                      : "bg-yellow-500/20 text-yellow-400"
                  }`}
                >
                  {booking.payment_status}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="mb-3 text-yellow-400">
        {icon}
      </div>

      <h3 className="text-sm text-white/60">
        {title}
      </h3>

      <p className="mt-2 text-2xl font-bold">
        {value}
      </p>
    </div>
  );
}