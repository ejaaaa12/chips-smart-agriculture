"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import StatCard from "@/components/StatCard";
import PriceForecastChart from "@/components/PriceForecastChart";
import { Users, ClipboardList, Sprout, TrendingUp, Trash2 } from "lucide-react";

interface RiwayatPanen {
  tanggal: string;
  jenis: string;
  jumlah: string;
  luas: string;
  lokasi: string;
  petani?: string;
}

const RASPI_URL = process.env.NEXT_PUBLIC_RASPI_URL || "http://100.97.117.87:8000";

export default function AdminDashboard() {
  const [listPanen, setListPanen] = useState<RiwayatPanen[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 🟢 Ambil data panen dari storage terpusat
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("riwayatPanen");
      if (saved) {
        try {
          setListPanen(JSON.parse(saved));
        } catch (e) { }
      } else {
        const initial = [
          { tanggal: "15 Juli 2026", jenis: "Cabai Merah", jumlah: "300 Kg", luas: "0.6 Ha", lokasi: "Kabupaten Cirebon", petani: "Pak Budi" },
          { tanggal: "10 April 2026", jenis: "Cabai Merah", jumlah: "250 Kg", luas: "0.5 Ha", lokasi: "Kabupaten Cirebon", petani: "Pak Budi" },
        ];
        setListPanen(initial);
      }
    }

    // 🟢 Fetch Data Prediksi untuk Chart Admin
    fetch(`${RASPI_URL}/predict?days=365&komoditas=cabai-merah`, {
      headers: { "ngrok-skip-browser-warning": "true" },
    })
      .then((res) => res.json())
      .then((result) => {
        const raw = Array.isArray(result) ? result : result?.data || [];
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
        const formatted = [];
        for (let i = 0; i < 12; i++) {
          const idx = Math.min(i * 30, raw.length - 1);
          if (raw[idx]) {
            const bul = new Date(raw[idx].tanggal).getMonth();
            formatted.push({ month: monthNames[bul], harga: raw[idx].prediksi_harga });
          }
        }
        setChartData(formatted);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleDelete = (index: number) => {
    const updated = listPanen.filter((_, i) => i !== index);
    setListPanen(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("riwayatPanen", JSON.stringify(updated));
    }
  };

  // Hitung Total Panen Terdata
  const totalKg = listPanen.reduce((acc, curr) => {
    const num = parseFloat(curr.jumlah.replace(/[^0-9.,]/g, "").replace(",", ".")) || 0;
    return acc + num;
  }, 0);

  return (
    <div className="flex min-h-screen bg-[#f4f6f5]">
      <Sidebar role="admin" />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 pt-16 lg:pt-8">
        <Topbar
          emoji="⚙️"
          title="Dashboard Admin"
          subtitle="Panel Kontrol CHIPS"
          description="Pantau seluruh aktivitas petani, pendataan hasil panen, dan pergerakan harga pasar."
          dateLabel="17 Juli 2026"
        />

        {/* Ringkasan Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
          <StatCard
            icon={Users}
            iconBg="#e8f7ec"
            iconColor="#1f8a3d"
            label="Total Petani Terdaftar"
            value="12 Petani"
            sub="Wilayah Jawa Barat"
            trend="Aktif"
          />
          <StatCard
            icon={ClipboardList}
            iconBg="#e9f1fd"
            iconColor="#2563eb"
            label="Total Panen Terdata"
            value={`${totalKg.toLocaleString("id-ID")} Kg`}
            sub="Akumulasi Seluruh Input"
            trend={`${listPanen.length} Catatan`}
          />
          <StatCard
            icon={Sprout}
            iconBg="#f3ecfd"
            iconColor="#7c3aed"
            label="Komoditas Utama"
            value="Cabai Merah"
            sub="Dominasi Lahan: 75%"
            trend="Prioritas"
          />
          <StatCard
            icon={TrendingUp}
            iconBg="#fef3e7"
            iconColor="#d97706"
            label="Status AI Model"
            value="Online"
            sub="Raspberry Pi Connected"
            trend="Prophet v1.0"
          />
        </div>

        {/* Chart + Tabel Aktivitas */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
          {/* Chart Prediksi Harga */}
          <div className="xl:col-span-5 card p-5">
            <h3 className="font-semibold text-ink-900 mb-2">
              Tren Prediksi Harga Cabai Merah (12 Bulan)
            </h3>
            {loading ? (
              <p className="text-sm text-gray-400">Memuat data AI...</p>
            ) : (
              <PriceForecastChart data={chartData} />
            )}
          </div>

          {/* Tabel Data Aktivitas Petani */}
          <div className="xl:col-span-7 card p-5 overflow-x-auto">
            <h3 className="font-semibold text-ink-900 mb-4">
              Aktivitas Input Panen Petani Terbaru
            </h3>
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-100 text-gray-600 rounded-lg">
                <tr>
                  <th className="p-3">Tanggal</th>
                  <th className="p-3">Petani</th>
                  <th className="p-3">Komoditas</th>
                  <th className="p-3">Jumlah</th>
                  <th className="p-3">Lokasi</th>
                  <th className="p-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {listPanen.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="p-3 text-xs text-gray-500">{item.tanggal}</td>
                    <td className="p-3 font-medium">{item.petani || "Pak Budi"}</td>
                    <td className="p-3 text-emerald-600 font-medium">{item.jenis}</td>
                    <td className="p-3 font-semibold">{item.jumlah}</td>
                    <td className="p-3 text-xs text-gray-500">{item.lokasi}</td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => handleDelete(idx)}
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
        </div>
      </main>
    </div>
  );
}