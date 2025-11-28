"use client";

import { motion } from "framer-motion";
import type { ZoneData } from "@/types";

interface DataHeaderProps {
  zones: ZoneData[];
  selectedZoneId: string;
  isRealTime: boolean;
  onZoneSelect: (zoneId: string) => void;
  onToggleRealTime: () => void;
}

const DataHeader = ({
  zones,
  selectedZoneId,
  isRealTime,
  onZoneSelect,
  onToggleRealTime,
}: DataHeaderProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6 sm:mb-8"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
        <div className="w-full sm:w-auto">
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-800 lg:text-4xl text-center sm:text-left">
            Grafik Real-time
          </h1>
          <p className="mt-2 text-sm sm:text-base text-neutral-600 text-center sm:text-left">
            Visualisasi data historis sensor lahan Anda
          </p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
          {isRealTime && (
            <div className="flex items-center gap-2 rounded-full bg-green-100 px-4 py-2">
              <div className="h-2 w-2 animate-pulse rounded-full bg-green-500"></div>
              <span className="text-sm font-medium text-green-700">
                Live
              </span>
            </div>
          )}
          <button
            onClick={onToggleRealTime}
            className={`rounded-lg px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold transition-all ${
              isRealTime
                ? "bg-red-100 text-red-700 hover:bg-red-200"
                : "bg-green-100 text-green-700 hover:bg-green-200"
            }`}
          >
            {isRealTime ? "Pause" : "Resume"}
          </button>
        </div>
      </div>

      {/* Zone Selector */}
      <div className="flex flex-wrap gap-2">
        {zones.map((zone) => (
          <button
            key={zone.id}
            onClick={() => onZoneSelect(zone.id)}
            className={`rounded-lg border-2 px-4 py-2 text-sm font-medium transition-all ${
              selectedZoneId === zone.id
                ? "border-green-500 bg-green-50 text-green-700"
                : "border-neutral-200 bg-white text-neutral-700 hover:border-green-300"
            }`}
          >
            <div className="flex items-center gap-2">
              <span>{zone.name}</span>
              <div
                className={`h-2 w-2 rounded-full ${
                  zone.status === "online" ? "bg-green-500" : "bg-red-500"
                }`}
              />
            </div>
          </button>
        ))}
      </div>
    </motion.div>
  );
};

export default DataHeader;

