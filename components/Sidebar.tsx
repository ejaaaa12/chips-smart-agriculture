"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Camera,
  Search,
  LineChart,
  ClipboardList,
  User,
  Users,
  TrendingUp,
  BarChart3,
  FileText,
  Settings,
  LogOut,
  ChevronDown,
  Cloud,
  MoreVertical, // 👈 Pakai ikon titik 3
  X,
} from "lucide-react";

type Role = "petani" | "admin";

const petaniNav = [
  { href: "/petani", label: "Dashboard", icon: LayoutDashboard },
  { href: "/petani/ai-kamera", label: "AI Kamera", icon: Camera },
  { href: "/klasifikasi", label: "Klasifikasi AI", icon: Search },
  { href: "/petani/prediksi-harga", label: "Prediksi Harga", icon: LineChart },
  { href: "/petani/pendataan-panen", label: "Pendataan Hasil Panen", icon: ClipboardList },
  { href: "/petani/profil", label: "Profil", icon: User },
];

const adminNav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/data-petani", label: "Data Petani", icon: Users },
  { href: "/admin/prediksi-harga", label: "Prediksi Harga", icon: TrendingUp },
  { href: "/admin/ai-kamera-center", label: "AI Kamera Center", icon: BarChart3 },
  { href: "/admin/laporan", label: "Laporan", icon: FileText },
  { href: "/admin/pengaturan", label: "Pengaturan", icon: Settings },
];

export default function Sidebar({ role }: { role: Role }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const nav = role === "petani" ? petaniNav : adminNav;

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    router.push("/");
  };

  return (
    <>
      {/* 🟢 TOP BAR KHUSUS HP (Ikon Titik 3) */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-ink-900 text-white w-full fixed top-0 left-0 z-40 border-b border-white/10 shadow-md">
        <div className="flex items-center gap-2">
          <span className="text-xl">🌶️</span>
          <span className="font-extrabold tracking-wider text-emerald-400 text-lg">CHIPS</span>
        </div>
        
        {/* Tombol Titik 3 */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
          aria-label="Toggle Navigation"
        >
          {isOpen ? <X size={22} /> : <MoreVertical size={22} />}
        </button>
      </div>

      {/* 🟢 BACKDROP HITAM SAAT MENU DI-KLIK */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm transition-opacity"
        />
      )}

      {/* 🟢 DRAWER SIDEBAR */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-64 bg-ink-900 text-white flex flex-col shrink-0 transition-transform duration-300 ease-in-out lg:sticky lg:translate-x-0 ${
          isOpen ? "translate-x-0 pt-0" : "-translate-x-full"
        }`}
      >
        {/* BRAND CHIPS */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🌶️</span>
            <div className="leading-tight">
              <p className="text-base font-extrabold tracking-wider text-emerald-400">CHIPS</p>
              <p className="text-[10px] text-white/60">Chili IoT & Precision System</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden text-white/60 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* User Info */}
        <div className="mx-4 mt-4 mb-2 flex items-center gap-3 rounded-xl bg-white/5 px-3 py-3">
          <div className="h-9 w-9 rounded-full bg-white/15 flex items-center justify-center">
            <User size={18} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">{role === "petani" ? "Pak Budi" : "Admin"}</p>
            <p className="text-xs text-white/50">{role === "petani" ? "Petani" : "Administrator"}</p>
          </div>
          <ChevronDown size={16} className="text-white/40" />
        </div>

        {/* Nav Link List */}
        <nav className="flex-1 px-3 mt-2 space-y-1 overflow-y-auto">
          {nav.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                  active
                    ? "bg-brand-600 text-white font-medium"
                    : "text-white/70 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon size={18} />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Widget Cuaca Khusus Petani */}
        {role === "petani" && (
          <div className="mx-4 mb-3 rounded-xl bg-white/5 px-4 py-3">
            <p className="text-xs text-white/50 mb-1">Cuaca Hari Ini</p>
            <div className="flex items-center gap-3">
              <Cloud size={24} className="text-white/70" />
              <div>
                <p className="text-base font-semibold">28°C</p>
                <p className="text-xs text-white/50">Berawan</p>
              </div>
            </div>
            <p className="text-[10px] text-white/40 mt-1">Bandung, Jawa Barat</p>
          </div>
        )}

        {/* Tombol Logout */}
        <div className="px-3 pb-5">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}