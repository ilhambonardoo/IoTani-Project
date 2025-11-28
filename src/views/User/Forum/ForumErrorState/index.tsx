"use client";

import { motion } from "framer-motion";

interface ForumErrorStateProps {
  error: string;
}

const ForumErrorState = ({ error }: ForumErrorStateProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700"
    >
      <p>{error}</p>
    </motion.div>
  );
};

export default ForumErrorState;

