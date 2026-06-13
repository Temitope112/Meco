"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");

  const handleReset = async () => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
     redirectTo: "https://meco-zeta.vercel.app/reset-password",
    });

    if (error) {
      alert(error.message);
      return;
    }

    alert("Password reset link sent to your email.");
  };

  return (
    <main className="min-h-screen bg-[#080d0e] text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8">
        <h1 className="text-3xl font-bold mb-3">Reset Password</h1>
        <p className="text-white/60 mb-6">
          Enter your email and we’ll send you a reset link.
        </p>

        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 outline-none mb-5"
        />

        <button
          onClick={handleReset}
          className="w-full rounded-lg bg-yellow-400 py-3 font-bold text-black"
        >
          Send Reset Link
        </button>
      </div>
    </main>
  );
}