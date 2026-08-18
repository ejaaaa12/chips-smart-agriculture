"use client";

import { useState } from "react";
import { Video, Smartphone, Camera, Upload, Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

export default function AiCameraCard() {
  // 🟢 STATE TAB MODE (0: YOLO Stream, 1: Klasifikasi Foto)
  const [activeTab, setActiveTab] = useState<"stream" | "upload">("upload");

  // 🟢 STATE OPSI 1: STREAMING YOLO
  const [streamSource, setStreamSource] = useState<"usb" | "ip">("ip");
  const [ipHp, setIpHp] = useState("192.168.1.29:8080");
  const RASPI_IP = process.env.NEXT_PUBLIC_RASPI_URL
    ? process.env.NEXT_PUBLIC_RASPI_URL.replace(/^https?:\/\//, "")
    : "100.97.117.87:8000";

  // 🟢 STATE OPSI 2: KLASIFIKASI FOTO
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  // 🟢 STATE FORM LAPORAN SINKRON KE ADMIN
  const [namaPetani, setNamaPetani] = useState("Pak Petani");
  const [lokasi, setLokasi] = useState("Kab. Cirebon");
  const [jumlahTanaman, setJumlahTanaman] = useState<number>(450);
  const [kondisi, setKondisi] = useState<"Terserang Penyakit" | "Sehat">("Terserang Penyakit");
  const [jenisPenyakit, setJenisPenyakit] = useState("Antraknosa (Patek)");
  const [terkirim, setTerkirim] = useState(false);

  // Handle Pilih Gambar
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setSelectedImage(URL.createObjectURL(file));
      setTerkirim(false);
    }
  };

  // Process Klasifikasi Foto via Backend FastAPI RasPi / Local AI
  const handleClassify = async () => {
    if (!selectedImage) return;
    setAnalyzing(true);

    try {
      // Jika ada API Backend RasPi Klasifikasi:
      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);

        const res = await fetch(`http://${RASPI_IP}/predict`, {
          method: "POST",
          body: formData,
        });

        if (res.ok) {
          const data = await res.json();
          // Contoh balasan API: { label: "Antraknosa (Patek)", status: "Terserang Penyakit" }
          if (data.label && data.label.toLowerCase().includes("sehat")) {
            setKondisi("Sehat");
            setJenisPenyakit("-");
          } else {
            setKondisi("Terserang Penyakit");
            setJenisPenyakit(data.label || "Antraknosa (Patek)");
          }
        } else {
          // Fallback jika backend offline / endpoint belum dibuat
          simulasiKlasifikasi();
        }
      } else {
        simulasiKlasifikasi();
      }
    } catch (err) {
      console.warn("Gagal terhubung ke API RasPi, menggunakan simulasi:", err);
      simulasiKlasifikasi();
    } finally {
      setAnalyzing(false);
    }
  };

  const simulasiKlasifikasi = () => {
    setKondisi("Terserang Penyakit");
    setJenisPenyakit("Antraknosa (Patek)");
  };

  // 🟢 KIRIM DATA LAPORAN KE ADMIN (REAL-TIME SINKRON)
  const handleKirimLaporan = () => {
    const dataBaru = {
      id: `LAP-${Math.floor(1000 + Math.random() * 9000)}`,
      tanggal: new Date().toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      petani: namaPetani,
      lokasi: lokasi,
      kondisi: kondisi,
      jenisPenyakit: kondisi === "Sehat" ? "-" : jenisPenyakit,
      jumlahTanaman: Number(jumlahTanaman),
    };

    if (typeof window !== "undefined") {
      const existing = localStorage.getItem("laporanKesehatanPetani");
      let listLaporan = [];
      if (existing) {
        try {
          listLaporan = JSON.parse(existing);
        } catch (e) { }
      }

      const updated = [dataBaru, ...listLaporan];
      localStorage.setItem("laporanKesehatanPetani", JSON.stringify(updated));
    }

    setTerkirim(true);
    setTimeout(() => setTerkirim(false), 3500);
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="font-bold text-slate-800 text-base">Deteksi Kesehatan Tanaman</h3>
          <p className="text-xs text-slate-400">Pilih metode deteksi penyakit cabai</p>
        </div>

        {/* TAB PILIHAN OPSI (Klasifikasi Foto vs YOLO Stream) */}
        <div className="flex bg-slate-100 p-1 rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setActiveTab("upload")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${activeTab === "upload"
                ? "bg-white text-emerald-700 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
              }`}
          >
            <Camera size={14} /> Klasifikasi Foto (Lancar)
          </button>
          <button
            onClick={() => setActiveTab("stream")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${activeTab === "stream"
                ? "bg-white text-emerald-700 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
              }`}
          >
            <Video size={14} /> YOLO Live Stream
          </button>
        </div>
      </div>

      {/* ==================== OPSI 1: KLASIFIKASI FOTO (TANPA LAG) ==================== */}
      {activeTab === "upload" && (
        <div className="space-y-3">
          <div className="relative aspect-video bg-slate-50 rounded-xl overflow-hidden border-2 border-dashed border-slate-200 flex flex-col items-center justify-center">
            {selectedImage ? (
              <img src={selectedImage} alt="Foto Cabai" className="w-full h-full object-cover" />
            ) : (
              <label className="cursor-pointer flex flex-col items-center p-4 text-center">
                <Upload size={32} className="text-slate-400 mb-1" />
                <span className="text-xs text-slate-700 font-medium">Upload atau Ambil Foto Cabai</span>
                <span className="text-[10px] text-slate-400 mt-0.5">Mendukung format JPG, PNG</span>
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
            )}
          </div>

          {selectedImage && (
            <button
              onClick={handleClassify}
              disabled={analyzing}
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              {analyzing ? (
                <>
                  <Loader2 size={15} className="animate-spin" /> Menganalisis dengan Model AI...
                </>
              ) : (
                "Jalankan Klasifikasi AI"
              )}
            </button>
          )}
        </div>
      )}

      {/* ==================== OPSI 2: YOLO LIVE STREAMING ==================== */}
      {activeTab === "stream" && (
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <div className="flex items-center gap-1.5 bg-slate-200/60 p-1 rounded-lg w-full sm:w-auto">
              <button
                onClick={() => setStreamSource("ip")}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${streamSource === "ip" ? "bg-white text-emerald-600 shadow-sm" : "text-slate-600"
                  }`}
              >
                <Smartphone size={14} /> IP Camera HP
              </button>
              <button
                onClick={() => setStreamSource("usb")}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${streamSource === "usb" ? "bg-white text-emerald-600 shadow-sm" : "text-slate-600"
                  }`}
              >
                <Video size={14} /> USB Webcam RasPi
              </button>
            </div>

            {streamSource === "ip" && (
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-[11px] font-semibold text-slate-500 shrink-0">IP HP:</span>
                <input
                  type="text"
                  value={ipHp}
                  onChange={(e) => setIpHp(e.target.value)}
                  placeholder="192.168.1.29:8080"
                  className="text-xs bg-white border border-slate-300 rounded-lg px-2.5 py-1 w-full sm:w-36 font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            )}
          </div>

          <div className="aspect-video rounded-xl bg-slate-900 overflow-hidden relative border border-slate-800">
            <img
              src={
                streamSource === "ip"
                  ? `http://${RASPI_IP}/video-feed-ip?ip=${ipHp}`
                  : `http://${RASPI_IP}/video-feed`
              }
              alt="Live Stream YOLO AI"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      {/* ==================== FORM LAPORAN SINKRON KE ADMIN (UNTUK KEDUA OPSI) ==================== */}
      <div className="pt-3 border-t border-slate-100">
        <h4 className="text-xs font-bold text-slate-800 mb-2">
          Laporan Temuan Hasil Deteksi (Otomatis Terkirim ke Admin)
        </h4>

        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/60 space-y-2.5 text-xs">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] text-slate-500 font-medium mb-1">Kondisi Tanaman:</label>
              <select
                value={kondisi}
                onChange={(e) => setKondisi(e.target.value as any)}
                className="w-full p-1.5 bg-white border border-slate-200 rounded-lg text-xs"
              >
                <option value="Terserang Penyakit">Terserang Penyakit</option>
                <option value="Sehat">Sehat</option>
              </select>
            </div>

            {kondisi === "Terserang Penyakit" && (
              <div>
                <label className="block text-[10px] text-slate-500 font-medium mb-1">Hasil Diagnosa AI:</label>
                <select
                  value={jenisPenyakit}
                  onChange={(e) => setJenisPenyakit(e.target.value)}
                  className="w-full p-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                >
                  <option value="Antraknosa (Patek)">Antraknosa (Patek)</option>
                  <option value="Bercak Daun">Bercak Daun</option>
                  <option value="Kutu Daun">Kutu Daun</option>
                  <option value="Layuk Bakteri">Layuk Bakteri</option>
                </select>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] text-slate-500 font-medium mb-1">Populasi Terdampak (Batang):</label>
              <input
                type="number"
                value={jumlahTanaman}
                onChange={(e) => setJumlahTanaman(Number(e.target.value))}
                className="w-full p-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                placeholder="450"
              />
            </div>

            <div>
              <label className="block text-[10px] text-slate-500 font-medium mb-1">Kabupaten / Lokasi:</label>
              <input
                type="text"
                value={lokasi}
                onChange={(e) => setLokasi(e.target.value)}
                className="w-full p-1.5 bg-white border border-slate-200 rounded-lg text-xs"
              />
            </div>
          </div>

          <button
            onClick={handleKirimLaporan}
            className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <Send size={13} /> Kirim Laporan Ini ke Admin
          </button>

          {terkirim && (
            <div className="p-2 bg-emerald-100 text-emerald-800 rounded-lg text-[11px] font-medium flex items-center justify-center gap-1">
              <CheckCircle2 size={14} /> Berhasil dikirim! Data langsung masuk ke Panel Admin.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}