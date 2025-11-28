"use client";

import { motion } from "framer-motion";
import { FaPlus } from "react-icons/fa";

interface TemplateHeaderProps {
  onNewClick: () => void;
}

const TemplateHeader = ({ onNewClick }: TemplateHeaderProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6 sm:mb-8 flex flex-col sm:flex-row items-center justify-between gap-4"
    >
      <div className="w-full sm:w-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-neutral-800 lg:text-4xl text-center sm:text-left">
          Template Pesan
        </h1>
        <p className="mt-2 text-sm sm:text-base text-neutral-600 text-center sm:text-left">
          Kelola template pesan untuk dikirim ke pengguna
        </p>
      </div>
      <motion.button
        onClick={onNewClick}
        className="flex items-center gap-2 rounded-lg bg-green-500 px-6 py-3 font-semibold text-white transition-all hover:bg-green-600"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <FaPlus size={18} />
        Template Baru
      </motion.button>
    </motion.div>
  );
};

export default TemplateHeader;








