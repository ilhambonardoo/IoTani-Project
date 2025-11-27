"use client";

import { motion } from "framer-motion";

const OwnerMessageHeader = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6 sm:mb-8"
    >
      <h1 className="text-2xl sm:text-3xl font-bold text-neutral-800 lg:text-4xl text-center md:text-left">
        Owner Inbox
      </h1>
      <p className="mt-2 text-sm sm:text-base text-neutral-600 text-center md:text-left">
        Kelola pesan yang masuk ke Owner
      </p>
    </motion.div>
  );
};

export default OwnerMessageHeader;

