"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import { downloadCSV, downloadPDF } from "@/lib/utils/exportData";
import {
  generateData,
  generateNewDataPointTable,
  type SensorDataPoint,
} from "@/lib/utils/sensorDataGenerator";
import ExportHeader from "./ExportHeader";
import FilterCard from "./FilterCard";
import DataTable from "./DataTable";

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

  const generateMockData = (count: number): SensorDataPoint[] => {
    return Array.from({ length: count }, () => generateNewDataPointTable());
  };

  useEffect(() => {
    setMounted(true);
    setTableData(generateData(30));
  }, []);

  const filteredData = useMemo(() => {
    if (!mounted) return [];

    let filtered = [...tableData];

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
        <ExportHeader />

        <FilterCard
          dateRange={dateRange}
          dataType={dataType}
          exportFormat={exportFormat}
          isLoading={isLoading}
          filteredDataLength={filteredData.length}
          onDateRangeChange={setDateRange}
          onDataTypeChange={setDataType}
          onExportFormatChange={setExportFormat}
          onRefresh={handleRefreshData}
          onExport={handleExport}
        />

        <DataTable filteredData={filteredData} />

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








