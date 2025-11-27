"use client";

import { motion, type Variants } from "framer-motion";
import { useAuth } from "@/hooks";
import OwnerDashboardHeader from "./OwnerDashboardHeader";
import PerformanceCard from "./PerformanceCard";
import HarvestCard from "./HarvestCard";

const OwnerDashboardPage = () => {
  const { user } = useAuth();

  const performance = {
    harvestYield: "532 kg",
    yieldIncrease: "+15%",
    efficiency: "92%",
    operationalCost: "Rp 600,000",
    costReduction: "-8%",
  };

  const recentHarvests = [
    { id: 1, date: "2024-01-15", yield: "124 kg", zone: "Zona A" },
    { id: 2, date: "2024-01-10", yield: "279 kg", zone: "Zona B" },
    { id: 3, date: "2024-01-05", yield: "129 kg", zone: "Zona C" },
    { id: 4, date: "2024-01-03", yield: "198 kg", zone: "Zona D" },
  ];

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
        <OwnerDashboardHeader userName={user?.fullName || user?.name || "Owner"} />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-6 sm:mb-8 grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          <motion.div variants={itemVariants}>
            <PerformanceCard
              icon="harvest"
              value={performance.harvestYield}
              label="Hasil Panen"
              trend={performance.yieldIncrease}
              color="green"
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <PerformanceCard
              icon="efficiency"
              value={performance.efficiency}
              label="Efisiensi Operasional"
              color="blue"
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <PerformanceCard
              icon="cost"
              value={performance.operationalCost}
              label="Biaya Operasional"
              trend={performance.costReduction}
              color="orange"
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <PerformanceCard
              icon="robots"
              value="3"
              label="Robot Aktif"
              color="purple"
            />
          </motion.div>
        </motion.div>

        <HarvestCard harvests={recentHarvests} />
      </div>
    </div>
  );
};

export default OwnerDashboardPage;

