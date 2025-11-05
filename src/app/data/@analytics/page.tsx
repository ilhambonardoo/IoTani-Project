// app/data/@analytics/page.tsx
"use client";

import { DataChart } from "@/components/DataPage/DataChart";
import { motion } from "framer-motion";

export default function AnalyticsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
    >
      <DataChart />
    </motion.div>
  );
}
