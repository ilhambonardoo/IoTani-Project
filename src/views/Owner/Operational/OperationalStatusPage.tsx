"use client";

import { useState } from "react";
import OperationalHeader from "./OperationalHeader";
import RobotStatusCard from "./RobotStatusCard";
import SensorStatusCard from "./SensorStatusCard";
import ActivityLogCard from "./ActivityLogCard";
import type { ExtendedRobotStatus, SensorStatus, ActivityLog } from "@/types";

const OperationalStatusPage = () => {
  const [robots] = useState<ExtendedRobotStatus[]>([
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
    {
      id: "4",
      name: "Sensor pH Zona D",
      type: "pH",
      status: "online",
      lastReading: "3 menit lalu",
      value: 6.5,
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 p-4 sm:p-6 lg:p-8 pt-16 md:pt-4">
      <div className="mx-auto max-w-7xl">
        <OperationalHeader />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <RobotStatusCard robots={robots} />

          <SensorStatusCard sensors={sensors} />

          <ActivityLogCard activityLogs={activityLogs} />
        </div>
      </div>
    </div>
  );
};

export default OperationalStatusPage;
