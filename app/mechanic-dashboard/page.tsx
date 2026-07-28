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

type MechanicStatus =
  | "available"
  | "busy"
  | "offline"
  | "pending"
  | "rejected";

type JobStatus = "pending" | "confirmed" | "accepted" | "completed";

type Mechanic = {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  specialization: string;
  status: MechanicStatus;
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
  status: JobStatus;
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
  const [updatingAvailability, setUpdatingAvailability] = useState(false);

  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user?.email) {
        router.replace("/login");
        return;
      }

      const cleanEmail = user.email.trim().toLowerCase();

      const { data: mechanicData, error: mechanicError } = await supabase
        .from("mechanics")
        .select("*")
        .eq("email", cleanEmail)
        .single();

      if (mechanicError || !mechanicData) {
        router.replace("/mechanic-pending");
        return;
      }

      if (
        !mechanicData.is_approved ||
        mechanicData.status === "pending" ||
        mechanicData.status === "rejected"
      ) {
        router.replace("/mechanic-pending");
        return;
      }

      setMechanic(mechanicData as Mechanic);

      const { data: bookingData, error: bookingError } = await supabase
        .from("bookings")
        .select("*")
        .eq("assigned_mechanic_id", mechanicData.id)
        .order("created_at", { ascending: false });

      if (bookingError) {
        alert(bookingError.message);
        return;
      }

      setJobs((bookingData || []) as Booking[]);
    } catch (error) {
      console.error("Unable to load mechanic dashboard:", error);
      alert("Unable to load your dashboard. Please refresh and try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchDashboard();
  }, []);

  const updateMechanicAvailability = async (
    status: "available" | "busy" | "offline"
  ) => {
    if (!mechanic) {
      alert("Mechanic profile is unavailable.");
      return;
    }

    const previousStatus = mechanic.status;

    try {
      setUpdatingAvailability(true);

      setMechanic((current) =>
        current ? { ...current, status } : current
      );

      const { error } = await supabase
        .from("mechanics")
        .update({ status })
        .eq("id", mechanic.id);

      if (error) {
        setMechanic((current) =>
          current ? { ...current, status: previousStatus } : current
        );

        alert(error.message);
        return;
      }
    } catch (error) {
      console.error("Unable to update mechanic availability:", error);

      setMechanic((current) =>
        current ? { ...current, status: previousStatus } : current
      );

      alert("Unable to update your availability.");
    } finally {
      setUpdatingAvailability(false);
    }
  };

  const updateJobStatus = async (
    bookingId: number,
    status: "accepted" | "completed"
  ) => {
    if (!mechanic?.email) {
      alert("Mechanic account information is unavailable.");
      return;
    }

    const currentJob = jobs.find((job) => job.id === bookingId);

    if (!currentJob) {
      alert("The selected booking could not be found.");
      return;
    }

    if (status === "completed" && currentJob.status !== "accepted") {
      alert("You must accept the job before marking it as completed.");
      return;
    }

    try {
      setUpdatingId(bookingId);

      const response = await fetch("/api/mechanic/jobs/update-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookingId,
          status,
          mechanicEmail: mechanic.email,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        alert(result.message || "Unable to update the job status.");
        return;
      }

      const updatedJob = result.booking as Booking;

      setJobs((currentJobs) =>
        currentJobs.map((job) =>
          job.id === bookingId ? updatedJob : job
        )
      );

      setSelectedJob((currentJob) =>
        currentJob?.id === bookingId ? updatedJob : currentJob
      );

      if (!result.emailSent) {
        console.warn(
          "The job status was updated, but the customer email was not sent."
        );
      }

      alert(
        status === "accepted"
          ? "Job accepted successfully."
          : "Job marked as completed."
      );
    } catch (error) {
      console.error("Unable to update job status:", error);
      alert("Unable to update the job. Please try again.");
    } finally {
      setUpdatingId(null);
    }
  };

  const totalJobs = jobs.length;

  const pendingJobs = jobs.filter(
    (job) => job.status === "pending" || job.status === "confirmed"
  ).length;

  const completedJobs = jobs.filter(
    (job) => job.status === "completed"
  ).length;

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
            disabled={!mechanic || updatingAvailability}
            onChange={(event) =>
              void updateMechanicAvailability(
                event.target.value as "available" | "busy" | "offline"
              )
            }
            className={`rounded-full border border-white/10 px-4 py-2 text-sm font-medium outline-none disabled:cursor-not-allowed disabled:opacity-60 ${
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
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-xl font-bold">Recent Assigned Jobs</h2>

          <button
            type="button"
            onClick={() => void fetchDashboard()}
            disabled={loading}
            className="rounded-lg border border-white/10 px-4 py-2 text-sm font-medium transition hover:bg-white/10 disabled:opacity-60"
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <p className="text-white/50">Loading assigned jobs...</p>
        ) : jobs.length === 0 ? (
          <div className="rounded-xl border border-white/10 bg-black/30 p-8 text-center">
            <h3 className="text-xl font-bold">No assigned jobs yet.</h3>

            <p className="mt-2 text-white/50">
              New jobs will appear here once an admin assigns them to you.
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
                        <MapPin
                          size={15}
                          className="mt-1 shrink-0 text-yellow-400"
                        />

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
                      <PaymentBadge status={job.payment_status} />
                    </td>

                    <td>
                      <JobStatusBadge status={job.status} />
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
                                void updateJobStatus(job.id, "accepted")
                              }
                              className="rounded-lg bg-yellow-400 px-3 py-2 text-xs font-bold text-black transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              {updatingId === job.id
                                ? "Updating..."
                                : "Accept Job"}
                            </button>
                          )}

                        {job.status === "accepted" && (
                          <button
                            type="button"
                            disabled={updatingId === job.id}
                            onClick={() =>
                              void updateJobStatus(job.id, "completed")
                            }
                            className="rounded-lg bg-green-500 px-3 py-2 text-xs font-bold text-white transition hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {updatingId === job.id
                              ? "Updating..."
                              : "Mark Completed"}
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

      {!loading && jobs.length > 0 && (
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {jobs.slice(0, 3).map((job) => (
            <div
              key={job.id}
              className="rounded-2xl border border-white/10 bg-white/5 p-5"
            >
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="rounded-full bg-yellow-400 p-3 text-black">
                  <Wrench size={20} />
                </div>

                <JobStatusBadge status={job.status} />
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
      )}

      {selectedJob && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-4"
          onClick={() => setSelectedJob(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-white/10 bg-[#080d0e] p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between gap-4">
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
                aria-label="Close job details"
              >
                <X size={22} />
              </button>
            </div>

            <div className="mb-6 flex flex-wrap gap-3">
              <PaymentBadge status={selectedJob.payment_status} />
              <JobStatusBadge status={selectedJob.status} />
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
                      void updateJobStatus(selectedJob.id, "accepted")
                    }
                    className="rounded-lg bg-yellow-400 px-5 py-3 text-sm font-bold text-black transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {updatingId === selectedJob.id
                      ? "Updating..."
                      : "Accept Job"}
                  </button>
                )}

              {selectedJob.status === "accepted" && (
                <button
                  type="button"
                  disabled={updatingId === selectedJob.id}
                  onClick={() =>
                    void updateJobStatus(selectedJob.id, "completed")
                  }
                  className="rounded-lg bg-green-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {updatingId === selectedJob.id
                    ? "Updating..."
                    : "Mark Completed"}
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
      <div className="mb-5 flex items-center justify-between gap-3">
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

function PaymentBadge({ status }: { status: string }) {
  const isPaid = status === "paid";

  return (
    <span
      className={`rounded-md px-3 py-1 text-xs font-medium ${
        isPaid
          ? "bg-green-500/20 text-green-400"
          : "bg-red-500/20 text-red-400"
      }`}
    >
      Payment: {status || "unpaid"}
    </span>
  );
}

function JobStatusBadge({ status }: { status: JobStatus }) {
  return (
    <span
      className={`rounded-md px-3 py-1 text-xs font-medium ${
        status === "completed"
          ? "bg-green-500/20 text-green-400"
          : status === "accepted"
            ? "bg-blue-500/20 text-blue-400"
            : status === "confirmed"
              ? "bg-purple-500/20 text-purple-400"
              : "bg-yellow-500/20 text-yellow-400"
      }`}
    >
      Job: {status || "pending"}
    </span>
  );
}