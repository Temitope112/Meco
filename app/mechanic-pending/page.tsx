"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function MechanicPendingPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<
    "pending" | "approved" | "rejected"
  >("pending");

  useEffect(() => {
    checkMechanicStatus();
  }, []);

  const checkMechanicStatus = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user?.email) {
        router.push("/login");
        return;
      }

      const { data: mechanic, error } = await supabase
        .from("mechanics")
        .select("*")
        .eq("email", user.email)
        .single();

      if (error || !mechanic) {
        router.push("/login");
        return;
      }

      if (mechanic.is_approved) {
        setStatus("approved");

        setTimeout(() => {
          router.push("/mechanic-dashboard");
        }, 1500);

        return;
      }

      if (mechanic.status === "rejected") {
        setStatus("rejected");
        setLoading(false);
        return;
      }

      setStatus("pending");
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050708] text-white">
        <p className="text-white/60">Checking application status...</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#050708] px-6 text-white">
      <div className="max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
        {status === "pending" && (
          <>
            <h1 className="text-3xl font-bold text-yellow-400">
              Application Submitted
            </h1>

            <p className="mt-4 text-white/60">
              Your mechanic application is currently under review. Once approved
              by MECO admin, you will gain access to your mechanic dashboard and
              start receiving jobs.
            </p>
          </>
        )}

        {status === "approved" && (
          <>
            <h1 className="text-3xl font-bold text-green-400">
              Application Approved 🎉
            </h1>

            <p className="mt-4 text-white/60">
              Your account has been approved. Redirecting you to your mechanic
              dashboard...
            </p>
          </>
        )}

        {status === "rejected" && (
          <>
            <h1 className="text-3xl font-bold text-red-400">
              Application Rejected
            </h1>

            <p className="mt-4 text-white/60">
              Unfortunately your application was not approved at this time.
              Please contact support if you believe this is a mistake.
            </p>
          </>
        )}

        <button
          onClick={checkMechanicStatus}
          className="mt-6 w-full rounded-xl bg-yellow-400 py-3 font-bold text-black transition hover:bg-yellow-300"
        >
          Refresh Status
        </button>

        <Link
          href="/login"
          className="mt-4 inline-block text-sm text-white/60 hover:text-white"
        >
          Back to Login
        </Link>
      </div>
    </main>
  );
}