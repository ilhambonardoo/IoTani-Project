"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useMemo } from "react";
import {
  FiCalendar,
  FiDownload,
  FiFileText,
  FiFile,
  FiRefreshCcw,
} from "react-icons/fi";
import { FaTemperatureHigh, FaTint } from "react-icons/fa";
import { HiOutlineChartBar } from "react-icons/hi";
import { downloadCSV, downloadPDF } from "@/lib/utils/exportData";
import { toast } from "react-toastify";
import {
  generateData,
  generateNewDataPointTable,
  type SensorDataPoint,
} from "@/lib/utils/sensorDataGenerator";

const ExportPage = () => {
  const [dateRange, setDateRange] = useState({
    start: "",
    end: "",
  });
  const [dataType, setDataType] = useState("all");
  const [exportFormat, setExportFormat] = useState<"pdf" | "csv">("pdf");

  const [tableData, setTableData] = useState<SensorDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTableData((prevData) => {
        const newDataPoint = generateNewDataPointTable();
        const updateData = [...prevData, newDataPoint];
        return updateData.length > 100 ? updateData.slice(-100) : updateData;
      });
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  // Ini untuk refresh button
  const generateMockData = (count: number): SensorDataPoint[] => {
    return Array.from({ length: count }, () => generateNewDataPointTable());
  };

  useEffect(() => {
    setMounted(true);
    setTableData(generateData(30));
  }, []);

  const dataTypes = [
    {
      value: "all",
      label: "Semua Data",
      icon: <HiOutlineChartBar size={20} />,
    },
    {
      value: "temperature",
      label: "Suhu Tanah",
      icon: <FaTemperatureHigh size={20} />,
    },
    { value: "moisture", label: "Kelembapan", icon: <FaTint size={20} /> },
    { value: "pH", label: "pH Tanah", icon: <HiOutlineChartBar size={20} /> },
  ];

  const filteredData = useMemo(() => {
    if (!mounted) return [];

    let filtered = [...tableData];

    // Filter by date range if provided
    if (dateRange.start && dateRange.end) {
      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);

      filtered = filtered.filter((item) => {
        const itemDate = new Date(item.date.split(" ").join(" "));
        return itemDate >= startDate && itemDate <= endDate;
      });
    }

    return filtered;
  }, [tableData, dateRange, mounted]);

  const handleRefreshData = () => {
    setIsLoading(true);
    setTimeout(() => {
      setTableData(generateMockData(30));
      toast.success("✅ Data diperbarui");
      setIsLoading(false);
    }, 500);
  };

  const handleExport = () => {
    if (filteredData.length === 0) {
      toast.error("❌ Tidak ada data untuk diexport");
      return;
    }

    try {
      if (exportFormat === "csv") {
        downloadCSV(filteredData, dataType);
        toast.success("✅ Data berhasil diexport ke CSV");
      } else {
        downloadPDF(filteredData, dataType);
        toast.success("✅ Data berhasil diexport ke PDF");
      }
    } catch {
      toast.error("❌ Gagal mengexport data");
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 p-4 sm:p-6 lg:p-8 pt-16 md:pt-4">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-800 lg:text-4xl text-center md:text-left">
            Export Database Real-time
          </h1>
          <p className="mt-2 text-sm sm:text-base text-neutral-600 text-center md:text-left">
            Ekspor data sensor dan operasional dalam format PDF atau CSV
          </p>
        </motion.div>

        {/* Filters Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 rounded-2xl bg-white p-6 shadow-lg"
        >
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Date Range */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-neutral-700">
                <FiCalendar className="mr-1 inline" />
                Dari Tanggal
              </label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) =>
                  setDateRange({ ...dateRange, start: e.target.value })
                }
                className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-neutral-800 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/50"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-neutral-700">
                Sampai Tanggal
              </label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) =>
                  setDateRange({ ...dateRange, end: e.target.value })
                }
                className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-neutral-800 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/50"
              />
            </div>

            {/* Data Type */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-neutral-700">
                Tipe Data
              </label>
              <select
                value={dataType}
                onChange={(e) => setDataType(e.target.value)}
                className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-neutral-800 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/50"
              >
                {dataTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={handleRefreshData}
              disabled={isLoading}
              className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-blue-600 disabled:opacity-50"
            >
              <FiRefreshCcw
                size={16}
                className={isLoading ? "animate-spin" : ""}
              />
              Refresh Data
            </button>

            <div className="flex gap-2 ml-auto">
              <button
                onClick={() => setExportFormat("csv")}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                  exportFormat === "csv"
                    ? "bg-green-500 text-white"
                    : "bg-neutral-200 text-neutral-700 hover:bg-neutral-300"
                }`}
              >
                <FiFile size={16} />
                CSV
              </button>
              <button
                onClick={() => setExportFormat("pdf")}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                  exportFormat === "pdf"
                    ? "bg-green-500 text-white"
                    : "bg-neutral-200 text-neutral-700 hover:bg-neutral-300"
                }`}
              >
                <FiFileText size={16} />
                PDF
              </button>

              <motion.button
                onClick={handleExport}
                disabled={filteredData.length === 0}
                className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-green-500 to-green-600 px-6 py-2 text-sm font-medium text-white transition-all hover:from-green-600 hover:to-green-700 disabled:opacity-50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiDownload size={16} />
                Export {exportFormat.toUpperCase()}
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Data Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl bg-white shadow-lg overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Tanggal
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Suhu (°C)
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Kelembapan (%)
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    pH
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {filteredData.length > 0 ? (
                  filteredData.map((row, idx) => (
                    <motion.tr
                      key={idx}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.02 }}
                      className="hover:bg-green-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm text-neutral-700">
                        {row.date}
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-700">
                        <span className="inline-block bg-red-100 text-red-700 px-3 py-1 rounded-full">
                          {row.suhu.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-700">
                        <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                          {row.kelembapan.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-700">
                        <span className="inline-block bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
                          {row.pH.toFixed(2)}
                        </span>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-8 text-center text-neutral-500"
                    >
                      Tidak ada data untuk ditampilkan
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          {filteredData.length > 0 && (
            <div className="border-t border-neutral-200 bg-neutral-50 px-6 py-4">
              <p className="text-sm text-neutral-600">
                Total: <strong>{filteredData.length}</strong> baris data
              </p>
            </div>
          )}
        </motion.div>

        {/* Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 rounded-lg bg-blue-50 border border-blue-200 p-4"
        >
          <p className="text-sm text-blue-800">
            <strong>💡 Tips:</strong> Pilih rentang tanggal untuk memfilter
            data, kemudian pilih format export (CSV untuk spreadsheet atau PDF
            untuk laporan). Format CSV cocok untuk analisis lebih lanjut di
            Excel.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default ExportPage;
