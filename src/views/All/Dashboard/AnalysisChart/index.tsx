"use client";

import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

const AnalysisChart = () => {
  const data = [
    { name: "Sehat", value: 70 },
    { name: "Hama (Thrips)", value: 15 },
    { name: "Penyakit (Antraknosa)", value: 10 },
    { name: "Lainnya", value: 5 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-white p-4 sm:p-6 shadow-lg w-full transition-all hover:shadow-xl md:col-span-2 lg:col-span-3"
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-neutral-800">
          Analisis Hama & Penyakit (Data Dummy)
        </h2>
      </div>
      <div className="h-64 sm:h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={4}
            >
              <Cell fill="#22c55e" />
              <Cell fill="#3b82f6" />
              <Cell fill="#f59e0b" />
              <Cell fill="#94a3b8" />
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default AnalysisChart;
