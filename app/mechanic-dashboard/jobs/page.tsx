"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  CalendarDays,
  Clock,
  Mail,
  MapPin,
  Phone,
  User,
  Wrench,
  X,
} from "lucide-react";

type Mechanic = {
  id: number;
  full_name: string;
  email: string;
  status: string;
  is_approved: boolean;
};

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
  assigned_mechanic_id: number | null;
  assigned_mechanic_name: string | null;
};

export default function AssignedJobsPage() {
  const router = useRouter();

  const [jobs, setJobs] = useState<Booking[]>([]);
  const [selectedJob, setSelectedJob] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const fetchJobs = async () => {
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
    fetchJobs();
  }, []);

  const updateJobStatus = async (bookingId: number, status: string) => {
    setUpdatingId(bookingId);

    const { error } = await supabase
      .from("bookings")
      .update({ status })
      .eq("id", bookingId);

    if (error) {
      alert(error.message);
      setUpdatingId(null);
      return;
    }

    setJobs((prev) =>
      prev.map((job) => (job.id === bookingId ? { ...job, status } : job))
    );

    setSelectedJob((prev) =>
      prev && prev.id === bookingId ? { ...prev, status } : prev
    );

    setUpdatingId(null);
  };

  return (
    <div>
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold">Assigned Jobs</h1>
          <p className="mt-2 text-white/60">
            View jobs assigned to you and update their progress.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchJobs}
          className="w-fit rounded-lg bg-yellow-400 px-5 py-2 text-sm font-bold text-black transition hover:bg-yellow-300"
        >
          Refresh
        </button>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        {loading ? (
          <p className="text-white/50">Loading assigned jobs...</p>
        ) : jobs.length === 0 ? (
          <div className="rounded-xl border border-white/10 bg-black/30 p-8 text-center">
            <h2 className="text-xl font-bold">No assigned jobs yet</h2>
            <p className="mt-2 text-white/50">
              Jobs will appear here once admin assigns them to you.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="rounded-2xl border border-white/10 bg-black/30 p-5"
              >
                <div className="mb-4 flex items-center justify-between">
                  <div className="rounded-xl bg-yellow-400 p-3 text-black">
                    <Wrench size={20} />
                  </div>

                  <span
                    className={`rounded-md px-3 py-1 text-xs ${
                      job.status === "completed"
                        ? "bg-green-500/20 text-green-400"
                        : job.status === "accepted"
                        ? "bg-blue-500/20 text-blue-400"
                        : "bg-yellow-500/20 text-yellow-400"
                    }`}
                  >
                    {job.status || "pending"}
                  </span>
                </div>

                <h2 className="text-xl font-bold">{job.service_title}</h2>

                <div className="mt-4 space-y-2 text-sm text-white/60">
                  <p>Customer: {job.customer_name}</p>
                  <p>Phone: {job.customer_phone || "No phone number"}</p>
                  <p>
                    Vehicle: {job.vehicle_year} {job.vehicle_model}
                  </p>
                  <p>Address: {job.address || "No address"}</p>
                  <p>
                    Date: {job.booking_date} • {job.booking_time}
                  </p>
                </div>

                <div className="mt-5 border-t border-white/10 pt-4">
                  <p className="text-sm text-white/50">Total Amount</p>
                  <p className="text-2xl font-bold text-yellow-400">
                    ₦{Number(job.total || 0).toLocaleString()}
                  </p>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedJob(job)}
                    className="rounded-lg border border-white/10 px-4 py-2 text-sm font-bold text-white transition hover:bg-white/10"
                  >
                    View Details
                  </button>

                  {job.status !== "accepted" && job.status !== "completed" && (
                    <button
                      type="button"
                      disabled={updatingId === job.id}
                      onClick={() => updateJobStatus(job.id, "accepted")}
                      className="rounded-lg bg-yellow-400 px-4 py-2 text-sm font-bold text-black transition hover:bg-yellow-300 disabled:opacity-60"
                    >
                      Accept
                    </button>
                  )}

                  {job.status === "accepted" && (
                    <button
                      type="button"
                      disabled={updatingId === job.id}
                      onClick={() => updateJobStatus(job.id, "completed")}
                      className="rounded-lg bg-green-500 px-4 py-2 text-sm font-bold text-white transition hover:bg-green-600 disabled:opacity-60"
                    >
                      Complete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedJob && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-white/10 bg-[#080d0e] p-6 text-white shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Job Details</h2>
                <p className="mt-1 text-sm text-white/50">
                  Booking #{selectedJob.id}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedJob(null)}
                className="rounded-lg p-2 hover:bg-white/10"
              >
                <X size={22} />
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Detail icon={<User size={16} />} label="Customer" value={selectedJob.customer_name} />
              <Detail icon={<Phone size={16} />} label="Phone" value={selectedJob.customer_phone || "No phone number"} />
              <Detail icon={<Mail size={16} />} label="Email" value={selectedJob.customer_email} />
              <Detail icon={<Wrench size={16} />} label="Service" value={selectedJob.service_title} />
              <Detail icon={<Wrench size={16} />} label="Vehicle" value={`${selectedJob.vehicle_year} ${selectedJob.vehicle_model}`} />
              <Detail icon={<MapPin size={16} />} label="Address" value={selectedJob.address || "No address"} />
              <Detail icon={<CalendarDays size={16} />} label="Date" value={selectedJob.booking_date} />
              <Detail icon={<Clock size={16} />} label="Time" value={selectedJob.booking_time} />
            </div>

            <div className="mt-6 flex flex-wrap gap-3 border-t border-white/10 pt-5">
              {selectedJob.status !== "accepted" &&
                selectedJob.status !== "completed" && (
                  <button
                    type="button"
                    onClick={() => updateJobStatus(selectedJob.id, "accepted")}
                    className="rounded-lg bg-yellow-400 px-5 py-3 text-sm font-bold text-black"
                  >
                    Accept Job
                  </button>
                )}

              {selectedJob.status === "accepted" && (
                <button
                  type="button"
                  onClick={() => updateJobStatus(selectedJob.id, "completed")}
                  className="rounded-lg bg-green-500 px-5 py-3 text-sm font-bold text-white"
                >
                  Mark Completed
                </button>
              )}

              <button
                type="button"
                onClick={() => setSelectedJob(null)}
                className="rounded-lg border border-white/10 px-5 py-3 text-sm font-bold text-white hover:bg-white/10"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Detail({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <div className="mb-2 flex items-center gap-2 text-yellow-400">
        {icon}
        <p className="text-xs uppercase tracking-wide">{label}</p>
      </div>

      <p className="break-words font-medium text-white">{value}</p>
    </div>
  );
}