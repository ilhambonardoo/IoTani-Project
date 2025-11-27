"use client";

import { motion } from "framer-motion";
import { IoMdNotifications } from "react-icons/io";

interface Notification {
  id: string | number;
  message: string;
  type: "error" | "warning" | "info" | "success";
  time: string;
}

interface NotificationsCardProps {
  notifications: Notification[];
}

const NotificationsCard = ({ notifications }: NotificationsCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-white p-4 sm:p-6 shadow-lg transition-all hover:shadow-xl md:col-span-2 lg:col-span-3"
    >
      <div className="mb-4 flex items-center gap-2">
        <IoMdNotifications className="text-orange-500" size={24} />
        <h2 className="text-lg font-semibold text-neutral-800">
          Notifikasi Terbaru
        </h2>
      </div>
      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="text-center py-8 text-neutral-500">
            <IoMdNotifications
              size={48}
              className="mx-auto mb-2 opacity-50"
            />
            <p>Tidak ada notifikasi</p>
          </div>
        ) : (
          notifications.map((notif) => (
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
  );
};

export default NotificationsCard;

