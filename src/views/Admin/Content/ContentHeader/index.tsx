"use client";

import { motion } from "framer-motion";
import { FaPlus, FaSyncAlt } from "react-icons/fa";

interface ContentHeaderProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onAddClick: () => void;
  onRefresh: (showToast?: boolean) => void;
  isLoading: boolean;
}

const ContentHeader = ({
  searchTerm,
  onSearchChange,
  onAddClick,
  onRefresh,
  isLoading,
}: ContentHeaderProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6 sm:mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"
    >
      <div className="w-full lg:w-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-neutral-800 lg:text-4xl text-center lg:text-left">
          Manajemen Konten
        </h1>
        <p className="mt-2 text-sm sm:text-base text-neutral-600 text-center lg:text-left">
          Kelola artikel dan konten edukasi untuk Forum QnA
        </p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Cari konten..."
          className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-2 text-neutral-800 placeholder-neutral-400 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 sm:w-64"
        />
        <motion.button
          onClick={onAddClick}
          className="flex items-center justify-center gap-2 rounded-lg bg-green-500 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:bg-green-600"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaPlus size={18} />
          Tambah Artikel
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

export default ContentHeader;








