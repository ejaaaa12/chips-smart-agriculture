"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import PriceForecastChart from "@/components/PriceForecastChart";
import KomoditasSelector from "@/components/KomoditasSelector";
import { DAFTAR_KOMODITAS, Komoditas } from "@/lib/komoditas";

const RASPI_URL = process.env.NEXT_PUBLIC_RASPI_URL || "http://100.97.117.87:8000";

export default function AdminPrediksiHarga() {
  const [komoditas, setKomoditas] = useState<Komoditas>(DAFTAR_KOMODITAS[0]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const slug = komoditas.id.toLowerCase().replace("_", "-");

    fetch(`${RASPI_URL}/predict?days=365&komoditas=${slug}`, {
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
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [komoditas]);

  return (
    <div className="flex min-h-screen bg-[#f4f6f5]">
      <Sidebar role="admin" />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 pt-16 lg:pt-8">
        <Topbar
          emoji="📈"
          title={`Prediksi Harga ${komoditas.nama}`}
          subtitle="Analisis Tren Pasar AI"
          description="Model AI Prophet memprediksi estimasi pergerakan harga komoditas hingga 12 bulan ke depan."
          dateLabel="17 Juli 2026"
          rightSlot={
            <div className="w-full sm:w-48 mt-2 sm:mt-0">
              <KomoditasSelector selected={komoditas} onSelect={setKomoditas} />
            </div>
          }
        />

        <div className="card p-6">
          <h3 className="font-semibold text-lg text-ink-900 mb-4">
            Grafik Proyeksi Harga {komoditas.nama}
          </h3>
          {loading ? (
            <div className="py-12 text-center text-gray-400">Memuat data dari AI Model...</div>
          ) : chartData.length === 0 ? (
            <div className="py-12 text-center text-gray-400">Data prediksi tidak tersedia.</div>
          ) : (
            <PriceForecastChart data={chartData} />
          )}
        </div>
      </main>
    </div>
  );
}