"use client";

import { motion, type Variants } from "framer-motion";
import { useState, useEffect, useMemo } from "react";
import { useAuth, useSensorData, useTemplates } from "@/hooks";
import { SensorAlertBanner } from "@/components/features/SensorAlert/SensorAlert";
import { generateWeatherData } from "@/lib/utils/sensorDataGenerator";
import DashboardHeader from "./DashboardHeader";
import WeatherCard from "./WeatherCard";
import SensorStatusCard from "./SensorStatusCard";
import RobotStatusCard from "./RobotStatusCard";
import AnalysisChart from "./AnalysisChart";
import NotificationsCard from "./NotificationsCard";
import TemplatesReminderCard from "./TemplatesReminderCard";
import type { WeatherData, RobotStatus } from "@/types";

const DashboardPage = () => {
  const { role, fullName } = useAuth();
  const {
    sensorData,
    abnormalNotifications,
    pHStatus,
    moistureStatus,
    temperatureStatus,
  } = useSensorData();
  const [weather, setWeather] = useState<WeatherData>({
    temperature: 28,
    humidity: 75,
    condition: "sunny" as const,
    windSpeed: 12,
  });

  // Zone selection
  const zones = [
    {
      id: "1",
      name: "Zona A",
      location: "Lahan Utara",
      status: "online" as const,
    },
    {
      id: "2",
      name: "Zona B",
      location: "Lahan Selatan",
      status: "online" as const,
    },
    {
      id: "3",
      name: "Zona C",
      location: "Lahan Timur",
      status: "online" as const,
    },
    {
      id: "4",
      name: "Zona D",
      location: "Lahan Barat",
      status: "online" as const,
    },
  ];
  const [selectedZoneId, setSelectedZoneId] = useState<string>(zones[0].id);
  const selectedZone = zones.find((z) => z.id === selectedZoneId) || zones[0];

  useEffect(() => {
    const interval = setInterval(() => {
      const newWeather = generateWeatherData();
      setWeather(newWeather);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

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
    {
      id: "3",
      name: "Robot Semprot C",
      status: "charging",
      battery: 45,
    },
  ]);

  const templatesHook = useTemplates();
  const templates =
    role === "admin" || role === "owner" ? [] : templatesHook.templates;
  const isLoadingTemplates =
    role === "admin" || role === "owner" ? false : templatesHook.isLoading;

  const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([]);
  const [regularNotifications] = useState([
    {
      id: 1,
      message: "Robot Semprot A sedang bekerja di Zona A",
      type: "info" as const,
      time: "15 menit lalu",
    },
  ]);
  const activeAlerts = abnormalNotifications.filter(
    (alert) => !dismissedAlerts.includes(alert.id)
  );

  const handleDismissAlert = (id: string) => {
    setDismissedAlerts((prev) => [...prev, id]);
  };

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

  return (
    <div className="min-h-screen bg-linear-to-br from-neutral-50 to-neutral-100 p-4 sm:p-6 lg:p-8 pt-16 md:pt-4">
      <div className="mx-auto max-w-7xl">
        <DashboardHeader
          role={role}
          fullName={fullName}
          zones={zones}
          selectedZoneId={selectedZoneId}
          onZoneSelect={setSelectedZoneId}
        />

        {activeAlerts.length > 0 && (
          <SensorAlertBanner
            alerts={activeAlerts}
            onClose={handleDismissAlert}
          />
        )}

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 gap-4 my-6 sm:gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          <motion.div variants={itemVariants}>
            <WeatherCard weather={weather} />
          </motion.div>

          <motion.div variants={itemVariants}>
            <SensorStatusCard
              sensorData={sensorData}
              selectedZone={selectedZone}
              temperatureStatus={temperatureStatus}
              moistureStatus={moistureStatus}
              pHStatus={pHStatus}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <RobotStatusCard robots={robots} />
          </motion.div>
        </motion.div>

        <div className="flex flex-col gap-10">
          <motion.div variants={itemVariants}>
            <AnalysisChart />
          </motion.div>

          <motion.div variants={itemVariants}>
            <NotificationsCard notifications={allNotifications} />
          </motion.div>

          {role !== "admin" && role !== "owner" && (
            <motion.div variants={itemVariants}>
              <TemplatesReminderCard
                templates={templates}
                isLoading={isLoadingTemplates}
              />
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
