"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { FiCalendar, FiDownload, FiFileText, FiFile } from "react-icons/fi";
import { FaTemperatureHigh, FaTint, HiOutlineChartBar } from "react-icons/fa";

const ExportPage = () => {
  const [dateRange, setDateRange] = useState({
    start: "",
    end: "",
  });
  const [dataType, setDataType] = useState("all");
  const [exportFormat, setExportFormat] = useState<"pdf" | "csv">("pdf");

  const dataTypes = [
    { value: "all", label: "Semua Data", icon: <HiOutlineChartBar size={20} /> },
    { value: "temperature", label: "Suhu Tanah", icon: <FaTemperatureHigh size={20} /> },
    { value: "moisture", label: "Kelembapan", icon: <FaTint size={20} /> },
    { value: "ph", label: "pH Tanah", icon: <HiOutlineChartBar size={20} /> },
  ];

  const handleExport = () => {
    if (!dateRange.start || !dateRange.end) {
      alert("Silakan pilih rentang tanggal terlebih dahulu");
      return;
    }
    alert(`Mengekspor data ${dataType} dari ${dateRange.start} hingga ${dateRange.end} sebagai ${exportFormat.toUpperCase()}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 p-6 lg:p-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-neutral-800 lg:text-4xl">
            Export Database Real-time
          </h1>
          <p className="mt-2 text-neutral-600">
            Ekspor data sensor dan operasional dalam format PDF atau CSV
          </p>
        </motion.div>

        {/* Export Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-white p-8 shadow-lg"
        >
          {/* Date Range */}
          <div className="mb-6">
            <label className="mb-3 block text-lg font-semibold text-neutral-800">
              <FiCalendar className="mr-2 inline" />
              Rentang Tanggal
            </label>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-600">
                  Dari Tanggal
                </label>
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, start: e.target.value })
                  }
                  className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-3 text-neutral-800 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/50"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-600">
                  Sampai Tanggal
                </label>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, end: e.target.value })
                  }
                  className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-3 text-neutral-800 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/50"
                />
              </div>
            </div>
          </div>

          {/* Data Type */}
          <div className="mb-6">
            <label className="mb-3 block text-lg font-semibold text-neutral-800">
              Tipe Data
            </label>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {dataTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setDataType(type.value)}
                  className={`flex items-center gap-3 rounded-lg border-2 p-4 text-left transition-all ${
                    dataType === type.value
                      ? "border-green-500 bg-green-50"
                      : "border-neutral-200 bg-white hover:border-green-300"
                  }`}
                >
                  <div
                    className={`${
                      dataType === type.value ? "text-green-600" : "text-neutral-400"
                    }`}
                  >
                    {type.icon}
                  </div>
                  <span
                    className={`font-medium ${
                      dataType === type.value
                        ? "text-green-700"
                        : "text-neutral-700"
                    }`}
                  >
                    {type.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Export Format */}
          <div className="mb-6">
            <label className="mb-3 block text-lg font-semibold text-neutral-800">
              Format Export
            </label>
            <div className="flex gap-4">
              <button
                onClick={() => setExportFormat("pdf")}
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg border-2 p-4 transition-all ${
                  exportFormat === "pdf"
                    ? "border-green-500 bg-green-50"
                    : "border-neutral-200 bg-white hover:border-green-300"
                }`}
              >
                <FiFileText
                  size={24}
                  className={exportFormat === "pdf" ? "text-green-600" : "text-neutral-400"}
                />
                <span
                  className={`font-medium ${
                    exportFormat === "pdf" ? "text-green-700" : "text-neutral-700"
                  }`}
                >
                  PDF
                </span>
              </button>
              <button
                onClick={() => setExportFormat("csv")}
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg border-2 p-4 transition-all ${
                  exportFormat === "csv"
                    ? "border-green-500 bg-green-50"
                    : "border-neutral-200 bg-white hover:border-green-300"
                }`}
              >
                <FiFile
                  size={24}
                  className={exportFormat === "csv" ? "text-green-600" : "text-neutral-400"}
                />
                <span
                  className={`font-medium ${
                    exportFormat === "csv" ? "text-green-700" : "text-neutral-700"
                  }`}
                >
                  CSV
                </span>
              </button>
            </div>
          </div>

          {/* Export Button */}
          <motion.button
            onClick={handleExport}
            className="w-full rounded-lg bg-gradient-to-r from-green-500 to-green-600 px-6 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:from-green-600 hover:to-green-700 hover:shadow-xl"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FiDownload className="mr-2 inline" size={20} />
            Export ke {exportFormat.toUpperCase()}
          </motion.button>
        </motion.div>

        {/* Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 rounded-lg bg-blue-50 border border-blue-200 p-4"
        >
          <p className="text-sm text-blue-800">
            <strong>Catatan:</strong> Data yang diekspor akan mencakup semua data sensor
            dalam rentang tanggal yang dipilih. Proses export mungkin memakan waktu
            beberapa menit tergantung jumlah data.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default ExportPage;

