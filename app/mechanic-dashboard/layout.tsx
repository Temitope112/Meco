"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ClipboardList,
  CheckCircle,
  Wallet,
  User,
  LogOut,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function MechanicDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen bg-[#080d0e] text-white">
      <aside className="hidden w-[270px] flex-col border-r border-white/10 bg-black/40 lg:flex">
        <div className="p-6">
          <Image
            src="/meco.jpeg"
            alt="MECO Logo"
            width={130}
            height={50}
            className="mb-10 rounded-md"
          />

          <nav className="space-y-2">
            <SidebarLink
              href="/mechanic-dashboard"
              label="Dashboard"
              icon={<LayoutDashboard size={18} />}
              active={pathname === "/mechanic-dashboard"}
            />

            <SidebarLink
              href="/mechanic-dashboard/jobs"
              label="Assigned Jobs"
              icon={<ClipboardList size={18} />}
              active={pathname === "/mechanic-dashboard/jobs"}
            />

            <SidebarLink
              href="/mechanic-dashboard/completed-jobs"
              label="Completed Jobs"
              icon={<CheckCircle size={18} />}
              active={pathname === "/mechanic-dashboard/completed-jobs"}
            />

            <SidebarLink
              href="/mechanic-dashboard/earnings"
              label="Earnings"
              icon={<Wallet size={18} />}
              active={false}
            />

            <SidebarLink
              href="/mechanic-dashboard/profile"
              label="Profile"
              icon={<User size={18} />}
              active={false}
            />
          </nav>
        </div>

        <div className="mt-auto p-6">
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-3 text-red-400 transition hover:text-red-300 cursor-pointer"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-x-hidden p-5 md:p-8">{children}</main>
    </div>
  );
}

function SidebarLink({
  href,
  label,
  icon,
  active,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
        active
          ? "bg-yellow-400 font-bold text-black"
          : "text-white/70 hover:bg-white/10 hover:text-white"
      }`}
    >
      {icon}
      {label}
    </Link>
  );
}