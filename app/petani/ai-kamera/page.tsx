import AiCameraCard from "@/components/AiCameraCard";

export default function Page() {
  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">AI Kamera & Deteksi Live</h1>
        <p className="text-xs text-slate-500">
          Pantau kondisi tanaman secara langsung menggunakan streaming kamera atau jepret foto.
        </p>
      </div>

      {/* Memanggil Komponen Kamera YOLO Kamu */}
      <AiCameraCard />
    </div>
  );
}