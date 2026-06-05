"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Services", href: "/services" },
  { name: "How It Works", href: "/#how-it-works" },
  { name: "About Us", href: "/About" },
  { name: "Contact", href: "/contact-us" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full">
      <div className="mx-auto max-w-7xl px-4 pt-5 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between rounded-2xl bg-black/90 px-6 py-4 backdrop-blur-md ">
          
          {/* Logo */}
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

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm text-white transition hover:text-orange-500"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Desktop Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <button className="rounded-lg border border-zinc-700 px-5 py-2 text-sm text-white transition hover:border-zinc-500 cursor-pointer">
              Log In
            </button>

            <button className="rounded-lg bg-orange-500 px-5 py-2 text-sm font-medium text-white transition hover:bg-orange-600 cursor-pointer">
              Sign Up
            </button>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="text-white lg:hidden cursor-pointer"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>

        {/* Mobile Menu */}
        {open && (
          <div className="mt-2 rounded-2xl bg-black/95 p-5 lg:hidden">
            <div className="flex flex-col gap-5">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="text-white cursor-pointer"
                >
                  {link.name}
                </Link>
              ))}

              <button className="rounded-lg border border-zinc-700 py-2 text-white cursor-pointer">
                Log In
              </button>

              <button className="rounded-lg bg-orange-500 py-2 text-white cursor-pointer">
                Sign Up
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}