"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  User,
  Briefcase,
  Mail,
  Phone,
  Lock,
  ShieldCheck,
  BadgeCheck,
  Clock,
  Headphones,
  Users,
  Star,
} from "lucide-react";

export default function SignUpPage() {
  const router = useRouter();

  const [accountType, setAccountType] = useState("customer");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!fullName || !email || !phone || !password || !confirmPassword) {
      alert("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    if (!agreed) {
      alert("Please agree to the Terms and Privacy Policy.");
      return;
    }

    try {
      setLoading(true);

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone,
            account_type: accountType,
          },
        },
      });

      if (error) {
        alert(error.message);
        return;
      }

      alert("Account created successfully!");
      router.push("/dashboard");
    } catch (error) {
      console.log(error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#050708] text-white px-6 pt-28 pb-10">
      <section className="mx-auto grid max-w-7xl overflow-hidden rounded-3xl border border-white/10 bg-black/40 lg:grid-cols-2">
        <div className="p-8 md:p-12">
          <div className="mb-10">
            <Image
              src="/meco.jpeg"
              alt="MECO Logo"
              width={130}
              height={50}
              className="mb-10"
            />

            <h1 className="text-4xl font-bold">
              <span className="text-yellow-400">Create</span> Account
            </h1>
            <p className="mt-3 text-white/60">
              Join MECO and experience premium car care
            </p>
          </div>

          <div className="mb-8 grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setAccountType("customer")}
              className={`rounded-xl border p-5 text-left ${
                accountType === "customer"
                  ? "border-yellow-400 bg-yellow-400/10"
                  : "border-white/10 bg-white/5"
              }`}
            >
              <User className="mb-3 text-yellow-400" />
              <h3 className="font-semibold cursor-pointer">Customer</h3>
              <p className="text-sm text-white/60">Book services</p>
            </button>

            <button
              type="button"
              onClick={() => setAccountType("business")}
              className={`rounded-xl border p-5 text-left ${
                accountType === "business"
                  ? "border-yellow-400 bg-yellow-400/10"
                  : "border-white/10 bg-white/5"
              }`}
            >
              <Briefcase className="mb-3 text-white/70" />
              <h3 className="font-semibold cursor-pointer">Business</h3>
              <p className="text-sm text-white/60 cursor-pointer">Manage services</p>
            </button>
          </div>

          <div className="space-y-5">
            <Input
              icon={<User size={18} />}
              label="Full Name"
              placeholder="Enter your full name"
              value={fullName}
              onChange={setFullName}
            />

            <Input
              icon={<Mail size={18} />}
              label="Email Address"
              placeholder="Enter your email address"
              value={email}
              onChange={setEmail}
              type="email"
            />

            <Input
              icon={<Phone size={18} />}
              label="Phone Number"
              placeholder="Enter your phone number"
              value={phone}
              onChange={setPhone}
            />

            <Input
              icon={<Lock size={18} />}
              label="Password"
              placeholder="Create a password"
              type="password"
              value={password}
              onChange={setPassword}
            />

            <Input
              icon={<Lock size={18} />}
              label="Confirm Password"
              placeholder="Confirm your password"
              type="password"
              value={confirmPassword}
              onChange={setConfirmPassword}
            />
          </div>

          <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-5">
            <p className="mb-3 flex items-center gap-2 font-semibold">
              <ShieldCheck className="text-yellow-400" size={20} />
              Password must contain:
            </p>

            <div className="grid grid-cols-2 gap-2 text-sm text-white/60">
              <p>✓ At least 8 characters</p>
              <p>✓ One uppercase letter</p>
              <p>✓ One number</p>
              <p>✓ One special character</p>
            </div>
          </div>

          <label className="mt-6 flex items-center gap-3 text-sm text-white/70">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="h-5 w-5 rounded"
            />
            I agree to the{" "}
            <span className="text-yellow-400">Terms of Service</span> and{" "}
            <span className="text-yellow-400">Privacy Policy</span>
          </label>

          <button
            type="button"
            onClick={handleSignUp}
            disabled={loading}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-yellow-400 py-4 font-bold text-black transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <User size={20} />
            {loading ? "Creating Account..." : "Create Account"}
          </button>

          <div className="my-7 flex items-center gap-4 text-sm text-white/50">
            <span className="h-px flex-1 bg-white/10" />
            OR
            <span className="h-px flex-1 bg-white/10" />
          </div>

          <button className="w-full rounded-xl bg-white py-4 font-semibold text-black">
            Sign up with Google
          </button>

          <button className="mt-4 w-full rounded-xl border border-white/10 py-4 font-semibold">
            Sign up with Apple
          </button>

          <p className="mt-8 text-center text-white/60">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-yellow-400">
              Log in
            </Link>
          </p>
        </div>

        <div className="relative hidden min-h-full lg:block">
          <Image
            src="/mech.png"
            alt="Mechanic working on car"
            fill
            className="object-cover opacity-70"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />

          <div className="absolute bottom-16 left-12 right-12">
            <h2 className="text-5xl font-bold">
              Your Car, <br />
              Our <span className="text-yellow-400">Priority</span>
            </h2>

            <p className="mt-5 max-w-md text-lg text-white/70">
              Join thousands of customers who trust MECO for reliable and
              professional car care services.
            </p>

            <div className="mt-10 space-y-6">
              <Feature icon={<ShieldCheck />} title="Trusted & Secure" />
              <Feature icon={<BadgeCheck />} title="Quality Service" />
              <Feature icon={<Clock />} title="Quick & Easy Booking" />
              <Feature icon={<Headphones />} title="24/7 Support" />
            </div>

            <div className="mt-10 flex gap-6 rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="flex items-center gap-3">
                <Users className="text-yellow-400" />
                <div>
                  <h3 className="text-2xl font-bold">10K+</h3>
                  <p className="text-sm text-white/60">Happy Customers</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Star className="text-yellow-400" />
                <div>
                  <h3 className="text-2xl font-bold">4.9/5</h3>
                  <p className="text-sm text-white/60">Customer Rating</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function Input({
  label,
  placeholder,
  icon,
  type = "text",
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  icon: React.ReactNode;
  type?: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm">{label}</span>
      <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-4">
        <span className="text-white/60">{icon}</span>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent text-sm outline-none placeholder:text-white/40"
        />
      </div>
    </label>
  );
}

function Feature({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-4">
      <div className="rounded-full border border-yellow-400 p-3 text-yellow-400">
        {icon}
      </div>
      <p className="font-semibold">{title}</p>
    </div>
  );
}