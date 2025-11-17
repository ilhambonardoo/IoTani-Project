"use client";

import { motion, AnimatePresence } from "framer-motion";
import { FaExclamationTriangle, FaExclamationCircle, FaTimes } from "react-icons/fa";

interface SensorAlertProps {
  type: "warning" | "critical";
  sensor: "pH" | "moisture" | "temperature";
  message: string;
  value: number;
  unit: string;
  onClose?: () => void;
  showCloseButton?: boolean;
}

const SensorAlert = ({
  type,
  sensor,
  message,
  value,
  unit,
  onClose,
  showCloseButton = false,
}: SensorAlertProps) => {
  const sensorNames = {
    pH: "pH Tanah",
    moisture: "Kelembaban Tanah",
    temperature: "Suhu Tanah",
  };

  const sensorIcons = {
    pH: "⚗️",
    moisture: "💧",
    temperature: "🌡️",
  };

  const alertConfig = {
    warning: {
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-400",
      textColor: "text-yellow-800",
      iconColor: "text-yellow-600",
      icon: <FaExclamationTriangle className="text-yellow-600" size={20} />,
    },
    critical: {
      bgColor: "bg-red-50",
      borderColor: "border-red-400",
      textColor: "text-red-800",
      iconColor: "text-red-600",
      icon: <FaExclamationCircle className="text-red-600" size={20} />,
    },
  };

  const config = alertConfig[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      className={`rounded-lg border-2 ${config.borderColor} ${config.bgColor} p-4 shadow-lg`}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex-shrink-0">
          <span className="text-2xl">{sensorIcons[sensor]}</span>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            {config.icon}
            <h3 className={`font-semibold ${config.textColor}`}>
              {sensorNames[sensor]} - {type === "critical" ? "KRITIS" : "PERINGATAN"}
            </h3>
          </div>
          <p className={`text-sm ${config.textColor} mb-2`}>{message}</p>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-medium px-2 py-1 rounded ${config.bgColor} ${config.textColor} border ${config.borderColor}`}>
              Nilai: {value}{unit}
            </span>
            {type === "critical" && (
              <span className="text-xs font-semibold px-2 py-1 rounded bg-red-600 text-white animate-pulse">
                TINDAKAN SEGERA DIPERLUKAN
              </span>
            )}
          </div>
        </div>
        {showCloseButton && onClose && (
          <button
            onClick={onClose}
            className={`flex-shrink-0 ${config.textColor} hover:${config.iconColor} transition-colors`}
            aria-label="Tutup notifikasi"
          >
            <FaTimes size={16} />
          </button>
        )}
      </div>
    </motion.div>
  );
};

interface SensorAlertBannerProps {
  alerts: Array<{
    id: string;
    type: "warning" | "critical";
    sensor: "pH" | "moisture" | "temperature";
    message: string;
    value: number;
    unit: string;
    severity: "low" | "medium" | "high";
  }>;
  onClose?: (id: string) => void;
}

export const SensorAlertBanner = ({ alerts, onClose }: SensorAlertBannerProps) => {
  // Sort alerts: critical first, then warning
  const sortedAlerts = [...alerts].sort((a, b) => {
    if (a.type === "critical" && b.type !== "critical") return -1;
    if (a.type !== "critical" && b.type === "critical") return 1;
    return 0;
  });

  if (alerts.length === 0) return null;

  return (
    <div className="mb-6 space-y-3">
      <AnimatePresence mode="popLayout">
        {sortedAlerts.map((alert) => (
          <SensorAlert
            key={alert.id}
            type={alert.type}
            sensor={alert.sensor}
            message={alert.message}
            value={alert.value}
            unit={alert.unit}
            onClose={onClose ? () => onClose(alert.id) : undefined}
            showCloseButton={!!onClose}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default SensorAlert;

