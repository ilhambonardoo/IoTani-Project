"use client";

import { AnimatedChart } from "@/components/features/AnimatedChart";
import type { SensorDataPoint } from "@/lib/utils/sensorDataGenerator";

interface ChartSectionProps {
  chartData: SensorDataPoint[];
  mounted: boolean;
}

const ChartSection = ({ chartData, mounted }: ChartSectionProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      <AnimatedChart
        title="📊 Suhu Tanah"
        data={mounted ? chartData : []}
        animationSpeed="slow"
        lines={[
          {
            key: "suhu",
            color: "#3b82f6",
            name: "Suhu (°C)",
          },
        ]}
      />

      <AnimatedChart
        title="💧 Kelembapan Tanah"
        data={mounted ? chartData : []}
        animationSpeed="slow"
        lines={[
          {
            key: "kelembapan",
            color: "#22c55e",
            name: "Kelembapan (%)",
          },
        ]}
      />

      <AnimatedChart
        title="🧪 pH Tanah"
        data={mounted ? chartData : []}
        animationSpeed="slow"
        lines={[
          {
            key: "pH",
            color: "#f97316",
            name: "pH",
          },
        ]}
      />

      <AnimatedChart
        title="📈 Semua Data"
        data={mounted ? chartData : []}
        animationSpeed="slow"
        lines={[
          {
            key: "suhu",
            color: "#3b82f6",
            name: "Suhu (°C)",
          },
          {
            key: "kelembapan",
            color: "#22c55e",
            name: "Kelembapan (%)",
          },
          {
            key: "pH",
            color: "#f97316",
            name: "pH",
          },
        ]}
      />
    </div>
  );
};

export default ChartSection;
