"use client";

import { motion } from "framer-motion";
import { FaTemperatureHigh, FaTint } from "react-icons/fa";
import { HiOutlineChartBar } from "react-icons/hi";
import type { SensorData } from "@/types";

interface SensorStatus {
  status: "normal" | "warning" | "critical";
}

interface SensorStatusCardProps {
  sensorData: SensorData;
  selectedZone: { name: string; location: string };
  temperatureStatus: SensorStatus;
  moistureStatus: SensorStatus;
  pHStatus: SensorStatus;
}

const getSensorStatusColor = (status: "normal" | "warning" | "critical") => {
  switch (status) {
    case "normal":
      return "text-green-600";
    case "warning":
      return "text-yellow-600";
    case "critical":
      return "text-red-600";
  }
};

const SensorStatusCard = ({
  sensorData,
  selectedZone,
  temperatureStatus,
  moistureStatus,
  pHStatus,
}: SensorStatusCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-white p-4 sm:p-6 shadow-lg transition-all hover:shadow-xl lg:h-full"
    >
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-neutral-800">
            Status Sensor
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            {selectedZone.name} - {selectedZone.location}
          </p>
        </div>
        <div
          className={`h-3 w-3 rounded-full ${
            sensorData.status === "normal"
              ? "bg-green-500"
              : sensorData.status === "warning"
              ? "bg-yellow-500"
              : "bg-red-500"
          }`}
        />
      </div>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <FaTemperatureHigh
            className={getSensorStatusColor(temperatureStatus.status)}
            size={24}
          />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <p className="text-sm text-neutral-600">Suhu Tanah</p>
              {temperatureStatus.status !== "normal" && (
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded ${
                    temperatureStatus.status === "critical"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {temperatureStatus.status === "critical"
                    ? "KRITIS"
                    : "PERINGATAN"}
                </span>
              )}
            </div>
            <p
              className={`text-lg font-semibold ${getSensorStatusColor(
                temperatureStatus.status
              )}`}
            >
              {sensorData.temperature}°C
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <FaTint
            className={getSensorStatusColor(moistureStatus.status)}
            size={24}
          />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <p className="text-sm text-neutral-600">Kelembapan</p>
              {moistureStatus.status !== "normal" && (
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded ${
                    moistureStatus.status === "critical"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {moistureStatus.status === "critical"
                    ? "KRITIS"
                    : "PERINGATAN"}
                </span>
              )}
            </div>
            <p
              className={`text-lg font-semibold ${getSensorStatusColor(
                moistureStatus.status
              )}`}
            >
              {sensorData.moisture}%
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <HiOutlineChartBar
            className={getSensorStatusColor(pHStatus.status)}
            size={24}
          />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <p className="text-sm text-neutral-600">pH Tanah</p>
              {pHStatus.status !== "normal" && (
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded ${
                    pHStatus.status === "critical"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {pHStatus.status === "critical" ? "KRITIS" : "PERINGATAN"}
                </span>
              )}
            </div>
            <p
              className={`text-lg font-semibold ${getSensorStatusColor(
                pHStatus.status
              )}`}
            >
              {sensorData.pH.toFixed(1)}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SensorStatusCard;
