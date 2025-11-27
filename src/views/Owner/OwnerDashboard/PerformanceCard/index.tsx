"use client";

import { motion } from "framer-motion";
import {
  FaChartLine,
  FaRobot,
  FaSeedling,
  FaTachometerAlt,
} from "react-icons/fa";
import { HiOutlineTrendingUp } from "react-icons/hi";

interface PerformanceCardProps {
  icon: "harvest" | "efficiency" | "cost" | "robots";
  value: string;
  label: string;
  trend?: string;
  color: "green" | "blue" | "orange" | "purple";
}

const PerformanceCard = ({
  icon,
  value,
  label,
  trend,
  color,
}: PerformanceCardProps) => {
  const colorClasses = {
    green: "bg-linear-to-br from-green-500 to-green-600",
    blue: "bg-linear-to-br from-blue-500 to-blue-600",
    orange: "bg-linear-to-br from-orange-500 to-orange-600",
    purple: "bg-linear-to-br from-purple-500 to-purple-600",
  };

  const textColorClasses = {
    green: "text-green-100",
    blue: "text-blue-100",
    orange: "text-orange-100",
    purple: "text-purple-100",
  };

  const getIcon = () => {
    switch (icon) {
      case "harvest":
        return <FaSeedling size={24} />;
      case "efficiency":
        return <FaTachometerAlt size={24} />;
      case "cost":
        return <FaChartLine size={24} />;
      case "robots":
        return <FaRobot size={24} />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl ${colorClasses[color]} p-4 sm:p-6 text-white shadow-lg`}
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="rounded-lg bg-white/20 p-3">
          {getIcon()}
        </div>
        {trend && <HiOutlineTrendingUp size={24} />}
      </div>
      <h3 className="text-3xl font-bold">{value}</h3>
      <p className={`text-sm ${textColorClasses[color]}`}>{label}</p>
      {trend && <p className="mt-2 text-sm font-medium">{trend}</p>}
    </motion.div>
  );
};

export default PerformanceCard;

