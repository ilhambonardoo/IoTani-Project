"use client";

import { motion } from "framer-motion";
import { FaRobot, FaBatteryFull } from "react-icons/fa";
import { IoMdRefresh } from "react-icons/io";
import type { ExtendedRobotStatus } from "@/types";

interface RobotStatusCardProps {
  robots: ExtendedRobotStatus[];
}

const RobotStatusCard = ({ robots }: RobotStatusCardProps) => {
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
  );
};

export default RobotStatusCard;



