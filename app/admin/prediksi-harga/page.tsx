"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import KomoditasSelector from "@/components/KomoditasSelector";
import { DAFTAR_KOMODITAS, Komoditas } from "@/lib/komoditas";
import { ShieldCheck } from "lucide-react";

interface Prediction {
  tanggal: string;
  prediksi_harga: number;
  batas_bawah: number;
  batas_atas: number;
}

export default function Page() {
  const [komoditas, setKomoditas] = useState<Komoditas>(DAFTAR_KOMODITAS[0]);
  const [data, setData] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`http://127.0.0.1:8000/predict?komoditas=${komoditas.id}`)
      .then((res) => res.json())
      .then((result) => {
        setData(Array.isArray(result) ? result : []);
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

      <main className="flex-1 p-6 lg:p-8">

        <Topbar
          icon={
            <span className="mt-1 flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
              <ShieldCheck size={18} />
            </span>
          }
          title={`Prediksi Harga ${komoditas.nama}`}
          description="Prediksi harga menggunakan model Prophet."
          dateLabel="30 Hari Kedepan"
          rightSlot={
            <div className="w-48">
              <KomoditasSelector selected={komoditas} onSelect={setKomoditas} />
            </div>
          }
        />

        <div className="card p-5">

          <h2 className="text-lg font-semibold mb-4">
            Hasil Prediksi Harga
          </h2>

          {loading ? (
            <p>Loading...</p>
          ) : data.length === 0 ? (
            <p className="text-gray-400">
              Model untuk {komoditas.nama} belum tersedia.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">

                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3">Tanggal</th>
                    <th className="text-left py-3">Prediksi Harga</th>
                    <th className="text-left py-3">Batas Bawah</th>
                    <th className="text-left py-3">Batas Atas</th>
                  </tr>
                </thead>

                <tbody>
                  {data.map((item, index) => (
                    <tr key={index} className="border-b">

                      <td className="py-3">
                        {item.tanggal}
                      </td>

                      <td className="py-3">
                        Rp {item.prediksi_harga.toLocaleString("id-ID")}
                      </td>

                      <td className="py-3">
                        Rp {item.batas_bawah.toLocaleString("id-ID")}
                      </td>

                      <td className="py-3">
                        Rp {item.batas_atas.toLocaleString("id-ID")}
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