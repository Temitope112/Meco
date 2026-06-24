"use client";

import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const subscribe = async () => {
    if (!email.trim()) {
      alert("Please enter your email");
      return;
    }

    try {
      setLoading(true);

      const { error } = await supabase
        .from("newsletter_subscribers")
        .insert({
          email: email.trim().toLowerCase(),
        });

      if (error) {
        if (error.message.toLowerCase().includes("duplicate")) {
          alert("Email already subscribed");
          return;
        }

        alert(error.message);
        return;
      }

      alert("Successfully subscribed!");
      setEmail("");
    } catch (error) {
      console.log(error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="w-full bg-[#05080a] px-4 py-14 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="text-2xl font-bold">
              Meco
            </Link>

            <p className="mt-4 max-w-xs text-sm leading-6 text-white/60">
              Car care is a lifesaver. We connect you with trusted mechanics
              near you.
            </p>
          </div>

          <div>
            <h3 className="text-base font-semibold">Quick Links</h3>

            <div className="mt-4 flex flex-col gap-3 text-sm text-white/60">
              <Link href="/" className="hover:text-yellow-400">
                Home
              </Link>
              <Link href="/services" className="hover:text-yellow-400">
                Services
              </Link>
              <Link href="/#how-it-works" className="hover:text-yellow-400">
                How it works
              </Link>
              <Link href="/About" className="hover:text-yellow-400">
                About us
              </Link>
              <Link href="/contact-us" className="hover:text-yellow-400">
                Contact
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-base font-semibold">Support</h3>

            <div className="mt-4 flex flex-col gap-3 text-sm text-white/60">
              <p className="cursor-pointer hover:text-yellow-400">
                Help Center
              </p>
              <p className="cursor-pointer hover:text-yellow-400">
                Terms & Conditions
              </p>
              <p className="cursor-pointer hover:text-yellow-400">
                Privacy Policy
              </p>
              <p className="cursor-pointer hover:text-yellow-400">
                Refund Policy
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-base font-semibold">Contact</h3>

            <div className="mt-4 flex flex-col gap-4 text-sm text-white/60">
              <div className="flex gap-3">
                <Phone size={17} className="text-yellow-400" />
                <span>+2348057977603</span>
              </div>

              <div className="flex gap-3">
                <Mail size={17} className="text-yellow-400" />
                <span>support@meco.com</span>
              </div>

              <div className="flex gap-3">
                <MapPin size={17} className="text-yellow-400" />
                <span>Ogbomosho, Nigeria</span>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-base font-semibold text-white">
                Newsletter
              </h3>

              <p className="mt-3 text-sm text-white/60">
                Stay updated with our latest offers and tips.
              </p>

              <div className="mt-4 flex max-w-[260px] flex-col gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/40"
                />

                <button
                  type="button"
                  onClick={subscribe}
                  disabled={loading}
                  className="rounded-xl bg-yellow-400 px-5 py-3 text-sm font-medium text-black transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
                >
                  {loading ? "Subscribing..." : "Subscribe"}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6 text-center text-sm text-white/40">
          © 2026 Meco. All rights reserved.
        </div>
      </div>
    </footer>
  );
}