"use client";

import { useState } from "react";
import { Video, Smartphone } from "lucide-react";

export default function AiCameraCard() {
  // 🟢 STATE UNTUK IP CAMERA HP & SOURCE STREAM
  const [streamSource, setStreamSource] = useState<"usb" | "ip">("ip");
  const [ipHp, setIpHp] = useState("192.168.1.29:8080");

  const RASPI_IP = "100.97.117.87:8000"; // IP Raspberry Pi kamu

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-slate-800 text-base">Streaming Kamera YOLO</h3>
          <p className="text-xs text-slate-400">Pemantauan deteksi objek secara langsung</p>
        </div>
      </div>

      {/* --- LIVE STREAMING CONTROLS & DISPLAY --- */}
      <div className="space-y-3">
        {/* Controls Pilihan Source Camera */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
          <div className="flex items-center gap-1.5 bg-slate-200/60 p-1 rounded-lg w-full sm:w-auto">
            <button
              onClick={() => setStreamSource("ip")}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                streamSource === "ip"
                  ? "bg-white text-emerald-600 shadow-sm"
                  : "text-slate-600"
              }`}
            >
              <Smartphone size={14} /> IP Camera HP
            </button>
            <button
              onClick={() => setStreamSource("usb")}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                streamSource === "usb"
                  ? "bg-white text-emerald-600 shadow-sm"
                  : "text-slate-600"
              }`}
            >
              <Video size={14} /> USB Webcam RasPi
            </button>
          </div>

          {/* Input Alamat IP HP (Aktif jika mode IP Camera) */}
          {streamSource === "ip" && (
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-[11px] font-semibold text-slate-500 shrink-0">
                IP HP:
              </span>
              <input
                type="text"
                value={ipHp}
                onChange={(e) => setIpHp(e.target.value)}
                placeholder="192.168.1.29:8080"
                className="text-xs bg-white border border-slate-300 rounded-lg px-2.5 py-1 w-full sm:w-36 font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          )}
        </div>

        {/* Area Video Feed Stream */}
        <div className="aspect-video rounded-xl bg-slate-900 overflow-hidden relative border border-slate-800">
          <img
            src={
              streamSource === "ip"
                ? `http://${RASPI_IP}/video-feed-ip?ip=${ipHp}`
                : `http://${RASPI_IP}/video-feed`
            }
            alt="Live Stream YOLO AI"
            className="w-full h-full object-cover"
          />
        </div>

        <p className="text-[11px] text-slate-400 text-center">
          {streamSource === "ip"
            ? `Streaming langsung dari HP (${ipHp}) via IP Webcam`
            : "Streaming langsung dari Webcam USB Raspberry Pi"}
        </p>
      </div>
    </div>
  );
}