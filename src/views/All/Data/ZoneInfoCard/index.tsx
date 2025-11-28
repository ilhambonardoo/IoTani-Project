"use client";

import { motion } from "framer-motion";
import type { ZoneData } from "@/types";

interface ZoneInfoCardProps {
  zone: ZoneData;
}

const ZoneInfoCard = ({ zone }: ZoneInfoCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-white p-4 sm:p-6 shadow-lg"
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-neutral-800">
          Sensor {zone.name} - {zone.location}
        </h2>
        <div className="flex items-center gap-2">
          <div
            className={`h-2 w-2 rounded-full ${
              zone.status === "online" ? "bg-green-500" : "bg-red-500"
            }`}
          />
          <span className="text-xs text-neutral-600">
            {zone.status === "online" ? "Online" : "Offline"}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default ZoneInfoCard;

