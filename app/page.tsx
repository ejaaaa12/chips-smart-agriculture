"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sprout, Lock, User, AlertCircle, LogIn } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  // State Form
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // Fungsi Logika Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    setTimeout(() => {
      // 1. Cek Akun Admin
      if (username === "admin" && password === "admin123") {
        router.push("/admin");
      }
      // 2. Cek Akun Petani
      else if (username === "Petani" && password === "Petanikita123") {
        router.push("/petani");
      }
      // 3. Username / Password Salah
      else {
        setErrorMsg("Username atau password yang kamu masukkan salah!");
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-100 p-8 space-y-6">
        
        {/* Header Logo */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-emerald-50 text-emerald-600 mb-2">
            <Sprout size={36} />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">
            Smart Agriculture AI
          </h1>
          <p className="text-xs text-slate-500">
            Masuk untuk mengakses Dashboard Pemantauan Kebun
          </p>
        </div>

        {/* Notifikasi Error */}
        {errorMsg && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs animate-shake">
            <AlertCircle size={16} className="shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form Login */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Username
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <User size={18} />
              </span>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan username"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 focus:bg-white transition-all text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Lock size={18} />
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 focus:bg-white transition-all text-slate-800"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-4 rounded-xl shadow-md shadow-emerald-200 transition-all text-sm disabled:opacity-50"
          >
            {loading ? (
              <span>Memeriksa Akun...</span>
            ) : (
              <>
                <LogIn size={18} />
                <span>Masuk Sekarang</span>
              </>
            )}
          </button>
        </form>

        {/* Bantuan Kredensial untuk Pengujian Demo */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-500 space-y-1">
          <p className="font-semibold text-slate-700 mb-1">🔑 Akun Uji Coba (Demo):</p>
          <p>• <b>Admin:</b> admin | admin123</p>
          <p>• <b>Petani:</b> Petani | Petanikita123</p>
        </div>

      </div>
    </div>
  );
}