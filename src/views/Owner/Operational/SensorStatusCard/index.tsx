"use client";

import { motion } from "framer-motion";
import { FaExclamationTriangle } from "react-icons/fa";
import type { SensorStatus } from "@/types";

interface SensorStatusCardProps {
  sensors: SensorStatus[];
}

const SensorStatusCard = ({ sensors }: SensorStatusCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="rounded-2xl bg-white p-6 shadow-lg"
    >
      <h2 className="mb-6 text-xl font-semibold text-neutral-800">
        Status Sensor
      </h2>
      <div className="space-y-4">
        {sensors.map((sensor) => (
          <div
            key={sensor.id}
            className="rounded-lg border border-neutral-200 p-4"
          >
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-neutral-800">
                {sensor.name}
              </h3>
              <div
                className={`h-2 w-2 rounded-full ${
                  sensor.status === "online" ? "bg-green-500" : "bg-red-500"
                }`}
              />
            </div>
            {sensor.status === "online" ? (
              <>
                <p className="text-lg font-bold text-neutral-800">
                  {sensor.value}
                  {sensor.type === "pH"
                    ? ""
                    : sensor.type === "moisture"
                    ? "%"
                    : "°C"}
                </p>
                <p className="mt-1 text-xs text-neutral-400">
                  {sensor.lastReading}
                </p>
              </>
            ) : (
              <div className="flex items-center gap-2 text-red-600">
                <FaExclamationTriangle size={14} />
                <span className="text-sm">Offline</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default SensorStatusCard;



