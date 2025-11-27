"use client";

import { motion } from "framer-motion";
import { FiRefreshCcw } from "react-icons/fi";

interface ForumRefreshButtonProps {
  isLoading: boolean;
  onRefresh: () => void;
}

const ForumRefreshButton = ({
  isLoading,
  onRefresh,
}: ForumRefreshButtonProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6"
    >
      <motion.button
        onClick={onRefresh}
        className="flex items-center gap-2 rounded-lg bg-white px-6 py-3 font-semibold text-green-600 shadow-md ring-1 ring-green-200 transition-all hover:bg-green-50 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
        whileHover={{ scale: isLoading ? 1 : 1.02 }}
        whileTap={{ scale: isLoading ? 1 : 0.98 }}
        disabled={isLoading}
      >
        <FiRefreshCcw
          size={18}
          className={isLoading ? "animate-spin" : "text-green-600"}
        />
        Muat ulang konten
      </motion.button>
    </motion.div>
  );
};

export default ForumRefreshButton;

