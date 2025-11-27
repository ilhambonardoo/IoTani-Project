"use client";

import { motion } from "framer-motion";
import { FaUsers, FaEnvelope, FaRobot } from "react-icons/fa";
import { HiOutlineUserGroup } from "react-icons/hi";

interface StatsCardProps {
  icon: "users" | "activeUsers" | "messages" | "robots";
  value: string | number;
  label: string;
  trend?: string;
  badge?: number;
  color: "blue" | "green" | "orange" | "purple";
}

const StatsCard = ({
  icon,
  value,
  label,
  trend,
  badge,
  color,
}: StatsCardProps) => {
  const colorClasses = {
    blue: {
      bg: "bg-blue-100",
      icon: "text-blue-500",
    },
    green: {
      bg: "bg-green-100",
      icon: "text-green-500",
    },
    orange: {
      bg: "bg-orange-100",
      icon: "text-orange-500",
    },
    purple: {
      bg: "bg-purple-100",
      icon: "text-purple-500",
    },
  };

  const getIcon = () => {
    switch (icon) {
      case "users":
        return <FaUsers className={colorClasses[color].icon} size={24} />;
      case "activeUsers":
        return (
          <HiOutlineUserGroup className={colorClasses[color].icon} size={24} />
        );
      case "messages":
        return <FaEnvelope className={colorClasses[color].icon} size={24} />;
      case "robots":
        return <FaRobot className={colorClasses[color].icon} size={24} />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-white p-4 sm:p-6 shadow-lg transition-all hover:shadow-xl"
    >
      <div className="mb-4 flex items-center justify-between">
        <div className={`rounded-lg ${colorClasses[color].bg} p-3`}>
          {getIcon()}
        </div>
        {trend && (
          <span className="text-sm font-medium text-green-600">{trend}</span>
        )}
        {badge !== undefined && badge > 0 && (
          <span className="rounded-full bg-red-500 px-2 py-1 text-xs font-medium text-white">
            {badge}
          </span>
        )}
      </div>
      <h3 className="text-2xl font-bold text-neutral-800">{value}</h3>
      <p className="text-sm text-neutral-600">{label}</p>
    </motion.div>
  );
};

export default StatsCard;

