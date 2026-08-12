"use client";

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
  const nav = role === "petani" ? petaniNav : adminNav;

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    router.push("/");
  };

  return (
    <aside className="hidden lg:flex lg:flex-col w-64 shrink-0 bg-ink-900 text-white h-screen sticky top-0">
      {/* 🟢 BRAND CHIPS */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-white/10">
        <span className="text-2xl">🌶️</span>
        <div className="leading-tight">
          <p className="text-base font-extrabold tracking-wider text-emerald-400">CHIPS</p>
          <p className="text-[10px] text-white/60">Chili IoT & Precision System</p>
        </div>
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
  );
}