"use client";

import { useState } from "react";
import { DAFTAR_KOMODITAS } from "@/lib/komoditas";

interface InputPanenFormProps {
  onAdd?: (data: { tanggal: string; jenis: string; jumlah: string; luas: string; lokasi: string }) => void;
}

export default function InputPanenForm({ onAdd }: InputPanenFormProps) {
  const [form, setForm] = useState({
    jenis: DAFTAR_KOMODITAS[0].nama,
    tanggal: "2026-07-17",
    jumlah: "250",
    luas: "0.5",
    lokasi: "Kabupaten Cirebon",
  });

  const [saved, setSaved] = useState(false);

  function handleChange<K extends keyof typeof form>(key: K, value: string) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
    setSaved(false);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Format data agar cocok diterima oleh komponen RiwayatPanenCard / localStorage
    const dataBaru = {
      tanggal: new Date(form.tanggal).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      jenis: form.jenis,
      jumlah: `${form.jumlah} Kg`,
      luas: `${form.luas} Ha`,
      lokasi: form.lokasi, // <-- Lokasi sekarang ikut disertakan di sini!
    };

    // Jalankan fungsi onAdd jika dikirim dari parent
    if (onAdd) {
      onAdd(dataBaru);
    }

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  }

  return (
    <div className="card p-5">
      <h3 className="font-semibold text-ink-900 mb-4">
        Input Data Panen
      </h3>

      <form
        onSubmit={handleSubmit}
        className="space-y-3.5 text-sm"
      >
        {/* Komoditas */}
        <div>
          <label className="block text-xs text-ink-900/50 mb-1">
            Komoditas
          </label>

          <select
            value={form.jenis}
            onChange={(e) =>
              handleChange("jenis", e.target.selectedOptions[0].text.replace(/^[^\w\s]+\s*/, ""))
            }
            className="w-full rounded-lg border border-black/10 px-3 py-2 outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500"
          >
            {DAFTAR_KOMODITAS.map((item) => (
              <option
                key={item.id}
                value={item.nama}
              >
                {item.icon} {item.nama}
              </option>
            ))}
          </select>
        </div>

        {/* Tanggal */}
        <div>
          <label className="block text-xs text-ink-900/50 mb-1">
            Tanggal Panen
          </label>

          <input
            type="date"
            value={form.tanggal}
            onChange={(e) =>
              handleChange("tanggal", e.target.value)
            }
            className="w-full rounded-lg border border-black/10 px-3 py-2 outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500"
          />
        </div>

        {/* Jumlah */}
        <div>
          <label className="block text-xs text-ink-900/50 mb-1">
            Jumlah Panen (Kg)
          </label>

          <input
            type="number"
            value={form.jumlah}
            onChange={(e) =>
              handleChange("jumlah", e.target.value)
            }
            className="w-full rounded-lg border border-black/10 px-3 py-2 outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500"
          />
        </div>

        {/* Luas */}
        <div>
          <label className="block text-xs text-ink-900/50 mb-1">
            Luas Lahan (Hektar)
          </label>

          <input
            type="number"
            step="0.1"
            value={form.luas}
            onChange={(e) =>
              handleChange("luas", e.target.value)
            }
            className="w-full rounded-lg border border-black/10 px-3 py-2 outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500"
          />
        </div>

        {/* Lokasi */}
        <div>
          <label className="block text-xs text-ink-900/50 mb-1">
            Lokasi
          </label>

          <input
            type="text"
            value={form.lokasi}
            onChange={(e) =>
              handleChange("lokasi", e.target.value)
            }
            className="w-full rounded-lg border border-black/10 px-3 py-2 outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-brand-600 py-2.5 font-medium text-white hover:bg-brand-700 transition-colors"
        >
          {saved ? "Data Tersimpan ✓" : "Simpan Data Panen"}
        </button>
      </form>
    </div>
  );
}