"use client";

import { motion, type Variants } from "framer-motion";
import { useSession } from "next-auth/react";
import { useState, useEffect, useMemo } from "react";
import { WiDaySunny, WiRain, WiCloudy } from "react-icons/wi";
import { FaTemperatureHigh, FaTint, FaRobot } from "react-icons/fa";
import { IoMdNotifications } from "react-icons/io";
import { HiOutlineChartBar } from "react-icons/hi";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";
import { SensorAlertBanner } from "@/components/SensorAlert/SensorAlert";
import {
  getOverallSensorStatus,
  getAbnormalSensorNotifications,
  checkpHStatus,
  checkMoistureStatus,
  checkTemperatureStatus,
} from "@/lib/utils/sensorStatus";

interface WeatherData {
  temperature: number;
  humidity: number;
  condition: string;
  windSpeed: number;
}

interface SensorData {
  pH: number;
  moisture: number;
  temperature: number;
  status: "normal" | "warning" | "critical";
}

interface RobotStatus {
  id: string;
  name: string;
  status: "idle" | "moving" | "spraying" | "charging" | "offline";
  battery: number;
}

const DashboardPage = () => {
  const { data: session }: { session: String } = useSession();
  const [role, setRole] = useState("");
  const [weather, setWeather] = useState<WeatherData>({
    temperature: 28,
    humidity: 75,
    condition: "sunny",
    windSpeed: 12,
  });

  const [sensorData, setSensorData] = useState<SensorData>({
    pH: 4.2,
    moisture: 35,
    temperature: 38,
    status: "normal",
  });

  const overallStatus = useMemo(() => {
    return getOverallSensorStatus(
      sensorData.pH,
      sensorData.moisture,
      sensorData.temperature
    );
  }, [sensorData.pH, sensorData.moisture, sensorData.temperature]);

  const abnormalNotifications = useMemo(() => {
    return getAbnormalSensorNotifications(
      sensorData.pH,
      sensorData.moisture,
      sensorData.temperature
    );
  }, [sensorData.pH, sensorData.moisture, sensorData.temperature]);

  // Update sensor status when values change
  useEffect(() => {
    setSensorData((prev) => ({
      ...prev,
      status: overallStatus,
    }));
  }, [overallStatus]);

  // Get individual sensor status
  const pHStatus = checkpHStatus(sensorData.pH);
  const moistureStatus = checkMoistureStatus(sensorData.moisture);
  const temperatureStatus = checkTemperatureStatus(sensorData.temperature);

  const [robots] = useState<RobotStatus[]>([
    {
      id: "1",
      name: "Robot Semprot A",
      status: "spraying",
      battery: 85,
    },
    {
      id: "2",
      name: "Robot Siram B",
      status: "idle",
      battery: 92,
    },
  ]);

  // Combine abnormal sensor notifications with regular notifications
  const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([]);
  const [regularNotifications] = useState([
    {
      id: 1,
      message: "Robot Semprot A sedang bekerja di Zona 1",
      type: "info" as const,
      time: "15 menit lalu",
    },
  ]);

  // Filter out dismissed alerts
  const activeAlerts = abnormalNotifications.filter(
    (alert) => !dismissedAlerts.includes(alert.id)
  );

  // Handle alert dismissal
  const handleDismissAlert = (id: string) => {
    setDismissedAlerts((prev) => [...prev, id]);
  };

  // Combine all notifications
  const allNotifications = useMemo(() => {
    const sensorNotifs = activeAlerts.map((alert) => ({
      id: alert.id,
      message: alert.message,
      type:
        alert.type === "critical" ? ("error" as const) : ("warning" as const),
      time: "Baru saja",
    }));

    return [...sensorNotifs, ...regularNotifications];
  }, [activeAlerts, regularNotifications]);

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case "sunny":
        return <WiDaySunny size={48} className="text-yellow-500" />;
      case "rainy":
        return <WiRain size={48} className="text-blue-500" />;
      case "cloudy":
        return <WiCloudy size={48} className="text-gray-500" />;
      default:
        return <WiDaySunny size={48} className="text-yellow-500" />;
    }
  };

  const getRobotStatusColor = (status: string) => {
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

  const getRobotStatusText = (status: string) => {
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

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 100,
      },
    },
  };

  // Get sensor status colors
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          {role === "admin" || role === "owner" ? (
            <>
              <div>
                <h1 className="text-3xl font-bold text-neutral-800 lg:text-4xl">
                  Monitoring Kelembaban tanah
                </h1>
              </div>
            </>
          ) : (
            <>
              {" "}
              <h1 className="text-3xl font-bold text-neutral-800 lg:text-4xl">
                Selamat Datang, {session?.user?.fullName || "Pengguna"}! 👋
              </h1>
              <p className="mt-2 text-neutral-600">
                Pantau kondisi lahan Anda secara real-time
              </p>
            </>
          )}
        </motion.div>

        {/* Sensor Alert Banner */}
        {activeAlerts.length > 0 && (
          <SensorAlertBanner
            alerts={activeAlerts}
            onClose={handleDismissAlert}
          />
        )}

        {/* Main Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 gap-6 lg:grid-cols-3"
        >
          {/* Weather Card */}
          <motion.div
            variants={itemVariants}
            className="rounded-2xl bg-white p-6 shadow-lg transition-all hover:shadow-xl"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-neutral-800">Cuaca</h2>
              {getWeatherIcon(weather.condition)}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-neutral-600">Suhu</span>
                <span className="text-xl font-bold text-neutral-800">
                  {weather.temperature}°C
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-600">Kelembapan</span>
                <span className="text-xl font-bold text-neutral-800">
                  {weather.humidity}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-600">Angin</span>
                <span className="text-xl font-bold text-neutral-800">
                  {weather.windSpeed} km/h
                </span>
              </div>
            </div>
          </motion.div>

          {/* Sensor Status Card */}
          <motion.div
            variants={itemVariants}
            className="rounded-2xl bg-white p-6 shadow-lg transition-all hover:shadow-xl"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-neutral-800">
                Status Sensor
              </h2>
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
                        {pHStatus.status === "critical"
                          ? "KRITIS"
                          : "PERINGATAN"}
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

          {/* Robot Status Card */}
          <motion.div
            variants={itemVariants}
            className="rounded-2xl bg-white p-6 shadow-lg transition-all hover:shadow-xl"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-neutral-800">
                Status Robot
              </h2>
              <FaRobot className="text-green-500" size={24} />
            </div>
            <div className="space-y-4">
              {robots.map((robot) => (
                <div key={robot.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-neutral-700">
                      {robot.name}
                    </span>
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium text-white ${getRobotStatusColor(
                        robot.status
                      )}`}
                    >
                      {getRobotStatusText(robot.status)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 flex-1 rounded-full bg-neutral-200">
                      <div
                        className="h-2 rounded-full bg-green-500 transition-all"
                        style={{ width: `${robot.battery}%` }}
                      />
                    </div>
                    <span className="text-xs text-neutral-600">
                      {robot.battery}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ML Analysis Chart */}
          <motion.div
            variants={itemVariants}
            className="rounded-2xl bg-white p-6 shadow-lg transition-all hover:shadow-xl lg:col-span-3"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-neutral-800">
                Analisis Hama & Penyakit (Data Dummy)
              </h2>
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: "Sehat", value: 70 },
                      { name: "Hama (Thrips)", value: 15 },
                      { name: "Penyakit (Antraknosa)", value: 10 },
                      { name: "Lainnya", value: 5 },
                    ]}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={4}
                  >
                    <Cell fill="#22c55e" />
                    <Cell fill="#3b82f6" />
                    <Cell fill="#f59e0b" />
                    <Cell fill="#94a3b8" />
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Notifications Card - Full Width */}
          <motion.div
            variants={itemVariants}
            className="rounded-2xl bg-white p-6 shadow-lg transition-all hover:shadow-xl lg:col-span-3"
          >
            <div className="mb-4 flex items-center gap-2">
              <IoMdNotifications className="text-orange-500" size={24} />
              <h2 className="text-lg font-semibold text-neutral-800">
                Notifikasi Terbaru
              </h2>
            </div>
            <div className="space-y-3">
              {allNotifications.length === 0 ? (
                <div className="text-center py-8 text-neutral-500">
                  <IoMdNotifications
                    size={48}
                    className="mx-auto mb-2 opacity-50"
                  />
                  <p>Tidak ada notifikasi</p>
                </div>
              ) : (
                allNotifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`flex items-start gap-3 rounded-lg border p-3 transition-all hover:shadow-md ${
                      notif.type === "error"
                        ? "border-red-300 bg-red-50"
                        : notif.type === "warning"
                        ? "border-yellow-300 bg-yellow-50"
                        : notif.type === "info"
                        ? "border-blue-300 bg-blue-50"
                        : "border-green-300 bg-green-50"
                    }`}
                  >
                    <div
                      className={`mt-1 h-2 w-2 rounded-full ${
                        notif.type === "error"
                          ? "bg-red-500"
                          : notif.type === "warning"
                          ? "bg-yellow-500"
                          : notif.type === "info"
                          ? "bg-blue-500"
                          : "bg-green-500"
                      }`}
                    />
                    <div className="flex-1">
                      <p
                        className={`text-sm font-medium ${
                          notif.type === "error"
                            ? "text-red-800"
                            : notif.type === "warning"
                            ? "text-yellow-800"
                            : notif.type === "info"
                            ? "text-blue-800"
                            : "text-green-800"
                        }`}
                      >
                        {notif.message}
                      </p>
                      <p className="mt-1 text-xs text-neutral-500">
                        {notif.time}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardPage;
