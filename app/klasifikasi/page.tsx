"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import {
    CloudUpload,
    Search,
    Image as ImageIcon,
    CheckCircle2,
    AlertTriangle,
    ShieldCheck,
} from "lucide-react";

// 🟢 PERBAIKAN 1: Gunakan URL HTTPS Ngrok
const RASPI_IP = "https://reverence-faucet-antennae.ngrok-free.dev";

interface ClassificationResult {
    status: string;
    result_text: string;
    class_name: string;
    confidence: number;
}

// =========================================================
// 🔖 DATA REKOMENDASI PENANGANAN & PENCEGAHAN PER KELAS
// =========================================================
interface Recommendation {
    label: string;
    deskripsi: string;
    tindakanSekarang: string[];
    pencegahan: string[];
    isHealthy?: boolean;
}

const RECOMMENDATIONS: Record<string, Recommendation> = {
    anthacnose: {
        label: "Antraknosa (Anthacnose)",
        deskripsi:
            "Penyakit jamur Colletotrichum yang menyerang buah cabai dan bisa menurunkan hasil panen secara drastis bila dibiarkan, terutama saat musim hujan.",
        tindakanSekarang: [
            "Petik dan musnahkan buah/daun yang bergejala (kubur ±30 cm) agar tidak jadi sumber penularan.",
            "Bersihkan gulma di sekitar tanaman dan pastikan drainase lahan lancar.",
            "Semprotkan fungisida (mankozeb, klorotalonil, atau berbahan tembaga) setiap 4–5 hari.",
            "Pantau tanaman setiap hari, segera petik buah baru yang mulai bergejala.",
        ],
        pencegahan: [
            "Gunakan benih/varietas cabai yang tahan antraknosa untuk musim tanam berikutnya.",
            "Rotasi tanaman, hindari menanam berturut-turut dengan famili Solanaceae (tomat, terong).",
            "Atur jarak tanam lebih lebar dengan pola zig-zag agar sirkulasi udara lebih baik.",
        ],
    },
    healthy_chili: {
        label: "Tanaman Sehat",
        deskripsi:
            "Tidak ditemukan indikasi penyakit pada gambar ini. Tanaman dalam kondisi baik.",
        tindakanSekarang: [
            "Lanjutkan perawatan rutin (penyiraman, pemupukan) sesuai jadwal.",
        ],
        pencegahan: [
            "Tetap lakukan pengecekan berkala untuk deteksi dini jika ada gejala penyakit.",
            "Jaga kebersihan lahan dan drainase agar kondisi tetap optimal.",
        ],
        isHealthy: true,
    },
};

const DEFAULT_RECOMMENDATION: Recommendation = {
    label: "Hasil Tidak Dikenali",
    deskripsi:
        "Rekomendasi penanganan untuk kelas ini belum tersedia di sistem. Silakan konsultasikan dengan penyuluh pertanian setempat.",
    tindakanSekarang: [
        "Amati kondisi tanaman secara langsung untuk memastikan gejala.",
        "Hubungi penyuluh pertanian atau ahli terdekat untuk diagnosis lanjutan.",
    ],
    pencegahan: [
        "Jaga sanitasi lahan dan lakukan pengecekan rutin pada tanaman.",
    ],
};

function getRecommendation(className: string): Recommendation {
    const key = className.trim().toLowerCase().replace(/\s+/g, "_");
    return RECOMMENDATIONS[key] || DEFAULT_RECOMMENDATION;
}

export default function KlasifikasiPage() {
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [result, setResult] = useState<ClassificationResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<"sekarang" | "pencegahan">("sekarang");

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            setSelectedImage(file);
            setResult(null);
            setError(null);
            setActiveTab("sekarang");

            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUploadAndClassify = async () => {
        if (!selectedImage) {
            setError("Silakan pilih gambar terlebih dahulu.");
            return;
        }

        setLoading(true);
        setResult(null);
        setError(null);

        const formData = new FormData();
        formData.append("file", selectedImage);

        try {
            // 🟢 PERBAIKAN 2: Tambahkan headers untuk me-bypass warning Ngrok
            const response = await fetch(`${RASPI_IP}/classify`, {
                method: "POST",
                headers: {
                    "ngrok-skip-browser-warning": "69420",
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`Koneksi gagal (${response.status}). Pastikan backend RasPi berjalan.`);
            }

            const data = await response.json();

            if (data.status === "success") {
                setResult(data);
                setActiveTab("sekarang");
            } else {
                throw new Error(data.error || "Gagal melakukan klasifikasi.");
            }
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Terjadi kesalahan koneksi.");
        } finally {
            setLoading(false);
        }
    };

    const recommendation = result ? getRecommendation(result.class_name) : null;

    return (
        <div className="flex min-h-screen bg-[#f4f6f5]">
            <Sidebar role="petani" />

            <main className="flex-1 p-6 lg:p-8 min-w-0">
                <Topbar
                    icon={
                        <span className="mt-1 flex h-8 w-8 items-center justify-center rounded-lg bg-green-100 text-green-600">
                            <Search size={18} />
                        </span>
                    }
                    title="Klasifikasi Kesehatan Tanaman"
                    description="Upload foto daun atau buah tanaman untuk dianalisis oleh AI."
                    dateLabel="Analisis Real-time"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    {/* --- KARTU UPLOAD --- */}
                    <div className="card p-6">
                        <h3 className="font-semibold text-lg mb-4 text-ink-900">1. Upload Gambar</h3>

                        <label className="border-2 border-dashed border-gray-300 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-brand-500 hover:bg-gray-50 transition min-h-[200px]">
                            {previewUrl ? (
                                <img src={previewUrl} alt="Preview" className="max-h-60 rounded-xl object-contain" />
                            ) : (
                                <>
                                    <CloudUpload className="w-12 h-12 text-gray-400 mb-3" />
                                    <span className="text-sm font-medium text-ink-900">Pilih Gambar</span>
                                    <span className="text-xs text-gray-500 mt-1">PNG, JPG, JPEG</span>
                                </>
                            )}
                            <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                        </label>

                        {selectedImage && (
                            <div className="mt-4 p-3 bg-gray-100 rounded-lg text-sm text-gray-600 truncate">
                                File terpilih: {selectedImage.name}
                            </div>
                        )}

                        <button
                            onClick={handleUploadAndClassify}
                            disabled={loading || !selectedImage}
                            className={`mt-5 w-full flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl font-semibold text-white transition ${loading || !selectedImage
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-brand-600 hover:bg-brand-700 active:bg-brand-800"
                                }`}
                        >
                            {loading ? "Menjalankan AI..." : "Jalankan Klasifikasi"}
                        </button>
                    </div>

                    {/* --- KARTU HASIL --- */}
                    <div className="card p-6 flex flex-col items-center justify-center text-center">
                        <h3 className="font-semibold text-lg mb-4 self-start text-ink-900">2. Hasil Analisis AI</h3>

                        {loading && (
                            <div className="flex flex-col items-center gap-2">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
                                <p className="text-gray-500">Menganalisis gambar di Raspberry Pi...</p>
                            </div>
                        )}

                        {!loading && !result && !error && (
                            <div className="text-gray-400">
                                <ImageIcon className="w-16 h-16 mx-auto mb-3" />
                                <p>Hasil analisis akan muncul di sini setelah Anda mengupload gambar.</p>
                            </div>
                        )}

                        {error && (
                            <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100">
                                <p className="font-semibold">Error:</p>
                                <p className="text-sm">{error}</p>
                            </div>
                        )}

                        {!loading && result && (
                            <div className="p-6 bg-green-50 rounded-2xl border border-green-100 flex flex-col items-center gap-4 w-full">
                                <CheckCircle2 className="w-12 h-12 text-green-600" />

                                <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                                    Hasil Klasifikasi
                                </h4>

                                <p className="text-3xl font-bold text-green-900">
                                    {result.class_name.toUpperCase()}
                                </p>

                                <p className="text-lg text-green-700 bg-white px-4 py-1.5 rounded-full shadow-sm border">
                                    {result.result_text}
                                </p>

                                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                                    <div
                                        className="bg-green-600 h-2.5 rounded-full transition-all duration-500"
                                        style={{ width: `${result.confidence}%` }}>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* --- KARTU REKOMENDASI PENANGANAN --- */}
                {!loading && result && recommendation && (
                    <div className="card p-6 mt-6">
                        <div className="flex items-start gap-3 mb-5">
                            <span
                                className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                                    recommendation.isHealthy
                                        ? "bg-green-100 text-green-600"
                                        : "bg-amber-100 text-amber-600"
                                }`}
                            >
                                {recommendation.isHealthy ? (
                                    <ShieldCheck size={18} />
                                ) : (
                                    <AlertTriangle size={18} />
                                )}
                            </span>
                            <div>
                                <h3 className="font-semibold text-lg text-ink-900">
                                    3. Rekomendasi untuk {recommendation.label}
                                </h3>
                                <p className="text-sm text-gray-500 mt-0.5">{recommendation.deskripsi}</p>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="flex gap-2 border-b border-gray-200 mb-4">
                            <button
                                onClick={() => setActiveTab("sekarang")}
                                className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
                                    activeTab === "sekarang"
                                        ? "border-brand-600 text-brand-700"
                                        : "border-transparent text-gray-500 hover:text-ink-900"
                                }`}
                            >
                                Tindakan Sekarang
                            </button>
                            <button
                                onClick={() => setActiveTab("pencegahan")}
                                className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
                                    activeTab === "pencegahan"
                                        ? "border-brand-600 text-brand-700"
                                        : "border-transparent text-gray-500 hover:text-ink-900"
                                }`}
                            >
                                Pencegahan
                            </button>
                        </div>

                        {/* Tab content */}
                        <ul className="space-y-3">
                            {(activeTab === "sekarang"
                                ? recommendation.tindakanSekarang
                                : recommendation.pencegahan
                            ).map((item, idx) => (
                                <li key={idx} className="flex items-start gap-3">
                                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-700 text-xs font-semibold">
                                        {idx + 1}
                                    </span>
                                    <p className="text-sm text-gray-700 leading-relaxed">{item}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </main>
        </div>
    );
}
