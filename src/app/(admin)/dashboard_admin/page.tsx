"use client";

import { motion, Variants } from "framer-motion";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { FaUsers, FaEnvelope, FaRobot, FaUser } from "react-icons/fa";
import { HiOutlineUserGroup } from "react-icons/hi";

interface QuestionMessage {
  id: string;
  authorName: string;
  authorEmail?: string;
  authorRole?: string;
  category: string;
  title: string;
  content: string;
  createdAt: string;
}

const DashboardAdmin = () => {
  const { data: session } = useSession();
  const [recentMessages, setRecentMessages] = useState<QuestionMessage[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalMessages: 0,
    pendingMessages: 0,
    totalLands: 89,
    activeRobots: 3,
  });
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  const onlineUsers = [
    { id: 1, name: "Petani A", role: "user" },
    { id: 2, name: "Petani B", role: "user" },
    { id: 3, name: "Owner X", role: "owner" },
  ];

  useEffect(() => {
    const fetchDashboardData = async () => {
      // Fetch stats
      try {
        const statsRes = await fetch(`/api/dashboard/stats`);
        const statsData = await statsRes.json();
        if (statsRes.ok && statsData.status && statsData.data) {
          setStats((prev) => ({
            ...prev,
            totalUsers: statsData.data.totalUsers,
            activeUsers: statsData.data.activeUsers,
            totalMessages: statsData.data.totalMessages,
            pendingMessages: statsData.data.pendingMessages,
          }));
        }
      } catch {
      } finally {
        setIsLoadingStats(false);
      }

      // Fetch recent messages
      try {
        const res = await fetch(`/api/forum/questions?recipientRole=admin`);
        const data = await res.json();
        if (res.ok && data.status && Array.isArray(data.data)) {
          // Ambil 5 pesan terbaru
          const sortedMessages = data.data
            .sort((a: QuestionMessage, b: QuestionMessage) => {
              return (
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
              );
            })
            .slice(0, 5);
          setRecentMessages(sortedMessages);
        }
      } catch {
      } finally {
        setIsLoadingMessages(false);
      }
    };

    fetchDashboardData();
  }, []);

  const containerVariants = {
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
    <div className="bg-linear-to-br from-neutral-50 to-neutral-100 p-4 sm:p-6 lg:p-8 pt-16 md:pt-4">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-800 lg:text-4xl text-center md:text-left">
            Dashboard Platform
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
              {isLoadingStats ? "..." : stats.totalUsers}
            </h3>
            <p className="text-sm text-neutral-600">Total Pengguna</p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="rounded-2xl bg-white p-4 sm:p-6 shadow-lg transition-all hover:shadow-xl"
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="rounded-lg bg-green-100 p-3">
                <HiOutlineUserGroup className="text-green-500" size={24} />
              </div>
              <span className="text-sm font-medium text-green-600">+8%</span>
            </div>
            <h3 className="text-2xl font-bold text-neutral-800">
              {isLoadingStats ? "..." : stats.activeUsers}
            </h3>
            <p className="text-sm text-neutral-600">Pengguna Aktif</p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="rounded-2xl bg-white p-4 sm:p-6 shadow-lg transition-all hover:shadow-xl"
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
              {isLoadingStats ? "..." : stats.totalMessages}
            </h3>
            <p className="text-sm text-neutral-600">Total Pesan</p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="rounded-2xl bg-white p-4 sm:p-6 shadow-lg transition-all hover:shadow-xl"
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
                href="/admin-message"
                className="text-sm font-medium text-green-600 hover:text-green-700"
              >
                Lihat Semua
              </a>
            </div>
            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {isLoadingMessages ? (
                <div className="flex h-40 items-center justify-center text-sm text-neutral-500">
                  Memuat pesan...
                </div>
              ) : recentMessages.length === 0 ? (
                <div className="p-6 text-center text-sm text-neutral-500">
                  Tidak ada pesan terbaru.
                </div>
              ) : (
                recentMessages.map((message) => (
                  <div
                    key={message.id}
                    className="rounded-lg border border-neutral-200 p-4 transition-all hover:bg-neutral-50"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500 text-white shrink-0">
                        <FaUser size={16} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="truncate font-semibold text-neutral-800">
                            {message.authorName}
                          </h3>
                        </div>
                        <p className="mt-1 truncate text-sm text-neutral-600">
                          {message.title}
                        </p>
                        <p className="mt-1 text-xs text-neutral-400">
                          {message.createdAt}
                        </p>
                        <div className="mt-2 flex items-center gap-2 flex-wrap">
                          <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-[11px] font-medium text-green-700">
                            {message.category}
                          </span>
                          {message.authorRole && (
                            <span
                              className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${
                                message.authorRole === "user"
                                  ? "bg-blue-100 text-blue-700"
                                  : message.authorRole === "admin"
                                  ? "bg-purple-100 text-purple-700"
                                  : "bg-orange-100 text-orange-700"
                              }`}
                            >
                              {message.authorRole === "user"
                                ? "User"
                                : message.authorRole === "admin"
                                ? "Admin"
                                : "Owner"}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
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
            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {onlineUsers.length === 0 ? (
                <div className="p-6 text-center text-sm text-neutral-500">
                  Tidak ada pengguna online.
                </div>
              ) : (
                onlineUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center gap-3 rounded-lg border border-neutral-200 p-3 transition-all hover:bg-neutral-50"
                  >
                    <div className="relative flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center text-white font-semibold">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-neutral-800 truncate">
                        {user.name}
                      </p>
                      <p className="text-xs text-neutral-500 capitalize">
                        {user.role}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;
