"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Services", href: "/services" },
  { name: "About Us", href: "/About" },
  { name: "Contact", href: "/contact-us" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 500);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full">
      <div className="mx-auto max-w-7xl px-4 pt-5 sm:px-6 lg:px-8">
        <nav
          className={`flex items-center justify-between rounded-2xl px-6 py-4 backdrop-blur-md transition-all duration-300 ${
            scrolled ? "bg-black/90" : "bg-white"
          }`}
        >
          <Link href="/" className="flex items-center">
            <Image
              src="/meco.jpeg"
              alt="MECO Logo"
              width={120}
              height={40}
              priority
              className="h-auto w-auto max-h-10"
            />
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm transition hover:text-orange-500 ${
                  scrolled ? "text-white" : "text-black"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/login"
              className={`rounded-lg border px-5 py-2 text-sm transition cursor-pointer ${
                scrolled
                  ? "border-zinc-700 text-white hover:border-zinc-500"
                  : "border-zinc-300 text-black hover:border-zinc-500"
              }`}
            >
              Log In
            </Link>

            <Link
              href="/sign-up"
              className="rounded-lg bg-orange-500 px-5 py-2 text-sm font-medium text-white transition hover:bg-orange-600 cursor-pointer"
            >
              Sign Up
            </Link>
          </div>

          <button
            onClick={() => setOpen(!open)}
            className={`lg:hidden cursor-pointer ${
              scrolled ? "text-white" : "text-black"
            }`}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>

        {open && (
          <div
            className={`mt-2 rounded-2xl p-5 lg:hidden ${
              scrolled ? "bg-black/95" : "bg-white"
            }`}
          >
            <div className="flex flex-col gap-5">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={scrolled ? "text-white" : "text-black"}
                >
                  {link.name}
                </Link>
              ))}

              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className={`rounded-lg border py-2 text-center ${
                  scrolled
                    ? "border-zinc-700 text-white"
                    : "border-zinc-300 text-black"
                }`}
              >
                Log In
              </Link>

              <Link
                href="/sign-up"
                onClick={() => setOpen(false)}
                className="rounded-lg bg-orange-500 py-2 text-center text-white"
              >
                Sign Up
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}