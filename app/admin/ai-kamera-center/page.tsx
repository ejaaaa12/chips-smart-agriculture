"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import { Camera, RefreshCw, AlertCircle, CheckCircle, ShieldAlert } from "lucide-react";

export default function AiKameraCenter() {
  const [isCapturing, setIsCapturing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState("14 Agustus 2026 - 10:15 WIB");

  const handleCapture = () => {
    setIsCapturing(true);
    setTimeout(() => {
      setIsCapturing(false);
      setLastUpdated(`14 Agustus 2026 - ${new Date().toLocaleTimeString("id-ID")} WIB`);
      alert("Snapshot kamera berhasil diperbarui dari Raspberry Pi!");
    }, 2000);
  };

  return (
    <div className="flex min-h-screen bg-[#f4f6f5]">
      <Sidebar role="admin" />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 pt-16 lg:pt-8">
        <Topbar
          emoji="📷"
          title="AI Kamera Center"
          subtitle="Pusat Inspeksi Visual & Kamera IoT Lahan"
          description="Pantau langsung kondisi fisik tanaman cabai di lapangan secara visual dengan dukungan deteksi AI YOLOv8."
          dateLabel="14 Agustus 2026"
        />

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* Main Camera View */}
          <div className="xl:col-span-8 card p-5">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="font-semibold text-ink-900 flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse" />
                  Live Feed / Snapshot Lahan Cirebon
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">Terakhir diperbarui: {lastUpdated}</p>
              </div>
              <button
                onClick={handleCapture}
                disabled={isCapturing}
                className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors disabled:opacity-50"
              >
                <RefreshCw size={14} className={isCapturing ? "animate-spin" : ""} />
                {isCapturing ? "Mengambil Foto..." : "Ambil Foto Baru"}
              </button>
            </div>

            {/* Frame Display Kamera */}
            <div className="relative aspect-video bg-slate-900 rounded-2xl overflow-hidden flex items-center justify-center border border-slate-700">
              <img
                src="https://images.unsplash.com/photo-1592417817098-8f3d6eb16113?auto=format&fit=crop&w=1200&q=80"
                alt="Feed Kamera Lahan Cabai"
                className="w-full h-full object-cover opacity-85"
              />

              {/* Overlay Bounding Box AI (Deteksi Contoh Penyakit) */}
              <div className="absolute top-[35%] left-[40%] w-[120px] h-[100px] border-2 border-red-500 bg-red-500/10 rounded-lg flex flex-col justify-between p-1">
                <span className="bg-red-600 text-white text-[10px] font-bold px-1 py-0.5 rounded w-max">
                  Patek / Antraknosa (94%)
                </span>
              </div>

              <div className="absolute top-[50%] left-[65%] w-[100px] h-[90px] border-2 border-emerald-500 bg-emerald-500/10 rounded-lg flex flex-col justify-between p-1">
                <span className="bg-emerald-600 text-white text-[10px] font-bold px-1 py-0.5 rounded w-max">
                  Sehat (98%)
                </span>
              </div>

              {/* Status Badge */}
              <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg text-white text-xs flex items-center gap-2">
                <Camera size={14} className="text-emerald-400" />
                Raspberry Pi Cam v2 - IP: 100.97.117.87
              </div>
            </div>
          </div>

          {/* Panel Riwayat & Analisis Singkat */}
          <div className="xl:col-span-4 flex flex-col gap-4">
            <div className="card p-5">
              <h4 className="font-semibold text-ink-900 mb-3 flex items-center gap-2">
                <ShieldAlert size={18} className="text-amber-500" />
                Ringkasan Diagnosa Kamera
              </h4>
              <div className="space-y-3">
                <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3">
                  <AlertCircle className="text-red-600 shrink-0 mt-0.5" size={18} />
                  <div>
                    <p className="text-xs font-semibold text-red-900">Anomali Terdeteksi!</p>
                    <p className="text-[11px] text-red-700 mt-0.5">
                      Ditemukan gejalan patek (Antraknosa) di kluster A-2. Segera semprot fungisida.
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl flex items-start gap-3">
                  <CheckCircle className="text-emerald-600 shrink-0 mt-0.5" size={18} />
                  <div>
                    <p className="text-xs font-semibold text-emerald-900">Daun Area B Sehat</p>
                    <p className="text-[11px] text-emerald-700 mt-0.5">
                      Pertumbuhan daun hijau normal tanpa bercak kuning.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card p-5">
              <h4 className="font-semibold text-ink-900 mb-2 text-sm">Spesifikasi Modul AI</h4>
              <ul className="text-xs text-gray-600 space-y-2">
                <li className="flex justify-between border-b pb-1.5">
                  <span>Model AI:</span>
                  <span className="font-medium text-gray-900">YOLOv8 Nano</span>
                </li>
                <li className="flex justify-between border-b pb-1.5">
                  <span>Resolusi:</span>
                  <span className="font-medium text-gray-900">1080p Full HD</span>
                </li>
                <li className="flex justify-between border-b pb-1.5">
                  <span>Framerate:</span>
                  <span className="font-medium text-gray-900">30 FPS</span>
                </li>
                <li className="flex justify-between">
                  <span>Inference Hardware:</span>
                  <span className="font-medium text-gray-900">Raspberry Pi 4</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}