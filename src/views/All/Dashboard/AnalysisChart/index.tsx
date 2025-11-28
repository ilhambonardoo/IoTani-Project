"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";
import type { PieLabelRenderProps } from "recharts";

const AnalysisChart = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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
      <div className="h-64 sm:h-72 md:h-80 w-full">
        <ResponsiveContainer width="100%" height="100%" minHeight={256}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={70}
              paddingAngle={4}
              label={
                !isMobile
                  ? (labelProps: PieLabelRenderProps) => {
                      const { name, percent = 0 } = labelProps;
                      const percentValue = typeof percent === 'number' ? percent : 0;
                      return `${name}: ${(percentValue * 100).toFixed(0)}%`;
                    }
                  : false
              }
            >
              {data.map((entry, index) => {
                const colors = ["#22c55e", "#3b82f6", "#f59e0b", "#94a3b8"];
                return (
                  <Cell
                    key={`cell-${index}`}
                    fill={colors[index % colors.length]}
                  />
                );
              })}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#f9fafb",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                fontSize: "12px",
              }}
            />
            <Legend wrapperStyle={{ fontSize: "12px" }} iconSize={12} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default AnalysisChart;
