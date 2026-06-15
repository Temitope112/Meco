"use client";
import { Bell, Calendar, Car, Search, Users, Wrench } from "lucide-react";

const recentBookings = [
  {
    customer: "John Doe",
    service: "Oil Change",
    date: "June 20, 2026",
    status: "Confirmed",
  },
  {
    customer: "Jane Smith",
    service: "Brake Service",
    date: "June 21, 2026",
    status: "Pending",
  },
  {
    customer: "David Jones",
    service: "Engine Repair",
    date: "June 22, 2026",
    status: "Cancelled",
  },
];

export default function AdminDashboardPage() {
  return (
    <>
      <div className="mb-10 flex items-center justify-between gap-4">
        <div className="flex w-full max-w-md items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-4 py-3">
          <Search size={16} className="text-white/40" />
          <input
            placeholder="Search anything..."
            className="w-full bg-transparent text-sm outline-none placeholder:text-white/40"
          />
        </div>

        <div className="flex items-center gap-5">
          <div className="relative">
            <Bell size={20} />
            <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-yellow-400 text-xs font-bold text-black">
              3
            </span>
          </div>

          <div>
            <p className="text-sm font-bold">Admin</p>
            <p className="text-xs text-white/50">Administrator</p>
          </div>
        </div>
      </div>

      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="mt-1 text-white/60">Welcome back, Admin 👋</p>

      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Services" value="24" sub="+12% this month" icon={<Wrench />} />
        <StatCard title="Active Bookings" value="18" sub="+8% this month" icon={<Calendar />} />
        <StatCard title="Completed Services" value="128" sub="+15% this month" icon={<Car />} />
        <StatCard title="Customers" value="42" sub="+10% this month" icon={<Users />} />
      </div>

      <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="mb-6 text-lg font-bold">Recent Bookings</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-white/50">
              <tr>
                <th className="py-3">Customer</th>
                <th>Service</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {recentBookings.map((booking) => (
                <tr key={booking.customer} className="border-t border-white/10">
                  <td className="py-4">{booking.customer}</td>
                  <td>{booking.service}</td>
                  <td className="text-white/60">{booking.date}</td>
                  <td>
                    <span
                      className={`rounded-md px-3 py-1 text-xs ${
                        booking.status === "Confirmed"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-yellow-400/20 text-yellow-400"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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