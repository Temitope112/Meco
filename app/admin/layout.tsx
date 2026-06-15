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
  Settings,
  Star,
  User,
  Users,
  Wrench,
} from "lucide-react";

const ADMIN_EMAIL = "temitopeeniola295@gmail.com"; 

const sidebarLinks = [
  { name: "Dashboard", href: "/admin", icon: <LayoutDashboard size={16} /> },
  { name: "Services", href: "/admin/services", icon: <Wrench size={16} /> },
  { name: "Bookings", href: "/admin/bookings", icon: <Calendar size={16} /> },
  { name: "Mechanics", href: "/admin/mechanics", icon: <Users size={16} /> },
  { name: "Customers", href: "/admin/customers", icon: <User size={16} /> },
  { name: "Reviews", href: "/admin/reviews", icon: <Star size={16} /> },
  { name: "Settings", href: "/admin/settings", icon: <Settings size={16} /> },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      if (user.email !== ADMIN_EMAIL) {
        alert("Access denied. Admin only.");
        router.push("/");
        return;
      }

      setChecking(false);
    };

    checkAdmin();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (checking) {
    return (
      <main className="min-h-screen bg-[#080d0e] text-white flex items-center justify-center">
        <p>Checking admin access...</p>
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
            className="mt-auto flex items-center gap-3 text-sm text-red-500 cursor-pointer transition hover:text-red-700"
          >
            <LogOut size={16} />
            Logout
          </button>
        </aside>

        <section className="px-6 py-6 lg:px-8">{children}</section>
      </div>
    </main>
  );
}