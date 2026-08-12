# Smart Agriculture AI — Dashboard Cabai Jawa Barat

Dashboard Next.js (App Router + TypeScript + Tailwind CSS + Recharts) untuk dua peran:

- **`/petani`** — Dashboard Petani (Pak Budi): harga hari ini, prediksi harga & panen, AI Kamera, input data panen, riwayat panen.
- **`/admin`** — Dashboard Admin: statistik agregat, prediksi produksi, tabel data panen terbaru, sebaran produksi per kabupaten.

## Cara menjalankan di Antigravity (atau editor lain berbasis VS Code)

1. **Buka folder project**
   Buka Antigravity → `File > Open Folder` → pilih folder `smart-agriculture-ai` ini.

2. **Buka terminal terintegrasi**
   Gunakan menu `Terminal > New Terminal` (atau `` Ctrl+` ``).

3. **Install dependencies** (butuh Node.js 18.18+ atau 20+)
   ```bash
   npm install
   ```

4. **Jalankan development server**
   ```bash
   npm run dev
   ```

5. **Buka di browser**
   Kunjungi [http://localhost:3000](http://localhost:3000) — akan otomatis diarahkan ke `/petani`.
   Untuk dashboard admin, buka [http://localhost:3000/admin](http://localhost:3000/admin).

## Build untuk production

```bash
npm run build
npm run start
```

## Struktur project

```
app/
  layout.tsx            # root layout
  page.tsx               # redirect ke /petani
  petani/page.tsx         # Dashboard Petani
  admin/page.tsx          # Dashboard Admin
  petani/*, admin/*       # halaman placeholder untuk menu sidebar lainnya
components/
  Sidebar.tsx             # sidebar navigasi (role: petani | admin)
  Topbar.tsx              # header judul + tanggal
  StatCard.tsx            # kartu statistik ringkas
  AiCameraCard.tsx        # kartu deteksi AI Kamera
  InputPanenForm.tsx      # form input data panen (interaktif)
  RiwayatPanenCard.tsx    # daftar riwayat panen
  DataPanenTable.tsx      # tabel data panen terbaru (admin)
  PriceForecastChart.tsx  # grafik area prediksi harga (recharts)
  ProductionForecastChart.tsx # grafik garis prediksi produksi (recharts)
  KabupatenDonutChart.tsx # donut chart sebaran kabupaten (recharts)
  PlaceholderPage.tsx     # halaman "coming soon" untuk menu lain
lib/
  data.ts                 # data contoh (mock data) untuk semua chart & tabel
```

## Menghubungkan ke data & AI asli

Saat ini semua data (harga, prediksi, riwayat panen, deteksi AI Kamera) adalah **mock data** di `lib/data.ts` dan komponen terkait, supaya tampilan bisa langsung dijalankan tanpa backend.

Untuk produksi sebenarnya, gantikan dengan:
- **API routes** di `app/api/.../route.ts` yang memanggil database (mis. Postgres/Supabase) untuk data petani & panen.
- **Model prediksi harga/produksi** (mis. dipanggil lewat endpoint Python/ML terpisah) — ganti isi `priceForecast` / `productionForecast` dengan hasil fetch dari API tersebut.
- **AI Kamera** — ganti gambar statis di `AiCameraCard.tsx` dengan stream kamera asli (WebRTC/RTSP via `<video>`) dan hasil inferensi model deteksi penyakit tanaman.

## Tech stack

- Next.js 14 (App Router, TypeScript)
- Tailwind CSS
- Recharts (grafik)
- lucide-react (ikon)
