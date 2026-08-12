"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

export default function KabupatenDonutChart({
  data,
}: {
  data: { name: string; value: number; persen: number; color: string }[];
}) {
  return (
    <div className="flex items-center gap-6">
      <div className="w-full max-w-[220px]">
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={55}
              outerRadius={90}
              paddingAngle={2}
            >
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.color} stroke="none" />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number, name: string) => [`${value} Ton`, name]}
              contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 12 }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <ul className="space-y-2.5 text-sm">
        {data.map((d) => (
          <li key={d.name} className="flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: d.color }}
            />
            <span className="text-ink-900/70 min-w-[90px]">{d.name}</span>
            <span className="font-medium text-ink-900">{d.value} Ton</span>
            <span className="text-ink-900/40">({d.persen}%)</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
