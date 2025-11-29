"use client";

import { motion } from "framer-motion";

interface Harvest {
  id: number;
  date: string;
  yield: string;
  zone: string;
}

interface HarvestCardProps {
  harvests: Harvest[];
}

const HarvestCard = ({ harvests }: HarvestCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-white p-4 sm:p-6 shadow-lg"
    >
      <h2 className="mb-6 text-xl font-semibold text-neutral-800">
        Hasil Panen Terbaru
      </h2>
      <div className="space-y-4">
        {harvests.map((harvest) => (
          <div
            key={harvest.id}
            className="flex items-center justify-between rounded-lg border border-neutral-200 p-4 transition-all hover:bg-neutral-50"
          >
            <div>
              <h3 className="font-semibold text-neutral-800">{harvest.zone}</h3>
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
  );
};

export default HarvestCard;
