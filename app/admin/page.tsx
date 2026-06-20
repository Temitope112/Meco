"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  Bell,
  Calendar,
  Car,
  CreditCard,
  LogOut,
  Search,
  Settings,
  Users,
  Wrench,
} from "lucide-react";

type Booking = {
  id: number;
  customer_name: string;
  customer_email: string;
  service_title: string;
  booking_date: string;
  status: string | null;
  payment_status: string | null;
  total: number;
};

export default function AdminDashboardPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);

  const [stats, setStats] = useState({
    totalServices: 0,
    activeBookings: 0,
    completedServices: 0,
    customers: 0,
    revenue: 0,
    pendingPayments: 0,
  });

  const fetchDashboardData = async () => {
    setLoading(true);

    const { count: totalServices } = await supabase
      .from("services")
      .select("*", { count: "exact", head: true });

    const { data: bookingsData, error: bookingsError } = await supabase
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false });

    if (bookingsError) {
      alert(bookingsError.message);
      setLoading(false);
      return;
    }

    const bookings = bookingsData || [];

    const activeBookings = bookings.filter((booking) => {
      const status = booking.status?.toLowerCase();
      const payment = booking.payment_status?.toLowerCase();

      return status === "pending" || payment === "unpaid";
    }).length;

    const completedServices = bookings.filter((booking) => {
      const status = booking.status?.toLowerCase();
      const payment = booking.payment_status?.toLowerCase();

      return status === "confirmed" || status === "completed" || payment === "paid";
    }).length;

    const pendingPayments = bookings.filter((booking) => {
      const payment = booking.payment_status?.toLowerCase();
      return payment !== "paid";
    }).length;

    const revenue = bookings
      .filter((booking) => booking.payment_status?.toLowerCase() === "paid")
      .reduce((sum, booking) => sum + Number(booking.total || 0), 0);

    const uniqueCustomers = new Set(
      bookings.map((booking) => booking.customer_email).filter(Boolean)
    ).size;

    setStats({
      totalServices: totalServices || 0,
      activeBookings,
      completedServices,
      customers: uniqueCustomers,
      revenue,
      pendingPayments,
    });

    setRecentBookings(bookings.slice(0, 10));
    setLoading(false);
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const filteredBookings = useMemo(() => {
    const search = searchTerm.toLowerCase().trim();

    if (!search) return recentBookings;

    return recentBookings.filter((booking) => {
      return (
        booking.customer_name?.toLowerCase().includes(search) ||
        booking.customer_email?.toLowerCase().includes(search) ||
        booking.service_title?.toLowerCase().includes(search) ||
        booking.booking_date?.toLowerCase().includes(search) ||
        booking.status?.toLowerCase().includes(search) ||
        booking.payment_status?.toLowerCase().includes(search) ||
        String(booking.total).includes(search)
      );
    });
  }, [recentBookings, searchTerm]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <>
      <div className="mb-10 flex items-center justify-between gap-4">
        <div className="flex w-full max-w-md items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-4 py-3">
          <Search size={16} className="text-white/40" />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search bookings..."
            className="w-full bg-transparent text-sm outline-none placeholder:text-white/40"
          />
        </div>

        <div className="flex items-center gap-5">
          <Link href="/admin/bookings" className="relative">
            <Bell size={20} />
            {stats.pendingPayments > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-yellow-400 text-xs font-bold text-black">
                {stats.pendingPayments}
              </span>
            )}
          </Link>

          <div className="relative">
            <button
              type="button"
              onClick={() => setAdminMenuOpen((prev) => !prev)}
              className="text-left cursor-pointer"
            >
              <p className="text-sm font-bold">Admin</p>
              <p className="text-xs text-white/50">Administrator</p>
            </button>

            {adminMenuOpen && (
              <div className="absolute right-0 z-50 mt-3 w-52 rounded-xl border border-white/10 bg-[#0b1113] p-2 shadow-2xl">
                <Link
                  href="/admin"
                  onClick={() => setAdminMenuOpen(false)}
                  className="block rounded-lg px-4 py-2 text-sm text-white/70 hover:bg-white/10"
                >
                  Dashboard
                </Link>

                <Link
                  href="/admin/services"
                  onClick={() => setAdminMenuOpen(false)}
                  className="block rounded-lg px-4 py-2 text-sm text-white/70 hover:bg-white/10"
                >
                  Services
                </Link>

                <Link
                  href="/admin/bookings"
                  onClick={() => setAdminMenuOpen(false)}
                  className="block rounded-lg px-4 py-2 text-sm text-white/70 hover:bg-white/10"
                >
                  Bookings
                </Link>

                <Link
                  href="/admin/settings"
                  onClick={() => setAdminMenuOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm text-white/70 hover:bg-white/10"
                >
                  <Settings size={15} />
                  Settings
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="mt-2 flex w-full items-center gap-2 rounded-lg px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 cursor-pointer"
                >
                  <LogOut size={15} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="mt-1 text-white/60">Welcome back, Temmy 👋</p>
        </div>

        <button
          onClick={fetchDashboardData}
          className="w-fit rounded-lg bg-yellow-400 px-5 py-2 text-sm font-bold text-black transition hover:bg-yellow-300 cursor-pointer"
        >
          Refresh
        </button>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Services" value={loading ? "..." : stats.totalServices.toString()} sub="Services available" icon={<Wrench />} />
        <StatCard title="Active Bookings" value={loading ? "..." : stats.activeBookings.toString()} sub="Pending or unpaid" icon={<Calendar />} />
        <StatCard title="Completed Services" value={loading ? "..." : stats.completedServices.toString()} sub="Paid or confirmed" icon={<Car />} />
        <StatCard title="Customers" value={loading ? "..." : stats.customers.toString()} sub="Unique customers" icon={<Users />} />
      </div>

      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <StatCard title="Total Revenue" value={loading ? "..." : `₦${stats.revenue.toLocaleString()}`} sub="From paid bookings" icon={<CreditCard />} />
        <StatCard title="Pending Payments" value={loading ? "..." : stats.pendingPayments.toString()} sub="Needs attention" icon={<Bell />} />
      </div>

      <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="mb-6 text-lg font-bold">
          {searchTerm ? "Search Results" : "Recent Bookings"}
        </h2>

        {loading ? (
          <p className="text-white/50">Loading recent bookings...</p>
        ) : filteredBookings.length === 0 ? (
          <p className="text-white/50">
            {searchTerm ? "No matching bookings found." : "No bookings yet."}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left text-sm">
              <thead className="text-white/50 cursor-pointer">
                <tr>
                  <th className="py-3">Customer</th>
                  <th>Service</th>
                  <th>Date</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th>Total</th>
                </tr>
              </thead>

              <tbody>
                {filteredBookings.map((booking) => (
                  <tr key={booking.id} className="border-t border-white/10">
                    <td className="py-4">
                      <p>{booking.customer_name || "No name"}</p>
                      <p className="text-xs text-white/40">
                        {booking.customer_email || "No email"}
                      </p>
                    </td>

                    <td>{booking.service_title}</td>
                    <td className="text-white/60">{booking.booking_date}</td>

                    <td>
                      <span
                        className={`rounded-md px-3 py-1 text-xs ${
                          booking.payment_status?.toLowerCase() === "paid"
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
                          booking.status?.toLowerCase() === "confirmed" ||
                          booking.status?.toLowerCase() === "completed"
                            ? "bg-blue-500/20 text-blue-400"
                            : "bg-yellow-400/20 text-yellow-400"
                        }`}
                      >
                        {booking.status || "pending"}
                      </span>
                    </td>

                    <td className="font-bold text-yellow-400">
                      ₦{Number(booking.total || 0).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

function StatCard({
  title,
  value,
  sub,
  icon,
}: {
  title: string;
  value: string;
  sub: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="mb-5 flex items-center justify-between">
        <p className="text-sm text-white/60">{title}</p>
        <div className="rounded-lg bg-white/10 p-2 text-white/70">{icon}</div>
      </div>

      <h2 className="text-4xl font-bold">{value}</h2>
      <p className="mt-2 text-sm text-green-400">{sub}</p>
    </div>
  );
}