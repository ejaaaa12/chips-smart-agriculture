export default function DataPanenTable({
  data,
}: {
  data: {
    petani: string;
    jenis: string;
    tanggal: string;
    jumlah: string;
    luas: string;
    lokasi: string;
  }[];
}) {
  return (
    <div className="card p-5 flex flex-col">
      <h3 className="font-semibold text-ink-900 mb-4">Data Panen Terbaru</h3>
      <div className="overflow-x-auto -mx-1">
        <table className="w-full text-sm min-w-[520px]">
          <thead>
            <tr className="text-left text-ink-900/40 text-xs">
              <th className="font-medium px-1 pb-2">Petani</th>
              <th className="font-medium px-1 pb-2">Jenis Cabai</th>
              <th className="font-medium px-1 pb-2">Tanggal Panen</th>
              <th className="font-medium px-1 pb-2">Jumlah (Kg)</th>
              <th className="font-medium px-1 pb-2">Luas Lahan (Ha)</th>
              <th className="font-medium px-1 pb-2">Lokasi</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i} className="border-t border-black/5">
                <td className="px-1 py-2.5 font-medium text-ink-900">{row.petani}</td>
                <td className="px-1 py-2.5 text-ink-900/70">{row.jenis}</td>
                <td className="px-1 py-2.5 text-ink-900/70">{row.tanggal}</td>
                <td className="px-1 py-2.5 text-ink-900/70">{row.jumlah}</td>
                <td className="px-1 py-2.5 text-ink-900/70">{row.luas}</td>
                <td className="px-1 py-2.5 text-ink-900/70">{row.lokasi}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button className="mt-3 self-end text-xs font-medium text-blue-600 hover:underline">
        Lihat Semua Data
      </button>
    </div>
  );
}
