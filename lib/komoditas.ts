export type Komoditas = {
  id: string;
  nama: string;
  satuan: string;
  icon: string; // emoji buat dropdown, bisa diganti icon component nanti
};

export const DAFTAR_KOMODITAS: Komoditas[] = [
  { id: "cabai-merah", nama: "Cabai Merah", satuan: "kg", icon: "🌶️" },
  { id: "bawang-merah", nama: "Bawang Merah", satuan: "kg", icon: "🧅" },
  { id: "bawang-putih", nama: "Bawang Putih", satuan: "kg", icon: "🧄" },
  { id: "tomat", nama: "Tomat", satuan: "kg", icon: "🍅" },
];

export function getKomoditasById(id: string): Komoditas | undefined {
  return DAFTAR_KOMODITAS.find((k) => k.id === id);
}
