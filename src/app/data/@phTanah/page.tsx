// app/data/@phTanah/page.tsx
"use client";

import { StatCard } from "@/components/DataPage/StatCard";
import { LuTrendingUp } from "react-icons/lu";
import { motion } from "framer-motion";

export default function PhTanahPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
      className="w-1/2"
    >
      <StatCard
        title="pH Tanah"
        value="6.8"
        icon={<LuTrendingUp size={24} className="text-lime-400" />}
        trend="+0.2 dari kemarin"
      />
    </motion.div>
  );
}
