"use client";

import { motion } from "framer-motion";
import { HiOutlineClock } from "react-icons/hi";
import type { ActivityLog } from "@/types";

interface ActivityLogCardProps {
  activityLogs: ActivityLog[];
}

const ActivityLogCard = ({ activityLogs }: ActivityLogCardProps) => {
  return (
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
  );
};

export default ActivityLogCard;







