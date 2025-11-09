"use client";

import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import {
  WiDaySunny,
  WiRain,
  WiCloudy,
  WiStrongWind,
} from "react-icons/wi";
import {
  FaTemperatureHigh,
  FaTint,
  FaRobot,
  FaBell,
} from "react-icons/fa";
import { IoMdNotifications } from "react-icons/io";
import { HiOutlineChartBar } from "react-icons/hi";

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
  const { data: session } = useSession();
  const [weather, setWeather] = useState<WeatherData>({
    temperature: 28,
    humidity: 75,
    condition: "sunny",
    windSpeed: 12,
  });

  const [sensorData, setSensorData] = useState<SensorData>({
    pH: 6.8,
    moisture: 65,
    temperature: 27,
    status: "normal",
  });

  const [robots, setRobots] = useState<RobotStatus[]>([
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

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      message: "Sensor pH menunjukkan nilai optimal",
      type: "success",
      time: "5 menit lalu",
    },
    {
      id: 2,
      message: "Robot Semprot A sedang bekerja di Zona 1",
      type: "info",
      time: "15 menit lalu",
    },
  ]);

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
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
            Selamat Datang, {session?.user?.name || "Pengguna"}! 👋
          </h1>
          <p className="mt-2 text-neutral-600">
            Pantau kondisi lahan Anda secara real-time
          </p>
        </motion.div>

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
                <FaTemperatureHigh className="text-blue-500" size={24} />
                <div className="flex-1">
                  <p className="text-sm text-neutral-600">Suhu Tanah</p>
                  <p className="text-lg font-semibold text-neutral-800">
                    {sensorData.temperature}°C
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FaTint className="text-blue-500" size={24} />
                <div className="flex-1">
                  <p className="text-sm text-neutral-600">Kelembapan</p>
                  <p className="text-lg font-semibold text-neutral-800">
                    {sensorData.moisture}%
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <HiOutlineChartBar className="text-green-500" size={24} />
                <div className="flex-1">
                  <p className="text-sm text-neutral-600">pH Tanah</p>
                  <p className="text-lg font-semibold text-neutral-800">
                    {sensorData.pH}
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
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className="flex items-start gap-3 rounded-lg border border-neutral-200 p-3 transition-all hover:bg-neutral-50"
                >
                  <div
                    className={`mt-1 h-2 w-2 rounded-full ${
                      notif.type === "success"
                        ? "bg-green-500"
                        : notif.type === "info"
                        ? "bg-blue-500"
                        : "bg-orange-500"
                    }`}
                  />
                  <div className="flex-1">
                    <p className="text-sm text-neutral-700">{notif.message}</p>
                    <p className="mt-1 text-xs text-neutral-500">
                      {notif.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardPage;
