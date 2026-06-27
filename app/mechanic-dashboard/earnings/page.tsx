"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { CalendarDays, Wallet, CheckCircle, Clock } from "lucide-react";

type Booking = {
  id: number;
  customer_name: string;
  service_title: string;
  booking_date: string;
  booking_time: string;
  payment_status: string;
  status: string;
  total: number;
};

export default function EarningsPage() {
  const router = useRouter();

  const [jobs, setJobs] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEarnings = async () => {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.email) {
      router.push("/login");
      return;
    }

    const { data: mechanic, error: mechanicError } = await supabase
      .from("mechanics")
      .select("*")
      .eq("email", user.email)
      .single();

    if (mechanicError || !mechanic) {
      router.push("/mechanic-pending");
      return;
    }

    if (!mechanic.is_approved || mechanic.status !== "available") {
      router.push("/mechanic-pending");
      return;
    }

    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .eq("assigned_mechanic_id", mechanic.id)
      .eq("status", "completed")
      .order("created_at", { ascending: false });

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    setJobs(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchEarnings();
  }, []);

  const totalEarnings = jobs.reduce(
    (sum, job) => sum + Number(job.total || 0),
    0
  );

  const platformCommission = totalEarnings * 0.2;
  const mechanicEarnings = totalEarnings * 0.8;

  return (
    <div>
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold">Earnings</h1>
          <p className="mt-2 text-white/60">
            Track completed jobs and estimated mechanic payouts.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchEarnings}
          className="w-fit rounded-lg bg-yellow-400 px-5 py-2 text-sm font-bold text-black transition hover:bg-yellow-300"
        >
          Refresh
        </button>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <Card
          title="Gross Completed Jobs"
          value={loading ? "..." : `₦${totalEarnings.toLocaleString()}`}
          icon={<Wallet />}
        />

        <Card
          title="Platform Commission"
          value={loading ? "..." : `₦${platformCommission.toLocaleString()}`}
          icon={<Clock />}
        />

        <Card
          title="Mechanic Earnings"
          value={loading ? "..." : `₦${mechanicEarnings.toLocaleString()}`}
          icon={<CheckCircle />}
        />
      </div>

      <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="mb-6 text-xl font-bold">Earnings History</h2>

        {loading ? (
          <p className="text-white/50">Loading earnings...</p>
        ) : jobs.length === 0 ? (
          <div className="rounded-xl border border-white/10 bg-black/30 p-8 text-center">
            <h3 className="text-xl font-bold">No earnings yet</h3>
            <p className="mt-2 text-white/50">
              Earnings will appear here after completed jobs.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-left text-sm">
              <thead className="text-white/50">
                <tr>
                  <th className="py-3">Service</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Gross</th>
                  <th>Your Earning</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {jobs.map((job) => {
                  const earning = Number(job.total || 0) * 0.8;

                  return (
                    <tr key={job.id} className="border-t border-white/10">
                      <td className="py-4">{job.service_title}</td>
                      <td className="text-white/60">{job.customer_name}</td>

                      <td className="text-white/60">
                        <div className="flex items-center gap-2">
                          <CalendarDays size={15} />
                          {job.booking_date}
                        </div>
                        <p className="mt-1 text-xs text-white/40">
                          {job.booking_time}
                        </p>
                      </td>

                      <td className="font-bold text-yellow-400">
                        ₦{Number(job.total || 0).toLocaleString()}
                      </td>

                      <td className="font-bold text-green-400">
                        ₦{earning.toLocaleString()}
                      </td>

                      <td>
                        <span className="rounded-md bg-green-500/20 px-3 py-1 text-xs text-green-400">
                          completed
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function Card({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="mb-5 flex items-center justify-between">
        <p className="text-sm text-white/60">{title}</p>
        <div className="rounded-xl bg-yellow-400 p-2 text-black">{icon}</div>
      </div>

      <h2 className="text-3xl font-bold">{value}</h2>
      <p className="mt-2 text-sm text-white/40">From completed jobs</p>
    </div>
  );
}