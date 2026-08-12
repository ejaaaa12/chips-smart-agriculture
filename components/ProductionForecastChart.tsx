"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function ProductionForecastChart({
  data,
}: {
  data: { month: string; produksi: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef1ef" />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 12, fill: "#6b7d70" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 12, fill: "#6b7d70" }}
          axisLine={false}
          tickLine={false}
          domain={[0, 800]}
        />
        <Tooltip
          formatter={(value: number) => [`${value} Ton`, "Prediksi Produksi"]}
          contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 12 }}
        />
        <Line
          type="monotone"
          dataKey="produksi"
          stroke="#3b82f6"
          strokeWidth={2}
          dot={{ r: 4, fill: "#3b82f6", strokeWidth: 0 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
