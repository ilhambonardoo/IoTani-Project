"use client";

import { motion } from "framer-motion";
import {
  FiCalendar,
  FiDownload,
  FiFileText,
  FiFile,
  FiRefreshCcw,
} from "react-icons/fi";
import { FaTemperatureHigh, FaTint } from "react-icons/fa";
import { HiOutlineChartBar } from "react-icons/hi";

interface FilterCardProps {
  dateRange: { start: string; end: string };
  dataType: string;
  exportFormat: "pdf" | "csv";
  isLoading: boolean;
  filteredDataLength: number;
  onDateRangeChange: (range: { start: string; end: string }) => void;
  onDataTypeChange: (type: string) => void;
  onExportFormatChange: (format: "pdf" | "csv") => void;
  onRefresh: () => void;
  onExport: () => void;
}

const FilterCard = ({
  dateRange,
  dataType,
  exportFormat,
  isLoading,
  filteredDataLength,
  onDateRangeChange,
  onDataTypeChange,
  onExportFormatChange,
  onRefresh,
  onExport,
}: FilterCardProps) => {
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6 rounded-2xl bg-white p-6 shadow-lg"
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div>
          <label className="mb-2 block text-sm font-semibold text-neutral-700">
            <FiCalendar className="mr-1 inline" />
            Dari Tanggal
          </label>
          <input
            type="date"
            value={dateRange.start}
            onChange={(e) =>
              onDateRangeChange({ ...dateRange, start: e.target.value })
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
              onDateRangeChange({ ...dateRange, end: e.target.value })
            }
            className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-neutral-800 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/50"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-neutral-700">
            Tipe Data
          </label>
          <select
            value={dataType}
            onChange={(e) => onDataTypeChange(e.target.value)}
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

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          onClick={onRefresh}
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
            onClick={() => onExportFormatChange("csv")}
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
            onClick={() => onExportFormatChange("pdf")}
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
            onClick={onExport}
            disabled={filteredDataLength === 0}
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
  );
};

export default FilterCard;







