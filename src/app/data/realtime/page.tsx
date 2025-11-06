"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { FiCalendar, FiDownload } from "react-icons/fi";
import { FaTemperatureHigh, FaTint, HiOutlineChartBar } from "react-icons/fa";

// Mock data generator
const generateData = (days: number) => {
  const data = [];
  const today = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toLocaleDateString("id-ID", { day: "2-digit", month: "short" }),
      suhu: 25 + Math.random() * 5,
      kelembapan: 60 + Math.random() * 20,
      pH: 6.5 + Math.random() * 1,
    });
  }
  return data;
};

const RealtimeChartsPage = () => {
  const [dateRange, setDateRange] = useState<"daily" | "weekly" | "monthly">("daily");
  const [chartData, setChartData] = useState(generateData(7));

  const handleDateRangeChange = (range: "daily" | "weekly" | "monthly") => {
    setDateRange(range);
    const days = range === "daily" ? 7 : range === "weekly" ? 30 : 90;
    setChartData(generateData(days));
  };

  const handleExport = (format: "pdf" | "csv") => {
    // Export functionality would go here
    alert(`Exporting data as ${format.toUpperCase()}...`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-neutral-800 lg:text-4xl">
            Grafik Real-time
          </h1>
          <p className="mt-2 text-neutral-600">
            Visualisasi data historis sensor lahan Anda
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex flex-wrap items-center gap-4 rounded-2xl bg-white p-4 shadow-lg"
        >
          <div className="flex items-center gap-2">
            <FiCalendar className="text-green-600" size={20} />
            <span className="font-medium text-neutral-700">Rentang Waktu:</span>
          </div>
          <div className="flex gap-2">
            {(["daily", "weekly", "monthly"] as const).map((range) => (
              <button
                key={range}
                onClick={() => handleDateRangeChange(range)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                  dateRange === range
                    ? "bg-green-500 text-white shadow-md"
                    : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                }`}
              >
                {range === "daily"
                  ? "Harian"
                  : range === "weekly"
                  ? "Mingguan"
                  : "Bulanan"}
              </button>
            ))}
          </div>
          <div className="ml-auto flex gap-2">
            <button
              onClick={() => handleExport("pdf")}
              className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-blue-600"
            >
              <FiDownload size={16} />
              Export PDF
            </button>
            <button
              onClick={() => handleExport("csv")}
              className="flex items-center gap-2 rounded-lg bg-green-500 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-green-600"
            >
              <FiDownload size={16} />
              Export CSV
            </button>
          </div>
        </motion.div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Temperature Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-2xl bg-white p-6 shadow-lg"
          >
            <div className="mb-4 flex items-center gap-3">
              <FaTemperatureHigh className="text-blue-500" size={24} />
              <h2 className="text-xl font-semibold text-neutral-800">
                Suhu Tanah
              </h2>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="suhu"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ fill: "#3b82f6", r: 4 }}
                  name="Suhu (°C)"
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Moisture Chart */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-2xl bg-white p-6 shadow-lg"
          >
            <div className="mb-4 flex items-center gap-3">
              <FaTint className="text-blue-500" size={24} />
              <h2 className="text-xl font-semibold text-neutral-800">
                Kelembapan Tanah
              </h2>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="kelembapan"
                  stroke="#22c55e"
                  strokeWidth={2}
                  dot={{ fill: "#22c55e", r: 4 }}
                  name="Kelembapan (%)"
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* pH Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl bg-white p-6 shadow-lg lg:col-span-2"
          >
            <div className="mb-4 flex items-center gap-3">
              <HiOutlineChartBar className="text-green-500" size={24} />
              <h2 className="text-xl font-semibold text-neutral-800">
                pH Tanah
              </h2>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="pH"
                  stroke="#f97316"
                  strokeWidth={2}
                  dot={{ fill: "#f97316", r: 4 }}
                  name="pH"
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default RealtimeChartsPage;

