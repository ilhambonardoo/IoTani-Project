"use client";

import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { FaUsers, FaEnvelope, FaChartLine, FaRobot } from "react-icons/fa";
import { IoMdNotifications } from "react-icons/io";
import { HiOutlineUserGroup } from "react-icons/hi";

const DashboardAdmin = () => {
  const { data: session } = useSession();

  const stats = {
    totalUsers: 156,
    activeUsers: 142,
    totalMessages: 89,
    pendingMessages: 12,
    totalLands: 89,
    activeRobots: 24,
  };

  const recentMessages = [
    {
      id: 1,
      from: "Petani A",
      subject: "Pertanyaan tentang pH tanah",
      time: "5 menit lalu",
      unread: true,
    },
    {
      id: 2,
      from: "Petani B",
      subject: "Masalah dengan sensor",
      time: "15 menit lalu",
      unread: true,
    },
    {
      id: 3,
      from: "Petani C",
      subject: "Terima kasih atas bantuannya",
      time: "1 jam lalu",
      unread: false,
    },
  ];

  const onlineUsers = [
    { id: 1, name: "Petani A", role: "User" },
    { id: 2, name: "Petani B", role: "User" },
    { id: 3, name: "Owner X", role: "Owner" },
  ];

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
    <div className="bg-linear-to-br from-neutral-50 to-neutral-100 p-4 sm:p-6 lg:p-8 pt-16 md:pt-4">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-800 lg:text-4xl text-center md:text-left">
            Daftar platfrom
          </h1>
          <p className="mt-2 text-sm sm:text-base text-neutral-600 text-center md:text-left">
            Selamat datang, {session?.user?.name || "Admin"}! Kelola platform
            IoTani
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-6 sm:mb-8 grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          <motion.div
            variants={itemVariants}
            className="rounded-2xl bg-white p-4 sm:p-6 shadow-lg transition-all hover:shadow-xl"
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="rounded-lg bg-blue-100 p-3">
                <FaUsers className="text-blue-500" size={24} />
              </div>
              <span className="text-sm font-medium text-green-600">+12%</span>
            </div>
            <h3 className="text-2xl font-bold text-neutral-800">
              {stats.totalUsers}
            </h3>
            <p className="text-sm text-neutral-600">Total Pengguna</p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="rounded-2xl bg-white p-6 shadow-lg transition-all hover:shadow-xl"
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="rounded-lg bg-green-100 p-3">
                <HiOutlineUserGroup className="text-green-500" size={24} />
              </div>
              <span className="text-sm font-medium text-green-600">
                {stats.activeUsers}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-neutral-800">Aktif</h3>
            <p className="text-sm text-neutral-600">Pengguna Online</p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="rounded-2xl bg-white p-6 shadow-lg transition-all hover:shadow-xl"
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="rounded-lg bg-orange-100 p-3">
                <FaEnvelope className="text-orange-500" size={24} />
              </div>
              {stats.pendingMessages > 0 && (
                <span className="rounded-full bg-red-500 px-2 py-1 text-xs font-medium text-white">
                  {stats.pendingMessages}
                </span>
              )}
            </div>
            <h3 className="text-2xl font-bold text-neutral-800">
              {stats.totalMessages}
            </h3>
            <p className="text-sm text-neutral-600">Total Pesan</p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="rounded-2xl bg-white p-6 shadow-lg transition-all hover:shadow-xl"
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="rounded-lg bg-purple-100 p-3">
                <FaRobot className="text-purple-500" size={24} />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-neutral-800">
              {stats.activeRobots}
            </h3>
            <p className="text-sm text-neutral-600">Robot Aktif</p>
          </motion.div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-3">
          {/* Recent Messages */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 rounded-2xl bg-white p-4 sm:p-6 shadow-lg"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-neutral-800">
                Pesan Terbaru
              </h2>
              <a
                href="/admin/inbox"
                className="text-sm font-medium text-green-600 hover:text-green-700"
              >
                Lihat Semua
              </a>
            </div>
            <div className="space-y-3">
              {recentMessages.map((message) => (
                <div
                  key={message.id}
                  className={`rounded-lg border p-4 transition-all hover:bg-neutral-50 ${
                    message.unread
                      ? "border-green-200 bg-green-50"
                      : "border-neutral-200"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <h3 className="font-semibold text-neutral-800">
                          {message.from}
                        </h3>
                        {message.unread && (
                          <span className="h-2 w-2 rounded-full bg-green-500" />
                        )}
                      </div>
                      <p className="text-sm text-neutral-600">
                        {message.subject}
                      </p>
                      <p className="mt-1 text-xs text-neutral-400">
                        {message.time}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Online Users */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-2xl bg-white p-4 sm:p-6 shadow-lg"
          >
            <h2 className="mb-4 text-xl font-semibold text-neutral-800">
              Pengguna Online
            </h2>
            <div className="space-y-3">
              {onlineUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center gap-3 rounded-lg border border-neutral-200 p-3"
                >
                  <div className="relative">
                    <div className="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center text-white font-semibold">
                      {user.name.charAt(0)}
                    </div>
                    <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-neutral-800">{user.name}</p>
                    <p className="text-xs text-neutral-500">{user.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;
