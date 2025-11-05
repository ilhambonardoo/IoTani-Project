// app/data/@suhuTanah/page.tsx
"use client";

import { StatCard } from "@/components/DataPage/StatCard";
import { LuThermometer } from "react-icons/lu";
import { motion } from "framer-motion";

export default function SuhuTanahPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
      className="w-1/2"
    >
      <StatCard
        title="Suhu Udara"
        value="28°C"
        icon={<LuThermometer size={24} className="text-orange-400" />}
        trend="Stabil"
      />
    </motion.div>
  );
}
