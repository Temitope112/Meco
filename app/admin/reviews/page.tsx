"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Star } from "lucide-react";

type Review = {
  id: number;
  booking_id: number | null;
  customer_name: string;
  customer_email: string;
  mechanic_name: string | null;
  rating: number;
  comment: string | null;
  created_at: string;
};

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    setReviews(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold">Reviews</h1>
      <p className="mt-2 text-white/60">View customer service reviews.</p>

      <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
        {loading ? (
          <p className="text-white/50">Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p className="text-white/50">No reviews yet.</p>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="rounded-2xl border border-white/10 bg-black/30 p-5"
              >
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="font-bold">{review.customer_name}</h2>

                  <div className="flex items-center gap-1 text-yellow-400">
                    {Array.from({ length: review.rating }).map((_, index) => (
                      <Star key={index} size={16} fill="currentColor" />
                    ))}
                  </div>
                </div>

                <p className="text-sm text-white/50">{review.customer_email}</p>

                <p className="mt-4 text-sm leading-6 text-white/70">
                  {review.comment || "No comment"}
                </p>

                <div className="mt-5 border-t border-white/10 pt-4 text-xs text-white/40">
                  <p>Mechanic: {review.mechanic_name || "Not added"}</p>
                  <p>Booking ID: {review.booking_id || "N/A"}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}