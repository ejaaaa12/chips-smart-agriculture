"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import StatCard from "@/components/StatCard";
import {
  FileText,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  Download,
  Filter
} from "lucide-react";

interface LaporanScan {
  id: string;
  tanggal: string;
  petani: string;
  lokasi: string;
  kondisi: "Sehat" | "Terserang Penyakit";
  jenisPenyakit?: string;
  jumlahTanaman: number;
}

export default function AdminLaporanPage() {
  const [filterBulan, setFilterBulan] = useState("Agustus 2026");

  // Mock Data Laporan AI Scan & Kondisi Tanaman Petani Bulan Ini
  const [dataLaporan] = useState<LaporanScan[]>([
    {
      id: "LAP-001",
      tanggal: "14 Agustus 2026",
      petani: "Pak Budi",
      lokasi: "Kec. Sumber, Kab. Cirebon",
      kondisi: "Terserang Penyakit",
      jenisPenyakit: "Antraknosa (Patek)",
      jumlahTanaman: 450,
    },
    {
      id: "LAP-002",
      tanggal: "12 Agustus 2026",
      petani: "Pak Ahmad",
      lokasi: "Kec. Leles, Kab. Garut",
      kondisi: "Sehat",
      jenisPenyakit: "-",
      jumlahTanaman: 1200,
    },
    {
      id: "LAP-003",
      tanggal: "09 Agustus 2026",
      petani: "Bu Siti",
      lokasi: "Kec. Majalengka, Kab. Majalengka",
      kondisi: "Terserang Penyakit",
      jenisPenyakit: "Bercak Daun Cercospora",
      jumlahTanaman: 300,
    },
    {
      id: "LAP-004",
      tanggal: "05 Agustus 2026",
      petani: "Pak Budi",
      lokasi: "Kec. Sumber, Kab. Cirebon",
      kondisi: "Sehat",
      jenisPenyakit: "-",
      jumlahTanaman: 800,
    },
  ]);

  // Kalkulasi Statistik
  const totalTanaman = dataLaporan.reduce((acc, curr) => acc + curr.jumlahTanaman, 0);
  const totalSehat = dataLaporan
    .filter((d) => d.kondisi === "Sehat")
    .reduce((acc, curr) => acc + curr.jumlahTanaman, 0);
  const totalSakit = dataLaporan
    .filter((d) => d.kondisi === "Terserang Penyakit")
    .reduce((acc, curr) => acc + curr.jumlahTanaman, 0);

  const persentaseSehat = Math.round((totalSehat / totalTanaman) * 100) || 0;

  return (
    <div className="flex min-h-screen bg-[#f4f6f5]">
      <Sidebar role="admin" />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 pt-16 lg:pt-8">
        <Topbar
          emoji="📑"
          title="Laporan Kesehatan Tanaman"
          subtitle="Panel Admin - Pemantauan Hama & Penyakit"
          description="Rekapitulasi kondisi kesehatan tanaman cabai berdasarkan deteksi Kamera AI petani."
          dateLabel="14 Agustus 2026"
          rightSlot={
            <div className="flex items-center gap-2">
              <button
                onClick={() => alert("Mengunduh Laporan PDF...")}
                className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors shadow-sm"
              >
                <Download size={15} /> Export PDF
              </button>
            </div>
          }
        />

        {/* Ringkasan Stat Cards Bulan Ini */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
          <StatCard
            icon={FileText}
            iconBg="#e9f1fd"
            iconColor="#2563eb"
            label="Total Sampel Tanaman"
            value={`${totalTanaman.toLocaleString("id-ID")} Batang`}
            sub={`Periode ${filterBulan}`}
            trend="100% Tercover"
          />
          <StatCard
            icon={CheckCircle2}
            iconBg="#e8f7ec"
            iconColor="#1f8a3d"
            label="Tanaman Sehat"
            value={`${totalSehat.toLocaleString("id-ID")} Batang`}
            sub={`${persentaseSehat}% Kondisi Prima`}
            trend="Bagus"
          />
          <StatCard
            icon={AlertTriangle}
            iconBg="#fef2f2"
            iconColor="#dc2626"
            label="Terserang Penyakit"
            value={`${totalSakit.toLocaleString("id-ID")} Batang`}
            sub={`${100 - persentaseSehat}% Butuh Penanganan`}
            trend="Perlu Tindakan"
          />
          <StatCard
            icon={MapPin}
            iconBg="#fef3e7"
            iconColor="#d97706"
            label="Wilayah Rawan Waspada"
            value="Kab. Cirebon"
            sub="2 Kasus Terdeteksi"
            trend="Zona Kuning"
          />
        </div>

        {/* Filter & Tabel Laporan */}
        <div className="card p-5">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5">
            <h3 className="font-semibold text-ink-900">
              Detail Rekapitulasi Laporan Masuk
            </h3>

            {/* Selector Filter Bulan */}
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-xs text-gray-600">
              <Filter size={14} />
              <select
                value={filterBulan}
                onChange={(e) => setFilterBulan(e.target.value)}
                className="bg-transparent focus:outline-none font-medium cursor-pointer"
              >
                <option value="Agustus 2026">Agustus 2026</option>
                <option value="Juli 2026">Juli 2026</option>
                <option value="Juni 2026">Juni 2026</option>
              </select>
            </div>
          </div>

          {/* Tabel Data Laporan */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-100 text-gray-600 rounded-lg">
                <tr>
                  <th className="p-3">ID LAPORAN</th>
                  <th className="p-3">TANGGAL</th>
                  <th className="p-3">NAMA PETANI</th>
                  <th className="p-3">LOKASI LAHAN</th>
                  <th className="p-3">ESTIMASI POPULASI</th>
                  <th className="p-3">DIAGNOSA AI</th>
                  <th className="p-3">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {dataLaporan.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="p-3 font-mono text-xs font-semibold text-gray-500">
                      {item.id}
                    </td>
                    <td className="p-3 text-xs text-gray-500">{item.tanggal}</td>
                    <td className="p-3 font-medium text-gray-800">{item.petani}</td>
                    <td className="p-3 text-xs text-gray-600">
                      <div className="flex items-center gap-1">
                        <MapPin size={13} className="text-amber-500 shrink-0" />
                        {item.lokasi}
                      </div>
                    </td>
                    <td className="p-3 font-semibold text-gray-700">
                      {item.jumlahTanaman} Batang
                    </td>
                    <td className="p-3 font-medium">
                      {item.jenisPenyakit}
                    </td>
                    <td className="p-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${item.kondisi === "Sehat"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-red-100 text-red-800"
                          }`}
                      >
                        {item.kondisi === "Sehat" ? (
                          <CheckCircle2 size={12} />
                        ) : (
                          <AlertTriangle size={12} />
                        )}
                        {item.kondisi}
                      </span>
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