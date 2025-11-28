"use client";

import { motion } from "framer-motion";
import { FaRobot } from "react-icons/fa";
import type { RobotStatus } from "@/types";

interface RobotStatusCardProps {
  robots: RobotStatus[];
}

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

const RobotStatusCard = ({ robots }: RobotStatusCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-white p-4 sm:p-6 shadow-lg transition-all hover:shadow-xl lg:h-full"
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-neutral-800">Status Robot</h2>
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
              <span className="text-xs text-neutral-600">{robot.battery}%</span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default RobotStatusCard;
