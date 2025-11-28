"use client";

import { motion } from "framer-motion";
import { FaPlus, FaSyncAlt } from "react-icons/fa";

interface ChiliesHeaderProps {
  onAddClick: () => void;
  onRefresh: (showToast?: boolean) => void;
  isLoading: boolean;
}

const ChiliesHeader = ({
  onAddClick,
  onRefresh,
  isLoading,
}: ChiliesHeaderProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6 sm:mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"
    >
      <div className="w-full lg:w-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-neutral-800 lg:text-4xl text-center lg:text-left">
          Manajemen Cabai
        </h1>
        <p className="mt-2 text-sm sm:text-base text-neutral-600 text-center lg:text-left">
          Kelola informasi cabai untuk ditampilkan di landing page
        </p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <motion.button
          onClick={onAddClick}
          className="flex items-center justify-center gap-2 rounded-lg bg-green-500 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:bg-green-600"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaPlus size={18} />
          Tambah Cabai
        </motion.button>
        <motion.button
          onClick={() => onRefresh(true)}
          className="flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-3 font-semibold text-green-600 shadow-lg ring-1 ring-inset ring-green-200 transition-all hover:bg-green-50"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={isLoading}
        >
          <FaSyncAlt
            size={16}
            className={isLoading ? "animate-spin" : "text-green-600"}
          />
          Muat ulang
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ChiliesHeader;








