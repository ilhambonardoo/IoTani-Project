"use client";

import { motion } from "framer-motion";
import { FaBook } from "react-icons/fa";

interface ForumEmptyStateProps {
  hasArticles: boolean;
}

const ForumEmptyState = ({ hasArticles }: ForumEmptyStateProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="rounded-2xl bg-white p-12 text-center shadow-lg"
    >
      <FaBook className="mx-auto mb-4 text-neutral-400" size={48} />
      <p className="text-lg text-neutral-600">
        {hasArticles
          ? "Konten tidak ditemukan, coba kata kunci lain."
          : "Belum ada konten yang dipublikasikan admin."}
      </p>
    </motion.div>
  );
};

export default ForumEmptyState;

