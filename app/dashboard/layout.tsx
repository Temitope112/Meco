"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  Calendar,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  User,
  Wrench,
  X,
} from "lucide-react";

const sidebarLinks = [
  { name: "Dashboard", href: "/dashboard", icon: <LayoutDashboard size={16} /> },
  { name: "Services", href: "/dashboard/services", icon: <Wrench size={16} /> },
  { name: "My Bookings", href: "/dashboard/bookings", icon: <Calendar size={16} /> },
  { name: "Profile", href: "/dashboard/profile", icon: <User size={16} /> },
  { name: "Settings", href: "/dashboard/settings", icon: <Settings size={16} /> },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      setChecking(false);
    };

    checkUser();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (checking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#080d0e] text-white">
        Checking dashboard access...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#080d0e] text-white">
      <div className="grid min-h-screen lg:grid-cols-[240px_1fr]">
        <aside className="hidden border-r border-white/10 bg-black/40 px-5 py-6 lg:flex lg:flex-col">
          <Image
            src="/meco.jpeg"
            alt="MECO Logo"
            width={110}
            height={45}
            className="mb-10"
          />

          <nav className="space-y-2">
            {sidebarLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-white/70 transition hover:bg-yellow-400/20 hover:text-yellow-400"
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
          </nav>

          <button
            onClick={handleLogout}
            className="mt-auto flex items-center gap-3 text-sm text-red-500 transition hover:text-red-700"
          >
            <LogOut size={16} />
            Logout
          </button>
        </aside>

        <section className="px-6 py-6 lg:px-8">
          <div className="mb-6 flex items-center justify-between lg:hidden">
            <h1 className="text-xl font-bold">MECO Dashboard</h1>

            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="rounded-lg bg-yellow-400 p-2 text-black"
            >
              <Menu size={22} />
            </button>
          </div>

          {children}
        </section>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-[9999] bg-black/70 lg:hidden">
          <aside className="h-full w-72 border-r border-white/10 bg-[#080d0e] px-5 py-6">
            <div className="mb-8 flex items-center justify-between">
              <Image
                src="/meco.jpeg"
                alt="MECO Logo"
                width={100}
                height={40}
              />

              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="rounded-lg p-2 hover:bg-white/10"
              >
                <X size={22} />
              </button>
            </div>

            <nav className="space-y-2">
              {sidebarLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-white/70 transition hover:bg-yellow-400/20 hover:text-yellow-400"
                >
                  {link.icon}
                  {link.name}
                </Link>
              ))}
            </nav>

            <button
              onClick={handleLogout}
              className="mt-8 flex items-center gap-3 text-sm text-red-500 transition hover:text-red-700"
            >
              <LogOut size={16} />
              Logout
            </button>
          </aside>
        </div>
      )}
    </main>
  );
}