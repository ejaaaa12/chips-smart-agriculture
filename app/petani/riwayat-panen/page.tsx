"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";

export default function RiwayatPanenPage() {
  const [riwayatList, setRiwayatList] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("riwayatPanen");
    if (saved) {
      try {
        setRiwayatList(JSON.parse(saved));
      } catch (e) {
        setRiwayatList([]);
      }
    } else {
      // Data default jika localStorage masih kosong
      setRiwayatList([
        { tanggal: "15 Juli 2026", jenis: "Cabai Merah", jumlah: "300 Kg", luas: "0.6 Ha", lokasi: "Kabupaten Cirebon" },
        { tanggal: "10 Juli 2026", jenis: "Cabai Merah", jumlah: "270 Kg", luas: "0.5 Ha", lokasi: "Kabupaten Cirebon" },
        { tanggal: "5 Juli 2026", jenis: "Cabai Merah", jumlah: "320 Kg", luas: "0.6 Ha", lokasi: "Kabupaten Cirebon" },
      ]);
    }
  }, []);

  return (
    <div className="flex min-h-screen bg-[#f4f6f5]">
      <Sidebar role="petani" />

      <main className="flex-1 p-6 lg:p-8 min-w-0">
        <Topbar
          emoji="📋"
          title="Riwayat Panen"
          subtitle="Daftar seluruh catatan hasil panen lahan Anda."
          dateLabel="17 Juli 2026"
        />

        <div className="mt-6 bg-white rounded-xl shadow-sm border border-black/5 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-black/5 bg-black/[2%] text-xs font-semibold text-ink-900/60 uppercase">
                <th className="p-4">Tanggal</th>
                <th className="p-4">Komoditas</th>
                <th className="p-4">Jumlah Panen</th>
                <th className="p-4">Luas Lahan</th>
                <th className="p-4">Lokasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 text-sm text-ink-900">
              {riwayatList.map((item, idx) => (
                <tr key={idx} className="hover:bg-black/[1%] transition-colors">
                  <td className="p-4 font-medium">{item.tanggal}</td>
                  <td className="p-4 flex items-center gap-2">
                    <span>🌶️</span> {item.jenis}
                  </td>
                  <td className="p-4 font-semibold">{item.jumlah}</td>
                  <td className="p-4">{item.luas}</td>
                  <td className="p-4 text-ink-900/70">{item.lokasi || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}