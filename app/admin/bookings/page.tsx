"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { X } from "lucide-react";

type Booking = {
  id: number;
  service_title: string;
  service_price: number;
  customer_name: string;
  customer_email: string;
  vehicle_year: string;
  vehicle_model: string;
  address: string;
  booking_date: string;
  booking_time: string;
  total: number;
  payment_status: string;
  payment_reference: string;
  payment_channel: string;
  status: string;
  assigned_mechanic_id: number | null;
  assigned_mechanic_name: string | null;
  created_at: string;
};

type Mechanic = {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  specialization: string;
  status: string;
};

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [mechanics, setMechanics] = useState<Mechanic[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [selectedMechanicId, setSelectedMechanicId] = useState("");
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);

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

  const fetchMechanics = async () => {
    const { data, error } = await supabase
      .from("mechanics")
      .select("*")
      .order("full_name", { ascending: true });

    if (error) {
      console.log(error);
      return;
    }

    setMechanics(data || []);
  };

  useEffect(() => {
    fetchBookings();
    fetchMechanics();
  }, []);

  const openBookingDetails = (booking: Booking) => {
    setSelectedBooking(booking);
    setSelectedMechanicId(
      booking.assigned_mechanic_id ? String(booking.assigned_mechanic_id) : ""
    );
  };

  const assignMechanic = async () => {
    if (!selectedBooking) return;

    if (!selectedMechanicId) {
      alert("Please select a mechanic first.");
      return;
    }

    const mechanic = mechanics.find(
      (item) => item.id === Number(selectedMechanicId)
    );

    if (!mechanic) {
      alert("Selected mechanic not found.");
      return;
    }

    try {
      setAssigning(true);

      const { error } = await supabase
        .from("bookings")
        .update({
          assigned_mechanic_id: mechanic.id,
          assigned_mechanic_name: mechanic.full_name,
        })
        .eq("id", selectedBooking.id);

      if (error) {
        alert(error.message);
        return;
      }

      const updatedBooking = {
        ...selectedBooking,
        assigned_mechanic_id: mechanic.id,
        assigned_mechanic_name: mechanic.full_name,
      };

      setSelectedBooking(updatedBooking);

      setBookings((prev) =>
        prev.map((booking) =>
          booking.id === selectedBooking.id ? updatedBooking : booking
        )
      );

      alert("Mechanic assigned successfully!");
    } catch (error) {
      console.log(error);
      alert("Unable to assign mechanic.");
    } finally {
      setAssigning(false);
    }
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Bookings</h1>
          <p className="mt-2 text-white/60">
            View customer bookings, payment status and assign mechanics.
          </p>
        </div>

        <button
          onClick={fetchBookings}
          className="cursor-pointer rounded-lg bg-yellow-400 px-4 py-2 text-sm font-bold text-black transition hover:bg-yellow-300"
        >
          Refresh
        </button>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        {loading ? (
          <p className="text-white/50">Loading bookings...</p>
        ) : bookings.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1150px] text-left text-sm">
              <thead className="text-white/50">
                <tr>
                  <th className="py-3">Customer</th>
                  <th>Email</th>
                  <th>Service</th>
                  <th>Address</th>
                  <th>Date</th>
                  <th>Total</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th>Mechanic</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.id} className="border-t border-white/10">
                    <td className="py-4">{booking.customer_name}</td>
                    <td className="text-white/60">{booking.customer_email}</td>
                    <td>{booking.service_title}</td>

                    <td className="max-w-[220px] truncate text-white/60">
                      {booking.address || "No address"}
                    </td>

                    <td className="text-white/60">
                      {booking.booking_date} <br />
                      <span className="text-white/40">
                        {booking.booking_time}
                      </span>
                    </td>

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

                    <td className="text-white/60">
                      {booking.assigned_mechanic_name || "Not assigned"}
                    </td>

                    <td>
                      <button
                        type="button"
                        onClick={() => openBookingDetails(booking)}
                        className="rounded-lg bg-yellow-400 px-4 py-2 text-xs font-bold text-black transition hover:bg-yellow-300"
                      >
                        View
                      </button>
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

      {selectedBooking && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-white/10 bg-[#080d0e] p-6 text-white shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Booking Details</h2>

              <button
                type="button"
                onClick={() => setSelectedBooking(null)}
                className="rounded-lg p-2 hover:bg-white/10"
              >
                <X size={22} />
              </button>
            </div>

            <div className="mb-6 rounded-xl border border-white/10 bg-white/5 p-4">
              <h3 className="mb-4 font-bold text-yellow-400">
                Assign Mechanic
              </h3>

              <div className="grid gap-3 md:grid-cols-[1fr_auto]">
                <select
                  value={selectedMechanicId}
                  onChange={(e) => setSelectedMechanicId(e.target.value)}
                  className="rounded-lg border border-white/10 bg-[#0b1113] px-4 py-3 text-sm text-white outline-none"
                >
                  <option value="">Select mechanic</option>

                  {mechanics.map((mechanic) => (
                    <option key={mechanic.id} value={mechanic.id}>
                      {mechanic.full_name} - {mechanic.specialization}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={assignMechanic}
                  disabled={assigning}
                  className="rounded-lg bg-yellow-400 px-5 py-3 text-sm font-bold text-black transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {assigning ? "Assigning..." : "Assign"}
                </button>
              </div>

              <p className="mt-3 text-sm text-white/60">
                Current mechanic:{" "}
                <span className="text-yellow-400">
                  {selectedBooking.assigned_mechanic_name || "Not assigned"}
                </span>
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Detail
                label="Customer Name"
                value={selectedBooking.customer_name}
              />
              <Detail
                label="Customer Email"
                value={selectedBooking.customer_email}
              />
              <Detail label="Service" value={selectedBooking.service_title} />
              <Detail
                label="Vehicle"
                value={`${selectedBooking.vehicle_year} ${selectedBooking.vehicle_model}`}
              />
              <Detail
                label="Address"
                value={selectedBooking.address || "No address"}
              />
              <Detail
                label="Booking Date"
                value={selectedBooking.booking_date}
              />
              <Detail
                label="Booking Time"
                value={selectedBooking.booking_time}
              />
              <Detail
                label="Total Amount"
                value={`₦${selectedBooking.total?.toLocaleString()}`}
              />
              <Detail
                label="Payment Status"
                value={selectedBooking.payment_status || "unpaid"}
              />
              <Detail
                label="Booking Status"
                value={selectedBooking.status || "pending"}
              />
              <Detail
                label="Assigned Mechanic"
                value={selectedBooking.assigned_mechanic_name || "Not assigned"}
              />
              <Detail
                label="Payment Reference"
                value={selectedBooking.payment_reference || "Not available"}
              />
              <Detail
                label="Payment Channel"
                value={selectedBooking.payment_channel || "Not available"}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <p className="text-xs text-white/40">{label}</p>
      <p className="mt-2 break-words font-medium text-white">{value}</p>
    </div>
  );
}