"use client";

import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import {
  FaChartLine,
  FaRobot,
  FaSeedling,
  FaTachometerAlt,
} from "react-icons/fa";
import { HiOutlineTrendingUp } from "react-icons/hi";

const OwnerDashboard = () => {
  const { data: session } = useSession();

  const performance = {
    harvestYield: "2,450 kg",
    yieldIncrease: "+15%",
    efficiency: "92%",
    operationalCost: "Rp 12.5M",
    costReduction: "-8%",
  };

  const recentHarvests = [
    { id: 1, date: "2024-01-15", yield: "850 kg", zone: "Zona A" },
    { id: 2, date: "2024-01-10", yield: "720 kg", zone: "Zona B" },
    { id: 3, date: "2024-01-05", yield: "880 kg", zone: "Zona C" },
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
    <div className="min-h-screen bg-linear-to-br from-neutral-50 to-neutral-100 p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-neutral-800 lg:text-4xl">
            Dashboard Owner
          </h1>
          <p className="mt-2 text-neutral-600">
            Selamat datang, {session?.user?.name || "Owner"}! Ringkasan performa
            lahan
          </p>
        </motion.div>

        {/* Performance Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4"
        >
          <motion.div
            variants={itemVariants}
            className="rounded-2xl bg-linear-to-br from-green-500 to-green-600 p-6 text-white shadow-lg"
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="rounded-lg bg-white/20 p-3">
                <FaSeedling size={24} />
              </div>
              <HiOutlineTrendingUp size={24} />
            </div>
            <h3 className="text-3xl font-bold">{performance.harvestYield}</h3>
            <p className="text-sm text-green-100">Hasil Panen</p>
            <p className="mt-2 text-sm font-medium">
              {performance.yieldIncrease}
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="rounded-2xl bg-linear-to-br from-blue-500 to-blue-600 p-6 text-white shadow-lg"
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="rounded-lg bg-white/20 p-3">
                <FaTachometerAlt size={24} />
              </div>
            </div>
            <h3 className="text-3xl font-bold">{performance.efficiency}</h3>
            <p className="text-sm text-blue-100">Efisiensi Operasional</p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="rounded-2xl bg-linear-to-br from-orange-500 to-orange-600 p-6 text-white shadow-lg"
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="rounded-lg bg-white/20 p-3">
                <FaChartLine size={24} />
              </div>
            </div>
            <h3 className="text-2xl font-bold">
              {performance.operationalCost}
            </h3>
            <p className="text-sm text-orange-100">Biaya Operasional</p>
            <p className="mt-2 text-sm font-medium">
              {performance.costReduction}
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="rounded-2xl bg-linear-to-br from-purple-500 to-purple-600 p-6 text-white shadow-lg"
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="rounded-lg bg-white/20 p-3">
                <FaRobot size={24} />
              </div>
            </div>
            <h3 className="text-3xl font-bold">24</h3>
            <p className="text-sm text-purple-100">Robot Aktif</p>
          </motion.div>
        </motion.div>

        {/* Recent Harvests */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-white p-6 shadow-lg"
        >
          <h2 className="mb-6 text-xl font-semibold text-neutral-800">
            Hasil Panen Terbaru
          </h2>
          <div className="space-y-4">
            {recentHarvests.map((harvest) => (
              <div
                key={harvest.id}
                className="flex items-center justify-between rounded-lg border border-neutral-200 p-4 transition-all hover:bg-neutral-50"
              >
                <div>
                  <h3 className="font-semibold text-neutral-800">
                    {harvest.zone}
                  </h3>
                  <p className="text-sm text-neutral-600">{harvest.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-green-600">
                    {harvest.yield}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
