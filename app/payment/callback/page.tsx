"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle, XCircle } from "lucide-react";

function PaymentCallbackContent() {
  const searchParams = useSearchParams();

  const status = searchParams.get("status");
  const txRef = searchParams.get("tx_ref");
  const transactionId = searchParams.get("transaction_id");

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("Verifying payment...");

  useEffect(() => {
    const verifyPayment = async () => {
      if (status !== "successful" || !txRef || !transactionId) {
        setSuccess(false);
        setMessage("Payment was not completed.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("/api/flutterwave/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            transactionId,
            txRef,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          setSuccess(false);
          setMessage(data.message || "Payment verification failed.");
          return;
        }

        setSuccess(true);
        setMessage("Payment successful! Your booking has been confirmed.");
      } catch (error) {
        console.log(error);
        setSuccess(false);
        setMessage("Something went wrong while verifying payment.");
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [status, txRef, transactionId]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#080d0e] px-6 text-white">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
        {loading ? (
          <div>
            <h1 className="text-2xl font-bold">Verifying Payment...</h1>
            <p className="mt-3 text-white/60">
              Please wait while we confirm your transaction.
            </p>
          </div>
        ) : success ? (
          <div>
            <CheckCircle className="mx-auto mb-5 text-yellow-400" size={60} />
            <h1 className="text-3xl font-bold">Payment Successful</h1>
            <p className="mt-3 text-white/60">{message}</p>

            <Link
              href="/dashboard/bookings"
              className="mt-8 inline-block rounded-lg bg-yellow-400 px-6 py-3 font-bold text-black"
            >
              View My Bookings
            </Link>
          </div>
        ) : (
          <div>
            <XCircle className="mx-auto mb-5 text-red-500" size={60} />
            <h1 className="text-3xl font-bold">Payment Failed</h1>
            <p className="mt-3 text-white/60">{message}</p>

            <Link
              href="/services"
              className="mt-8 inline-block rounded-lg bg-yellow-400 px-6 py-3 font-bold text-black"
            >
              Try Again
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}

export default function PaymentCallbackPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-[#080d0e]" />}>
      <PaymentCallbackContent />
    </Suspense>
  );
}