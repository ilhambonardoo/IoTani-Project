"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

// Data dummy (ganti ini dengan data dari API)
const data = [
  { name: "00:00", pH: 6.8, Kelembapan: 70 },
  { name: "04:00", pH: 6.9, Kelembapan: 72 },
  { name: "08:00", pH: 7.0, Kelembapan: 71 },
  { name: "12:00", pH: 6.9, Kelembapan: 68 },
  { name: "16:00", pH: 6.8, Kelembapan: 65 },
  { name: "20:00", pH: 6.8, Kelembapan: 69 },
];

export function DataChart() {
  return (
    <div className="rounded-2xl border border-gray-800 bg-black p-6">
      <h3 className="text-xl font-semibold text-white">Tren 24 Jam</h3>
      <div className="mt-6 h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} />
            <YAxis stroke="#9CA3AF" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1F2937",
                borderColor: "#374151",
              }}
            />
            <Line
              type="monotone"
              dataKey="pH"
              stroke="#A3E635" // Lime
              strokeWidth={2}
              dot={false}
              yAxisId={0}
            />
            <Line
              type="monotone"
              dataKey="Kelembapan"
              stroke="#60A5FA" // Blue
              strokeWidth={2}
              dot={false}
              yAxisId={0}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
