"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import StatCard from "@/components/StatCard";
import PriceForecastChart from "@/components/PriceForecastChart";
import AiCameraCard from "@/components/AiCameraCard";
import InputPanenForm from "@/components/InputPanenForm";
import KomoditasSelector from "@/components/KomoditasSelector";
import { DAFTAR_KOMODITAS, Komoditas } from "@/lib/komoditas";
import { Wallet, LineChart as LineChartIcon, Sprout, MapPin } from "lucide-react";

interface Prediction {
  tanggal: string;
  prediksi_harga: number;
  batas_bawah: number;
  batas_atas: number;
}

interface RiwayatPanen {
  tanggal: string;
  jenis: string;
  jumlah: string;
  luas: string;
  lokasi: string;
}

const NAMA_BULAN = [
  "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
  "Jul", "Agu", "Sep", "Okt", "Nov", "Des",
];

// 🟢 Environment Variable Ngrok dengan Fallback IP Lokal
const RASPI_URL = process.env.NEXT_PUBLIC_RASPI_URL || "http://100.97.117.87:8000";

export default function PetaniDashboard() {
  const [komoditas, setKomoditas] = useState<Komoditas>(DAFTAR_KOMODITAS[0]);
  const [data, setData] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [tanggalRealtime, setTanggalRealtime] = useState<string>("");

  const [listRiwayat, setListRiwayat] = useState<RiwayatPanen[]>([
    { tanggal: "15 Juli 2026", jenis: "Cabai Merah", jumlah: "300 Kg", luas: "0.6 Ha", lokasi: "Kabupaten Cirebon" },
    { tanggal: "10 April 2026", jenis: "Cabai Merah", jumlah: "250 Kg", luas: "0.5 Ha", lokasi: "Kabupaten Cirebon" },
  ]);

  // 🟢 Effect Tanggal Real-Time (Perbaikan: "long" huruf kecil)
  useEffect(() => {
    const hariIni = new Date();
    setTanggalRealtime(
      hariIni.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    );
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("riwayatPanen");
      if (saved) {
        try {
          setListRiwayat(JSON.parse(saved));
        } catch (e) {
          // abaikan error parsing
        }
      }
    }
  }, []);

  const handleTambahPanen = (dataBaru: RiwayatPanen) => {
    const updated = [dataBaru, ...listRiwayat];
    setListRiwayat(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("riwayatPanen", JSON.stringify(updated));
    }
  };

  useEffect(() => {
    setLoading(true);
    const komoditasSlug = komoditas.id.toLowerCase().replace("_", "-");

    // 🟢 Memanggil API Ngrok + Header Bypass Warning
    fetch(`${RASPI_URL}/predict?days=365&komoditas=${komoditasSlug}`, {
      headers: {
        "ngrok-skip-browser-warning": "true",
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((result) => {
        if (Array.isArray(result)) {
          setData(result);
        } else if (result && Array.isArray(result.data)) {
          setData(result.data);
        } else {
          setData([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Gagal mengambil data dari RasPi:", err);
        setData([]);
        setLoading(false);
      });
  }, [komoditas]);

  // --- LOGIKA HITUNG DARI INPUT TERAKHIR ---
  const panenTerakhir = listRiwayat.length > 0 ? listRiwayat[0] : null;

  const angkaJumlahTerakhir = panenTerakhir
    ? parseFloat(panenTerakhir.jumlah.replace(/[^0-9.,]/g, "").replace(",", ".")) || 0
    : 0;

  const luasLahanTerakhir = panenTerakhir ? panenTerakhir.luas : "0 Ha";

  const estimasiPanen3BulanKg = Math.round(angkaJumlahTerakhir * 1.5);
  const formatPrediksi3Bulan = estimasiPanen3BulanKg >= 1000
    ? `${(estimasiPanen3BulanKg / 1000).toFixed(1)} Ton`
    : `${estimasiPanen3BulanKg} Kg`;

  const hargaHariIni = data.length > 0 ? data[0].prediksi_harga : null;
  const harga12Bulan = data.length > 0 ? data[data.length - 1].prediksi_harga : null;

  const persenKenaikan =
    hargaHariIni && harga12Bulan
      ? (((harga12Bulan - hargaHariIni) / hargaHariIni) * 100).toFixed(1)
      : null;

  const chartData = [];
  for (let i = 0; i < 12; i++) {
    const index = Math.min(i * 30, data.length - 1);
    if (data[index]) {
      const bulan = new Date(data[index].tanggal).getMonth();
      chartData.push({
        month: NAMA_BULAN[bulan],
        harga: data[index].prediksi_harga,
      });
    }
  }

  return (
    <div className="flex min-h-screen bg-[#f4f6f5]">
      <Sidebar role="petani" />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 pt-16 lg:pt-8">
        <Topbar
          emoji="🌱"
          title="Dashboard Petani"
          subtitle="Halo, Pak Petani!"
          description={`Kelola lahan, panen dan pantau prediksi harga ${komoditas.nama.toLowerCase()}.`}
          dateLabel={tanggalRealtime || "Memuat..."}
          rightSlot={
            <div className="w-full sm:w-48 mt-2 sm:mt-0">
              <KomoditasSelector selected={komoditas} onSelect={setKomoditas} />
            </div>
          }
        />

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
          <StatCard
            icon={Wallet}
            iconBg="#e8f7ec"
            iconColor="#1f8a3d"
            label={`Harga ${komoditas.nama} Hari Ini`}
            value={
              loading
                ? "Memuat..."
                : hargaHariIni
                  ? `Rp ${hargaHariIni.toLocaleString("id-ID")}/kg`
                  : "Tidak Tersedia"
            }
            sub="Rata-rata Jawa Barat"
            trend={loading ? "" : "Prediksi model"}
          />
          <StatCard
            icon={LineChartIcon}
            iconBg="#e9f1fd"
            iconColor="#2563eb"
            label="Prediksi Harga (12 Bulan)"
            value={
              loading
                ? "Memuat..."
                : harga12Bulan
                  ? `Rp ${harga12Bulan.toLocaleString("id-ID")}/kg`
                  : "Tidak Tersedia"
            }
            sub="Setahun ke depan"
            trend={persenKenaikan ? `${persenKenaikan}% dari sekarang` : ""}
          />
          <StatCard
            icon={Sprout}
            iconBg="#f3ecfd"
            iconColor="#7c3aed"
            label="Prediksi Panen (3 Bln)"
            value={formatPrediksi3Bulan}
            sub="Estimasi siklus berikutnya"
            trend={panenTerakhir ? `Basis: ${panenTerakhir.jumlah}` : "Belum ada input"}
          />
          <StatCard
            icon={MapPin}
            iconBg="#fef3e7"
            iconColor="#d97706"
            label="Luas Lahan Aktif"
            value={luasLahanTerakhir}
            sub={panenTerakhir ? panenTerakhir.lokasi : "Belum ada data"}
            action={
              <span className="text-xs font-medium text-brand-600">
                Sesuai Input
              </span>
            }
          />
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
          <div className="xl:col-span-4">
            <AiCameraCard />
          </div>

          <div className="xl:col-span-4">
            <div className="card p-5 h-full">
              <h3 className="font-semibold text-ink-900 mb-2">
                Prediksi Harga {komoditas.nama} Jawa Barat (12 Bulan)
              </h3>
              {loading ? (
                <p className="text-sm text-gray-400">Memuat chart...</p>
              ) : chartData.length === 0 ? (
                <p className="text-sm text-gray-400">Data prediksi belum tersedia.</p>
              ) : (
                <PriceForecastChart data={chartData} />
              )}
              <div className="flex items-center gap-2 text-xs text-ink-900/50 mt-1">
                <span className="h-2 w-2 rounded-full bg-brand-600" />
                Prediksi Harga
              </div>
            </div>
          </div>

          <div className="xl:col-span-4">
            <InputPanenForm onAdd={handleTambahPanen} />
          </div>
        </div>
      </main>
    </div>
  );
}