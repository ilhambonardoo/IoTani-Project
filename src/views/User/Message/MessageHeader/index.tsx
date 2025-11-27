"use client";

import { motion } from "framer-motion";
import { FaPaperPlane } from "react-icons/fa";

interface MessageChatProps {
  onCreateQuestion: () => void;
}

const MessageHeader = ({ onCreateQuestion }: MessageChatProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6 sm:mb-8 lg:flex lg:justify-between"
    >
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-neutral-800 lg:text-4xl text-center md:text-left">
          Pesan
        </h1>
        <p className="mt-2 text-sm sm:text-base text-neutral-600 text-center md:text-left">
          Kelola dan lihat percakapan dengan admin atau owner
        </p>
      </div>
      <button
        onClick={onCreateQuestion}
        className="flex items-center justify-center gap-2 rounded-xl bg-green-600 p-2 cursor-pointer text-sm font-semibold text-white shadow-lg shadow-green-600/20 transition-all hover:bg-green-700 hover:shadow-green-600/30 active:scale-[0.98]"
      >
        <FaPaperPlane />
        Buat Pertanyaan Baru
      </button>
    </motion.div>
  );
};

export default MessageHeader;
