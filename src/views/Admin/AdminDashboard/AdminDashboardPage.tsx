"use client";

import { motion, type Variants } from "framer-motion";
import { useAuth } from "@/hooks";
import { useEffect, useState } from "react";
import AdminDashboardHeader from "./AdminDashboardHeader";
import StatsCard from "./StatsCard";
import RecentMessagesCard from "./RecentMessagesCard";
import OnlineUsersCard from "./OnlineUsersCard";
import type { QuestionMessage } from "@/types";

const AdminDashboardPage = () => {
  const { user } = useAuth();
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

      try {
        const res = await fetch(`/api/forum/questions?recipientRole=admin`);
        const data = await res.json();
        if (res.ok && data.status && Array.isArray(data.data)) {
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
    <div className="bg-linear-to-br from-neutral-50 to-neutral-100 p-4 sm:p-6 lg:p-8 pt-16 md:pt-4">
      <div className="mx-auto max-w-7xl">
        <AdminDashboardHeader userName={user?.fullName || "Admin"} />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-6 sm:mb-8 grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          <motion.div variants={itemVariants}>
            <StatsCard
              icon="users"
              value={isLoadingStats ? "..." : stats.totalUsers}
              label="Total Pengguna"
              trend="+12%"
              color="blue"
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <StatsCard
              icon="activeUsers"
              value={isLoadingStats ? "..." : stats.activeUsers}
              label="Pengguna Aktif"
              trend="+8%"
              color="green"
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <StatsCard
              icon="messages"
              value={isLoadingStats ? "..." : stats.totalMessages}
              label="Total Pesan"
              badge={stats.pendingMessages > 0 ? stats.pendingMessages : undefined}
              color="orange"
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <StatsCard
              icon="robots"
              value={stats.activeRobots}
              label="Robot Aktif"
              color="purple"
            />
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <RecentMessagesCard
              messages={recentMessages}
              isLoading={isLoadingMessages}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <OnlineUsersCard users={onlineUsers} />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;

