"use client";
import { useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import { DAFTAR_KOMODITAS, Komoditas } from "@/lib/komoditas";

export default function KomoditasSelector({
  selected,
  onSelect,
}: {
  selected: Komoditas;
  onSelect: (k: Komoditas) => void;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = DAFTAR_KOMODITAS.filter((k) =>
    k.nama.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full border rounded-lg px-4 py-2 bg-white"
      >
        <span className="flex items-center gap-2">
          <span className="text-xl">{selected.icon}</span>
          {selected.nama}
        </span>
        <ChevronDown size={18} />
      </button>

      {open && (
        <div className="absolute z-10 mt-1 w-full bg-white border rounded-lg shadow-lg">
          <div className="flex items-center gap-2 px-3 py-2 border-b">
            <Search size={16} className="text-gray-400" />
            <input
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari komoditas..."
              className="w-full outline-none text-sm"
            />
          </div>
          <div className="max-h-60 overflow-y-auto">
            {filtered.map((k) => (
              <button
                key={k.id}
                onClick={() => {
                  onSelect(k);
                  setOpen(false);
                  setSearch("");
                }}
                className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-green-50"
              >
                <span className="text-xl">{k.icon}</span>
                {k.nama}
              </button>
            ))}
            {filtered.length === 0 && (
              <p className="px-4 py-2 text-sm text-gray-400">Ga ketemu</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
