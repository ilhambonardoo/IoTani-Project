"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { FaRobot, FaWifi, FaBatteryFull, FaExclamationTriangle } from "react-icons/fa";
import { IoMdRefresh } from "react-icons/io";
import { HiOutlineClock } from "react-icons/hi";

interface RobotStatus {
  id: string;
  name: string;
  status: "moving" | "spraying" | "charging" | "offline" | "idle";
  battery: number;
  location: string;
  lastUpdate: string;
}

interface SensorStatus {
  id: string;
  name: string;
  type: "pH" | "moisture" | "temperature";
  status: "online" | "offline";
  lastReading: string;
  value: number;
}

interface ActivityLog {
  id: number;
  robot: string;
  action: string;
  zone: string;
  timestamp: string;
}

const OperationalStatusPage = () => {
  const [robots] = useState<RobotStatus[]>([
    {
      id: "1",
      name: "Robot Semprot A",
      status: "spraying",
      battery: 85,
      location: "Zona A",
      lastUpdate: "2 menit lalu",
    },
    {
      id: "2",
      name: "Robot Siram B",
      status: "moving",
      battery: 92,
      location: "Zona B",
      lastUpdate: "5 menit lalu",
    },
    {
      id: "3",
      name: "Robot Semprot C",
      status: "charging",
      battery: 45,
      location: "Stasiun Pengisian",
      lastUpdate: "10 menit lalu",
    },
    {
      id: "4",
      name: "Robot Siram D",
      status: "offline",
      battery: 0,
      location: "Zona D",
      lastUpdate: "1 jam lalu",
    },
  ]);

  const [sensors] = useState<SensorStatus[]>([
    {
      id: "1",
      name: "Sensor pH Zona A",
      type: "pH",
      status: "online",
      lastReading: "1 menit lalu",
      value: 6.8,
    },
    {
      id: "2",
      name: "Sensor Kelembapan Zona B",
      type: "moisture",
      status: "online",
      lastReading: "2 menit lalu",
      value: 65,
    },
    {
      id: "3",
      name: "Sensor Suhu Zona C",
      type: "temperature",
      status: "offline",
      lastReading: "15 menit lalu",
      value: 0,
    },
  ]);

  const [activityLogs] = useState<ActivityLog[]>([
    {
      id: 1,
      robot: "Robot Semprot A",
      action: "Selesai menyiram",
      zone: "Zona A",
      timestamp: "10:05",
    },
    {
      id: 2,
      robot: "Robot Siram B",
      action: "Mulai bergerak ke",
      zone: "Zona B",
      timestamp: "09:45",
    },
    {
      id: 3,
      robot: "Robot Semprot C",
      action: "Mulai mengisi daya",
      zone: "Stasiun Pengisian",
      timestamp: "09:30",
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "spraying":
        return "bg-blue-500";
      case "moving":
        return "bg-green-500";
      case "charging":
        return "bg-yellow-500";
      case "offline":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "spraying":
        return "Menyemprot";
      case "moving":
        return "Bergerak";
      case "charging":
        return "Mengisi Daya";
      case "offline":
        return "Offline";
      default:
        return "Diam";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-neutral-800 lg:text-4xl">
            Status Operasional
          </h1>
          <p className="mt-2 text-neutral-600">
            Pantau status real-time semua aset dan peralatan
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Robot Status */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 rounded-2xl bg-white p-6 shadow-lg"
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-neutral-800">
                Status Robot
              </h2>
              <button className="rounded-lg bg-green-500 p-2 text-white transition-all hover:bg-green-600">
                <IoMdRefresh size={20} />
              </button>
            </div>
            <div className="space-y-4">
              {robots.map((robot) => (
                <div
                  key={robot.id}
                  className="rounded-lg border border-neutral-200 p-4 transition-all hover:bg-neutral-50"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className={`rounded-lg p-3 ${getStatusColor(robot.status)}`}
                      >
                        <FaRobot className="text-white" size={24} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-neutral-800">
                          {robot.name}
                        </h3>
                        <p className="text-sm text-neutral-600">{robot.location}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium text-white ${getStatusColor(
                          robot.status
                        )}`}
                      >
                        {getStatusText(robot.status)}
                      </span>
                      <div className="mt-2 flex items-center gap-2">
                        <FaBatteryFull
                          className={
                            robot.battery > 50
                              ? "text-green-500"
                              : robot.battery > 20
                              ? "text-yellow-500"
                              : "text-red-500"
                          }
                          size={16}
                        />
                        <span className="text-sm text-neutral-600">
                          {robot.battery}%
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-neutral-400">
                        {robot.lastUpdate}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Sensor Status */}
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
                        {sensor.type === "pH" ? "" : sensor.type === "moisture" ? "%" : "°C"}
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

          {/* Activity Log */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-3 rounded-2xl bg-white p-6 shadow-lg"
          >
            <div className="mb-6 flex items-center gap-2">
              <HiOutlineClock className="text-green-600" size={24} />
              <h2 className="text-xl font-semibold text-neutral-800">Log Aktivitas</h2>
            </div>
            <div className="space-y-3">
              {activityLogs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between rounded-lg border border-neutral-200 p-3"
                >
                  <div>
                    <p className="font-medium text-neutral-800">
                      {log.robot} {log.action} {log.zone}
                    </p>
                  </div>
                  <span className="text-sm text-neutral-500">{log.timestamp}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default OperationalStatusPage;

