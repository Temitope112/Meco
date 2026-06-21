"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      alert("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (error) {
        alert("Incorrect email or password.");
        return;
      }

      const accountType = data.user?.user_metadata?.account_type;
      const adminEmail = "temitopeeniola295@gmail.com";

      if (cleanEmail === adminEmail.toLowerCase()) {
        router.push("/admin");
      } else if (accountType === "mechanic") {
        router.push("/mechanic-pending");
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#05080a] text-white">
      <div className="grid min-h-screen lg:grid-cols-[1.1fr_0.9fr]">
        <section className="relative hidden overflow-hidden lg:block">
          <Image
            src="/mech.png"
            alt="Mechanic working on a car"
            fill
            priority
            className="object-cover"
          />

          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

          <div className="absolute bottom-14 left-12 max-w-md">
            <h1 className="text-4xl font-bold leading-tight">
              Reliable car care, made simple.
            </h1>

            <p className="mt-4 text-sm leading-6 text-white/70">
              Book trusted mechanics, manage your services, and track your
              bookings from one dashboard.
            </p>
          </div>
        </section>

        <section className="flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">
            <div className="mb-8 flex justify-center lg:hidden">
              <Image
                src="/meco.jpeg"
                alt="MECO Logo"
                width={130}
                height={50}
                className="rounded-md"
              />
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 shadow-2xl backdrop-blur-xl sm:p-8">
              <h1 className="text-3xl font-bold">Welcome Back</h1>

              <p className="mt-2 text-sm text-white/60">
                Login to your MECO account.
              </p>

              <div className="mt-8 space-y-5">
                <div>
                  <label className="mb-2 block text-xs text-white/60">
                    Email address
                  </label>

                  <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                    <Mail size={17} className="text-white/40" />

                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-transparent text-sm outline-none placeholder:text-white/30"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-xs text-white/60">
                    Password
                  </label>

                  <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                    <Lock size={17} className="text-white/40" />

                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-transparent text-sm outline-none placeholder:text-white/30"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-white/40 transition hover:text-white"
                    >
                      {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <label className="flex items-center gap-2 text-white/60">
                    <input type="checkbox" className="accent-yellow-400" />
                    Remember me
                  </label>

                  <Link
                    href="/forgot-password"
                    className="font-medium text-yellow-400 hover:text-yellow-300"
                  >
                    Forgot password?
                  </Link>
                </div>

                <button
                  type="button"
                  onClick={handleLogin}
                  disabled={loading}
                  className="w-full rounded-xl bg-yellow-400 py-3 text-sm font-bold text-black transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Logging in..." : "Login"}
                </button>
              </div>

              <p className="mt-6 text-center text-sm text-white/60">
                Don&apos;t have an account?{" "}
                <Link href="/sign-up" className="font-semibold text-yellow-400">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}