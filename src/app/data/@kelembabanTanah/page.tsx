// app/data/@kelembabanTanah/page.tsx
"use client";

import { StatCard } from "@/components/dataPage/StatCard";
import { PumpControl } from "@/components/dataPage/PumpControl";
import { LuDroplet } from "react-icons/lu";
import { motion } from "framer-motion";

export default function KelembabanPage() {
  return (
    <motion.div
      className="flex h-full flex-col gap-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
    >
      <StatCard
        title="Kelembapan"
        value="72%"
        icon={<LuDroplet size={24} className="text-blue-400" />}
        trend="Stabil"
      />
      {/* Kita gabungkan PumpControl di sini */}
      <PumpControl />
    </motion.div>
  );
}
