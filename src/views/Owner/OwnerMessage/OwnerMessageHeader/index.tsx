"use client";

import { motion } from "framer-motion";
import { FaPaperPlane } from "react-icons/fa";

interface OwnerMessageHeaderProps {
  onCreateMessage?: () => void;
}

const OwnerMessageHeader = ({ onCreateMessage }: OwnerMessageHeaderProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6 sm:mb-8 lg:flex lg:justify-between"
    >
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-neutral-800 lg:text-4xl text-center md:text-left">
          Owner Inbox
        </h1>
        <p className="mt-2 text-sm sm:text-base text-neutral-600 text-center md:text-left">
          Kelola pesan yang masuk ke Owner
        </p>
      </div>
      {onCreateMessage && (
        <button
          onClick={onCreateMessage}
          className="flex items-center justify-center gap-2 rounded-xl bg-green-600 p-2 mt-2 cursor-pointer text-sm font-semibold text-white shadow-lg shadow-green-600/20 transition-all hover:bg-green-700 hover:shadow-green-600/30 active:scale-[0.98] w-full lg:w-auto lg:px-6"
        >
          <FaPaperPlane />
          Buat Pesan Baru
        </button>
      )}
    </motion.div>
  );
};

export default OwnerMessageHeader;

