"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { CalendarDays, Clock, MapPin, Phone, Wrench } from "lucide-react";

type Booking = {
  id: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  service_title: string;
  vehicle_year: string;
  vehicle_model: string;
  address: string;
  booking_date: string;
  booking_time: string;
  payment_status: string;
  status: string;
  total: number;
};

export default function CompletedJobsPage() {
  const router = useRouter();

  const [jobs, setJobs] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCompletedJobs = async () => {
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
    fetchCompletedJobs();
  }, []);

  const totalEarnings = jobs.reduce(
    (sum, job) => sum + Number(job.total || 0),
    0
  );

  return (
    <div>
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold">Completed Jobs</h1>
          <p className="mt-2 text-white/60">
            View all jobs you have successfully completed.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchCompletedJobs}
          className="w-fit rounded-lg bg-yellow-400 px-5 py-2 text-sm font-bold text-black transition hover:bg-yellow-300"
        >
          Refresh
        </button>
      </div>

      <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-5">
        <p className="text-sm text-white/60">Total Completed Earnings</p>
        <h2 className="mt-2 text-4xl font-bold text-yellow-400">
          ₦{totalEarnings.toLocaleString()}
        </h2>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <p className="text-white/50">Loading completed jobs...</p>
        </div>
      ) : jobs.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
          <h2 className="text-xl font-bold">No completed jobs yet</h2>
          <p className="mt-2 text-white/50">
            Completed jobs will appear here once you mark assigned jobs as
            completed.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="rounded-2xl border border-white/10 bg-white/5 p-5"
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="rounded-xl bg-green-500 p-3 text-white">
                  <Wrench size={20} />
                </div>

                <span className="rounded-md bg-green-500/20 px-3 py-1 text-xs text-green-400">
                  completed
                </span>
              </div>

              <h2 className="text-xl font-bold">{job.service_title}</h2>

              <div className="mt-4 space-y-2 text-sm text-white/60">
                <p>Customer: {job.customer_name}</p>

                <p className="flex items-center gap-2">
                  <Phone size={14} className="text-yellow-400" />
                  {job.customer_phone || "No phone number"}
                </p>

                <p>
                  Vehicle: {job.vehicle_year} {job.vehicle_model}
                </p>

                <p className="flex gap-2">
                  <MapPin size={14} className="mt-1 text-yellow-400" />
                  {job.address || "No address"}
                </p>

                <p className="flex items-center gap-2">
                  <CalendarDays size={14} />
                  {job.booking_date}
                </p>

                <p className="flex items-center gap-2">
                  <Clock size={14} />
                  {job.booking_time}
                </p>
              </div>

              <div className="mt-5 border-t border-white/10 pt-4">
                <p className="text-sm text-white/50">Job Amount</p>
                <p className="text-2xl font-bold text-yellow-400">
                  ₦{Number(job.total || 0).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}