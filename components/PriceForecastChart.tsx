"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function PriceForecastChart({
  data,
}: {
  data: { month: string; harga: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <defs>
          <linearGradient id="priceFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2ea34d" stopOpacity={0.25} />
            <stop offset="100%" stopColor="#2ea34d" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef1ef" />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 12, fill: "#6b7d70" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tickFormatter={(v) => `${v / 1000}K`}
          tick={{ fontSize: 12, fill: "#6b7d70" }}
          axisLine={false}
          tickLine={false}
          domain={[40000, 60000]}
        />
        <Tooltip
          formatter={(value: number) => [`Rp${value.toLocaleString("id-ID")}`, "Prediksi Harga"]}
          contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 12 }}
        />
        <Area
          type="monotone"
          dataKey="harga"
          stroke="#2ea34d"
          strokeWidth={2}
          fill="url(#priceFill)"
          dot={{ r: 4, fill: "#2ea34d", strokeWidth: 0 }}
          activeDot={{ r: 6 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
