import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#05080a] px-4 py-14 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link href="/" className="text-2xl font-bold">
              CarFix
            </Link>

            <p className="mt-4 max-w-xs text-sm leading-6 text-white/60">
              Car care is a lifesaver. We connect you with trusted mechanics
              near you.
            </p>
          </div>

          {/* Quick Links */}
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
              <Link href="/about" className="hover:text-yellow-400">
                About us
              </Link>
              <Link href="/contact" className="hover:text-yellow-400">
                Contact
              </Link>
            </div>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-base font-semibold">Support</h3>

            <div className="mt-4 flex flex-col gap-3 text-sm text-white/60">
              <p className="cursor-pointer hover:text-yellow-400">Help Center</p>
              <p className="cursor-pointer hover:text-yellow-400">Terms & Conditions</p>
              <p className="cursor-pointer hover:text-yellow-400">Privacy Policy</p>
              <p className="cursor-pointer hover:text-yellow-400">Refund Policy</p>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-base font-semibold">Contact</h3>

            <div className="mt-4 flex flex-col gap-4 text-sm text-white/60">
              <div className="flex gap-3">
                <Phone size={17} className="text-yellow-400 cursor-pointer" />
                <span>+234 800 123 4567</span>
              </div>

              <div className="flex gap-3">
                <Mail size={17} className="text-yellow-400 cursor-pointer" />
                <span>support@carfix.com</span>
              </div>

              <div className="flex gap-3">
                <MapPin size={17} className="text-yellow-400 cursor-pointer" />
                <span>Ogbomosho, Nigeria</span>
              </div>
            </div>
          </div>
        </div>

        
           {/* NEWSLETTER */}
<div>
  <h3 className="mt-6 text-base font-semibold text-white">
    Newsletter
  </h3>

  <p className="mt-4 text-sm leading-6 text-white/60">
    Stay updated with our latest offers and tips.
  </p>

  <div className="mt-5 space-y-4">
    <input
      type="email"
      placeholder="Your email"
      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/40"
    />

    <button className="w-full rounded-xl bg-yellow-400 px-5 py-3 text-sm font-medium text-black transition hover:bg-yellow-300 cursor-pointer">
      Subscribe
    </button>
  </div>
</div>

        <div className="mt-12 border-t border-white/10 pt-6 text-center text-sm text-white/40">
          © 2026 CarFix. All rights reserved.
        </div>
      </div>
    </footer>
  );
}