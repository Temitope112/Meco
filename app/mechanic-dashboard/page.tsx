"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  Bell,
  CalendarDays,
  CheckCircle,
  Clock,
  Mail,
  MapPin,
  Phone,
  User,
  Wallet,
  Wrench,
  X,
} from "lucide-react";
import {
  sendJobAcceptedEmail,
  sendJobCompletedEmail,
} from "@/lib/emailNotifications";

type Mechanic = {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  specialization: string;
  status: "available" | "busy" | "offline" | "pending" | "rejected";
  is_approved: boolean;
  image_url: string | null;
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

export default function MechanicDashboardPage() {
  const router = useRouter();

  const [mechanic, setMechanic] = useState<Mechanic | null>(null);
  const [jobs, setJobs] = useState<Booking[]>([]);
  const [selectedJob, setSelectedJob] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const fetchDashboard = async () => {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.email) {
      router.push("/login");
      return;
    }

    const { data: mechanicData, error: mechanicError } = await supabase
      .from("mechanics")
      .select("*")
      .eq("email", user.email)
      .single();

    if (mechanicError || !mechanicData) {
      router.push("/mechanic-pending");
      return;
    }

    if (
      !mechanicData.is_approved ||
      mechanicData.status === "pending" ||
      mechanicData.status === "rejected"
    ) {
      router.push("/mechanic-pending");
      return;
    }

    setMechanic(mechanicData);

    const { data: bookingData, error: bookingError } = await supabase
      .from("bookings")
      .select("*")
      .eq("assigned_mechanic_id", mechanicData.id)
      .order("created_at", { ascending: false });

    if (bookingError) {
      alert(bookingError.message);
      setLoading(false);
      return;
    }

    setJobs(bookingData || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const updateMechanicAvailability = async (
    status: "available" | "busy" | "offline"
  ) => {
    if (!mechanic) return;

    try {
      setUpdatingStatus(true);

      const { error } = await supabase
        .from("mechanics")
        .update({ status })
        .eq("id", mechanic.id);

      if (error) {
        alert(error.message);
        return;
      }

      setMechanic((prev) => (prev ? { ...prev, status } : prev));
    } catch (error) {
      console.log(error);
      alert("Unable to update availability.");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const updateJobStatus = async (bookingId: number, status: string) => {
    const currentJob = jobs.find((job) => job.id === bookingId);

    if (!currentJob) return;

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

    const updatedJob = { ...currentJob, status };

    if (status === "accepted") {
      await sendJobAcceptedEmail(updatedJob);
    }

    if (status === "completed") {
      await sendJobCompletedEmail(updatedJob);
    }

    setJobs((prev) =>
      prev.map((job) => (job.id === bookingId ? updatedJob : job))
    );

    setSelectedJob((prev) =>
      prev && prev.id === bookingId ? { ...prev, status } : prev
    );

    setUpdatingId(null);
  };

  const totalJobs = jobs.length;
  const pendingJobs = jobs.filter(
    (job) => job.status === "pending" || job.status === "confirmed"
  ).length;
  const completedJobs = jobs.filter((job) => job.status === "completed").length;
  const totalEarnings = jobs
    .filter((job) => job.status === "completed")
    .reduce((sum, job) => sum + Number(job.total || 0), 0);

  return (
    <div>
      <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-center">
        <div>
          <p className="text-sm text-white/50">Welcome back,</p>
          <h1 className="text-3xl font-bold">
            {mechanic?.full_name || "Mechanic"} 👋
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Bell size={20} />

          <select
            value={mechanic?.status || "available"}
            disabled={updatingStatus}
            onChange={(e) =>
              updateMechanicAvailability(
                e.target.value as "available" | "busy" | "offline"
              )
            }
            className={`rounded-full border border-white/10 px-4 py-2 text-sm font-medium outline-none disabled:opacity-60 ${
              mechanic?.status === "available"
                ? "bg-green-500/20 text-green-400"
                : mechanic?.status === "busy"
                ? "bg-yellow-500/20 text-yellow-400"
                : "bg-red-500/20 text-red-400"
            }`}
          >
            <option value="available">Available</option>
            <option value="busy">Busy</option>
            <option value="offline">Offline</option>
          </select>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Assigned Jobs"
          value={loading ? "..." : totalJobs.toString()}
          icon={<Wrench />}
        />

        <StatCard
          title="Pending Jobs"
          value={loading ? "..." : pendingJobs.toString()}
          icon={<Clock />}
        />

        <StatCard
          title="Completed Jobs"
          value={loading ? "..." : completedJobs.toString()}
          icon={<CheckCircle />}
        />

        <StatCard
          title="Total Earnings"
          value={loading ? "..." : `₦${totalEarnings.toLocaleString()}`}
          icon={<Wallet />}
        />
      </div>

      <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="mb-6 text-xl font-bold">Recent Assigned Jobs</h2>

        {loading ? (
          <p className="text-white/50">Loading assigned jobs...</p>
        ) : jobs.length === 0 ? (
          <div className="rounded-xl border border-white/10 bg-black/30 p-8 text-center">
            <h3 className="text-xl font-bold">No assigned jobs yet.</h3>
            <p className="mt-2 text-white/50">
              New jobs will appear here once admin assigns them to you.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] text-left text-sm">
              <thead className="text-white/50">
                <tr>
                  <th className="py-3">Customer</th>
                  <th>Service</th>
                  <th>Address</th>
                  <th>Date & Time</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {jobs.map((job) => (
                  <tr key={job.id} className="border-t border-white/10">
                    <td className="py-4">
                      <p className="font-medium">{job.customer_name}</p>
                      <p className="text-xs text-white/40">
                        {job.customer_email}
                      </p>
                      <p className="text-xs text-white/40">
                        {job.customer_phone || "No phone number"}
                      </p>
                    </td>

                    <td>{job.service_title}</td>

                    <td className="max-w-[240px] text-white/60">
                      <div className="flex gap-2">
                        <MapPin size={15} className="mt-1 text-yellow-400" />
                        <span>{job.address || "No address"}</span>
                      </div>
                    </td>

                    <td className="text-white/60">
                      <div className="flex items-center gap-2">
                        <CalendarDays size={15} />
                        {job.booking_date}
                      </div>

                      <div className="mt-1 flex items-center gap-2">
                        <Clock size={15} />
                        {job.booking_time}
                      </div>
                    </td>

                    <td>
                      <span
                        className={`rounded-md px-3 py-1 text-xs ${
                          job.payment_status === "paid"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {job.payment_status || "unpaid"}
                      </span>
                    </td>

                    <td>
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
                    </td>

                    <td>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedJob(job)}
                          className="rounded-lg border border-white/10 px-3 py-2 text-xs font-bold text-white transition hover:bg-white/10"
                        >
                          View Details
                        </button>

                        {job.status !== "accepted" &&
                          job.status !== "completed" && (
                            <button
                              type="button"
                              disabled={updatingId === job.id}
                              onClick={() =>
                                updateJobStatus(job.id, "accepted")
                              }
                              className="rounded-lg bg-yellow-400 px-3 py-2 text-xs font-bold text-black transition hover:bg-yellow-300 disabled:opacity-60"
                            >
                              Accept Job
                            </button>
                          )}

                        {job.status === "accepted" && (
                          <button
                            type="button"
                            disabled={updatingId === job.id}
                            onClick={() =>
                              updateJobStatus(job.id, "completed")
                            }
                            className="rounded-lg bg-green-500 px-3 py-2 text-xs font-bold text-white transition hover:bg-green-600 disabled:opacity-60"
                          >
                            Mark Completed
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {jobs.slice(0, 3).map((job) => (
          <div
            key={job.id}
            className="rounded-2xl border border-white/10 bg-white/5 p-5"
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="rounded-full bg-yellow-400 p-3 text-black">
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
                {job.status}
              </span>
            </div>

            <h3 className="text-xl font-bold">{job.service_title}</h3>

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

            <button
              type="button"
              onClick={() => setSelectedJob(job)}
              className="mt-5 w-full rounded-lg border border-white/10 py-3 text-sm font-bold transition hover:bg-white/10"
            >
              View Details
            </button>
          </div>
        ))}
      </div>

      {selectedJob && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-white/10 bg-[#080d0e] p-6 shadow-2xl">
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
                className="rounded-lg p-2 transition hover:bg-white/10"
              >
                <X size={22} />
              </button>
            </div>

            <div className="mb-6 flex flex-wrap gap-3">
              <StatusBadge label={`Payment: ${selectedJob.payment_status}`} />
              <StatusBadge label={`Job: ${selectedJob.status}`} />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Detail
                icon={<User size={16} />}
                label="Customer Name"
                value={selectedJob.customer_name}
              />

              <Detail
                icon={<Mail size={16} />}
                label="Customer Email"
                value={selectedJob.customer_email}
              />

              <Detail
                icon={<Phone size={16} />}
                label="Customer Phone"
                value={selectedJob.customer_phone || "No phone number"}
              />

              <Detail
                icon={<Wrench size={16} />}
                label="Service"
                value={selectedJob.service_title}
              />

              <Detail
                icon={<Wrench size={16} />}
                label="Vehicle"
                value={`${selectedJob.vehicle_year} ${selectedJob.vehicle_model}`}
              />

              <Detail
                icon={<MapPin size={16} />}
                label="Customer Address"
                value={selectedJob.address || "No address"}
              />

              <Detail
                icon={<CalendarDays size={16} />}
                label="Booking Date"
                value={selectedJob.booking_date}
              />

              <Detail
                icon={<Clock size={16} />}
                label="Booking Time"
                value={selectedJob.booking_time}
              />

              <Detail
                icon={<Wallet size={16} />}
                label="Total Amount"
                value={`₦${Number(selectedJob.total || 0).toLocaleString()}`}
              />

              <Detail
                icon={<User size={16} />}
                label="Assigned Mechanic"
                value={selectedJob.assigned_mechanic_name || "Not assigned"}
              />
            </div>

            <div className="mt-6 flex flex-wrap gap-3 border-t border-white/10 pt-5">
              {selectedJob.status !== "accepted" &&
                selectedJob.status !== "completed" && (
                  <button
                    type="button"
                    disabled={updatingId === selectedJob.id}
                    onClick={() =>
                      updateJobStatus(selectedJob.id, "accepted")
                    }
                    className="rounded-lg bg-yellow-400 px-5 py-3 text-sm font-bold text-black transition hover:bg-yellow-300 disabled:opacity-60"
                  >
                    Accept Job
                  </button>
                )}

              {selectedJob.status === "accepted" && (
                <button
                  type="button"
                  disabled={updatingId === selectedJob.id}
                  onClick={() =>
                    updateJobStatus(selectedJob.id, "completed")
                  }
                  className="rounded-lg bg-green-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-green-600 disabled:opacity-60"
                >
                  Mark Completed
                </button>
              )}

              <button
                type="button"
                onClick={() => setSelectedJob(null)}
                className="rounded-lg border border-white/10 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10"
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

function StatCard({
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

      <h2 className="text-4xl font-bold">{value}</h2>
      <p className="mt-2 text-sm text-white/40">All time</p>
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

function StatusBadge({ label }: { label: string }) {
  return (
    <span className="rounded-full bg-yellow-400/10 px-4 py-2 text-xs font-bold text-yellow-400">
      {label}
    </span>
  );
}