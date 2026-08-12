export default function RiwayatPanenCard({
  data,
}: {
  data: { tanggal: string; jenis: string; jumlah: string; luas: string }[];
}) {
  return (
    <div className="card p-5 flex flex-col">
      <h3 className="font-semibold text-ink-900 mb-4">Riwayat Panen Terakhir</h3>
      <div className="space-y-3 flex-1">
        {data.map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-3 rounded-lg border border-black/5 px-3 py-3"
          >
            <span className="text-lg">🌶️</span>
            <div className="flex-1">
              <p className="text-sm font-medium text-ink-900">{item.tanggal}</p>
              <p className="text-xs text-ink-900/50">{item.jenis}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-ink-900">{item.jumlah}</p>
              <p className="text-xs text-ink-900/50">{item.luas}</p>
            </div>
          </div>
        ))}
      </div>
      <button className="mt-4 w-full rounded-lg border border-black/10 py-2 text-sm font-medium text-ink-900/70 hover:bg-black/5 transition-colors">
        Lihat Semua Riwayat
      </button>
    </div>
  );
}
