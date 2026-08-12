"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import { Calendar, MapPin, Sprout } from "lucide-react";

interface RiwayatPanen {
    tanggal: string;
    jenis: string;
    jumlah: string;
    luas: string;
    lokasi: string;
}

export default function PendataanPanenPage() {
    const [listRiwayat, setListRiwayat] = useState<RiwayatPanen[]>([
        { tanggal: "15 Juli 2026", jenis: "Cabai Merah", jumlah: "300 Kg", luas: "0.6 Ha", lokasi: "Kabupaten Cirebon" },
        { tanggal: "10 April 2026", jenis: "Cabai Merah", jumlah: "250 Kg", luas: "0.5 Ha", lokasi: "Kabupaten Cirebon" },
    ]);

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

    return (
        <div className="flex min-h-screen bg-[#f4f6f5]">
            <Sidebar role="petani" />

            <main className="flex-1 p-6 lg:p-8 min-w-0">
                <Topbar
                    emoji="📋"
                    title="Pendataan Hasil Panen"
                    subtitle="Daftar riwayat siklus panen yang pernah Anda masukkan."
                    description="Pantau seluruh catatan hasil panen dan luas lahan Anda di sini."
                    dateLabel="17 Juli 2026"
                />

                <div className="card p-6 bg-white rounded-2xl shadow-sm mt-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="font-semibold text-ink-900 text-lg">Riwayat Catatan Panen</h3>
                            <p className="text-xs text-gray-400 mt-0.5">Total tercatat: {listRiwayat.length} siklus panen</p>
                        </div>
                    </div>

                    {listRiwayat.length === 0 ? (
                        <p className="text-sm text-gray-500 py-8 text-center">Belum ada riwayat panen yang tercatat.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-gray-100 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                        <th className="py-3 px-4">Tanggal</th>
                                        <th className="py-3 px-4">Komoditas</th>
                                        <th className="py-3 px-4">Jumlah Panen</th>
                                        <th className="py-3 px-4">Luas Lahan</th>
                                        <th className="py-3 px-4">Lokasi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 text-sm text-ink-900">
                                    {listRiwayat.map((item, index) => (
                                        <tr key={index} className="hover:bg-gray-50 transition-colors">
                                            <td className="py-4 px-4 flex items-center gap-2 text-gray-600">
                                                <Calendar size={16} className="text-brand-600" />
                                                {item.tanggal}
                                            </td>
                                            <td className="py-4 px-4 font-medium flex items-center gap-2">
                                                <Sprout size={16} className="text-emerald-600" />
                                                {item.jenis}
                                            </td>
                                            <td className="py-4 px-4 font-semibold text-brand-700">{item.jumlah}</td>
                                            <td className="py-4 px-4 text-gray-600">{item.luas}</td>
                                            <td className="py-4 px-4 text-gray-600 flex items-center gap-1.5">
                                                <MapPin size={15} className="text-amber-600" />
                                                {item.lokasi}
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