"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  CalendarDays,
  Clock,
  Trash2,
  CreditCard,
  Star,
  X,
} from "lucide-react";

type Booking = {
  id: number;
  service_title: string;
  total: number;
  booking_date: string;
  booking_time: string;
  payment_status: string | null;
  status: string | null;
  customer_email: string;
  customer_name: string;
  assigned_mechanic_name: string | null;
};

export default function DashboardBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);

  const [reviewBooking, setReviewBooking] = useState<Booking | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  const fetchBookings = async () => {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .eq("customer_email", user.email)
      .order("created_at", { ascending: false });

    if (error) {
      console.log(error);
      setLoading(false);
      return;
    }

    setBookings(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const payPendingBooking = async (booking: Booking) => {
    try {
      setProcessingId(booking.id);

      const res = await fetch("/api/flutterwave/initialize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: booking.customer_email,
          amount: booking.total,
          bookingId: booking.id,
          customerName: booking.customer_name,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Unable to restart payment.");
        return;
      }

      window.location.href = data.paymentLink;
    } catch (error) {
      console.log(error);
      alert("Unable to restart payment. Please try again.");
    } finally {
      setProcessingId(null);
    }
  };

  const deletePendingBooking = async (id: number) => {
    const confirmDelete = confirm("Delete this unpaid booking?");

    if (!confirmDelete) return;

    const { error } = await supabase
      .from("bookings")
      .delete()
      .eq("id", id)
      .or(
        "payment_status.eq.unpaid,payment_status.eq.pending,payment_status.is.null"
      );

    if (error) {
      alert(error.message);
      return;
    }

    setBookings((prev) => prev.filter((booking) => booking.id !== id));
  };

  const submitReview = async () => {
    if (!reviewBooking) return;

    if (!comment.trim()) {
      alert("Please enter your review comment.");
      return;
    }

    try {
      setSubmittingReview(true);

      const { error } = await supabase.from("reviews").insert({
        booking_id: reviewBooking.id,
        customer_name: reviewBooking.customer_name,
        customer_email: reviewBooking.customer_email,
        mechanic_name: reviewBooking.assigned_mechanic_name,
        rating,
        comment,
      });

      if (error) {
        alert(error.message);
        return;
      }

      alert("Review submitted successfully.");

      setReviewBooking(null);
      setRating(5);
      setComment("");
    } catch (error) {
      console.log(error);
      alert("Unable to submit review.");
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">My Bookings</h1>

        <p className="mt-2 text-white/60">
          View your bookings, complete pending payments, delete unpaid bookings,
          or review completed services.
        </p>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          Loading bookings...
        </div>
      ) : bookings.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          No bookings found.
        </div>
      ) : (
        <div className="space-y-5">
          {bookings.map((booking) => {
            const isUnpaid =
              booking.payment_status === "unpaid" ||
              booking.payment_status === "pending" ||
              !booking.payment_status;

            const isCompleted = booking.status === "completed";

            return (
              <div
                key={booking.id}
                className="rounded-2xl border border-white/10 bg-white/5 p-6"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <h2 className="text-xl font-semibold">
                      {booking.service_title}
                    </h2>

                    <div className="mt-3 flex flex-wrap gap-5 text-sm text-white/60">
                      <div className="flex items-center gap-2">
                        <CalendarDays size={16} />
                        {booking.booking_date}
                      </div>

                      <div className="flex items-center gap-2">
                        <Clock size={16} />
                        {booking.booking_time}
                      </div>
                    </div>

                    {booking.assigned_mechanic_name && (
                      <p className="mt-3 text-sm text-white/60">
                        Mechanic:{" "}
                        <span className="text-yellow-400">
                          {booking.assigned_mechanic_name}
                        </span>
                      </p>
                    )}

                    {isUnpaid && (
                      <p className="mt-4 text-sm text-yellow-400">
                        This booking is pending payment. You can complete the
                        payment or delete it.
                      </p>
                    )}

                    {isCompleted && (
                      <p className="mt-4 text-sm text-green-400">
                        This service has been completed. You can leave a review.
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-3 lg:items-end">
                    <p className="text-xl font-bold text-yellow-400">
                      ₦{booking.total?.toLocaleString()}
                    </p>

                    <div className="flex flex-wrap gap-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          booking.payment_status === "paid"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-yellow-500/20 text-yellow-400"
                        }`}
                      >
                        Payment: {booking.payment_status || "unpaid"}
                      </span>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          booking.status === "completed"
                            ? "bg-green-500/20 text-green-400"
                            : booking.status === "confirmed"
                            ? "bg-blue-500/20 text-blue-400"
                            : booking.status === "accepted"
                            ? "bg-purple-500/20 text-purple-400"
                            : "bg-yellow-500/20 text-yellow-400"
                        }`}
                      >
                        {booking.status || "pending"}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-3 pt-2">
                      {isUnpaid && (
                        <>
                          <button
                            type="button"
                            onClick={() => payPendingBooking(booking)}
                            disabled={processingId === booking.id}
                            className="flex items-center gap-2 rounded-lg bg-yellow-400 px-4 py-2 text-sm font-bold text-black transition hover:bg-yellow-300 disabled:opacity-60"
                          >
                            <CreditCard size={16} />
                            {processingId === booking.id
                              ? "Processing..."
                              : "Pay Now"}
                          </button>

                          <button
                            type="button"
                            onClick={() => deletePendingBooking(booking.id)}
                            className="flex items-center gap-2 rounded-lg border border-red-500/30 px-4 py-2 text-sm font-bold text-red-400 transition hover:bg-red-500/10"
                          >
                            <Trash2 size={16} />
                            Delete
                          </button>
                        </>
                      )}

                      {isCompleted && (
                        <button
                          type="button"
                          onClick={() => setReviewBooking(booking)}
                          className="flex items-center gap-2 rounded-lg bg-yellow-400 px-4 py-2 text-sm font-bold text-black transition hover:bg-yellow-300"
                        >
                          <Star size={16} />
                          Leave Review
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {reviewBooking && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#080d0e] p-6 text-white shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Leave a Review</h2>
                <p className="mt-1 text-sm text-white/50">
                  {reviewBooking.service_title}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setReviewBooking(null)}
                className="rounded-lg p-2 hover:bg-white/10"
              >
                <X size={20} />
              </button>
            </div>

            <label className="block">
              <span className="mb-2 block text-sm text-white/60">Rating</span>

              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="w-full rounded-lg border border-white/10 bg-[#0b1113] px-4 py-3 text-sm text-white outline-none"
              >
                <option value={5}>5 Stars</option>
                <option value={4}>4 Stars</option>
                <option value={3}>3 Stars</option>
                <option value={2}>2 Stars</option>
                <option value={1}>1 Star</option>
              </select>
            </label>

            <label className="mt-5 block">
              <span className="mb-2 block text-sm text-white/60">
                Comment
              </span>

              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={5}
                placeholder="How was the service?"
                className="w-full resize-none rounded-lg border border-white/10 bg-[#0b1113] px-4 py-3 text-sm text-white outline-none placeholder:text-white/30"
              />
            </label>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={submitReview}
                disabled={submittingReview}
                className="flex-1 rounded-lg bg-yellow-400 py-3 font-bold text-black transition hover:bg-yellow-300 disabled:opacity-60"
              >
                {submittingReview ? "Submitting..." : "Submit Review"}
              </button>

              <button
                type="button"
                onClick={() => setReviewBooking(null)}
                className="flex-1 rounded-lg border border-white/10 py-3 font-bold text-white transition hover:bg-white/10"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}