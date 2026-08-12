"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import { Users, Sprout, MapPin, Calendar, Trash2 } from "lucide-react";

interface DataPetaniItem {
  tanggal: string;
  jenis: string;
  jumlah: string;
  luas: string;
  lokasi: string;
}

export default function AdminDataPetaniPage() {
  const [daftarPetani, setDaftarPetani] = useState<DataPetaniItem[]>([
    { tanggal: "15 Juli 2026", jenis: "Cabai Merah", jumlah: "300 Kg", luas: "0.6 Ha", lokasi: "Kabupaten Cirebon" },
    { tanggal: "10 April 2026", jenis: "Cabai Merah", jumlah: "250 Kg", luas: "0.5 Ha", lokasi: "Kabupaten Cirebon" },
  ]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("riwayatPanen");
      if (saved) {
        try {
          setDaftarPetani(JSON.parse(saved));
        } catch (e) {
          // abaikan error parsing
        }
      }
    }
  }, []);

  const handleHapusData = (indexHapus: number) => {
    const updated = daftarPetani.filter((_, index) => index !== indexHapus);
    setDaftarPetani(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("riwayatPanen", JSON.stringify(updated));
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f4f6f5]">
      <Sidebar role="admin" />

      <main className="flex-1 p-6 lg:p-8 min-w-0">
        <Topbar
          emoji="👥"
          title="Data Petani & Hasil Panen"
          subtitle="Panel Administrator"
          description="Kelola dan pantau seluruh data inputan hasil panen dari para petani di Jawa Barat."
          dateLabel="31 Juli 2026"
        />

        <div className="card p-6 bg-white rounded-2xl shadow-sm mt-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-ink-900 text-lg flex items-center gap-2">
                <Users size={20} className="text-brand-600" />
                Daftar Aktivitas & Panen Petani
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">Total data masuk: {daftarPetani.length} catatan</p>
            </div>
          </div>

          {daftarPetani.length === 0 ? (
            <p className="text-sm text-gray-500 py-8 text-center">Belum ada data petani yang tercatat.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    <th className="py-3 px-4">Tanggal Input</th>
                    <th className="py-3 px-4">Petani / User</th>
                    <th className="py-3 px-4">Komoditas</th>
                    <th className="py-3 px-4">Jumlah Panen</th>
                    <th className="py-3 px-4">Luas Lahan</th>
                    <th className="py-3 px-4">Lokasi</th>
                    <th className="py-3 px-4 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm text-ink-900">
                  {daftarPetani.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4 flex items-center gap-2 text-gray-600">
                        <Calendar size={15} className="text-brand-600" />
                        {item.tanggal}
                      </td>
                      <td className="py-4 px-4 font-medium text-ink-900">
                        Pak Budi
                      </td>
                      <td className="py-4 px-4 font-medium flex items-center gap-1.5">
                        <Sprout size={15} className="text-emerald-600" />
                        {item.jenis}
                      </td>
                      <td className="py-4 px-4 font-semibold text-brand-700">{item.jumlah}</td>
                      <td className="py-4 px-4 text-gray-600">{item.luas}</td>
                      <td className="py-4 px-4 text-gray-600 flex items-center gap-1.5">
                        <MapPin size={15} className="text-amber-600" />
                        {item.lokasi}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <button
                          onClick={() => handleHapusData(index)}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Hapus Data"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}