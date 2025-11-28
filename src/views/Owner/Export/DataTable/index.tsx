"use client";

import { motion } from "framer-motion";
import type { SensorDataPoint } from "@/lib/utils/sensorDataGenerator";

interface DataTableProps {
  filteredData: SensorDataPoint[];
}

const DataTable = ({ filteredData }: DataTableProps) => {
  return (
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

      {filteredData.length > 0 && (
        <div className="border-t border-neutral-200 bg-neutral-50 px-6 py-4">
          <p className="text-sm text-neutral-600">
            Total: <strong>{filteredData.length}</strong> baris data
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default DataTable;







