import React from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";

const overlayVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const modalVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 20 },
  },
  exit: { opacity: 0, scale: 0.9, y: 20, transition: { duration: 0.15 } },
};

/**
 * * @param {object} props
 * @param {boolean} props.isOpen
 * @param {function} props.onClose
 * @param {function} props.onConfirm
 * @param {string} props.title
 * @param {React.ReactNode} props.children
 */
const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  children: React.ReactNode;
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="overlay"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={onClose}
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <motion.div
            key="modal"
            className="relative w-full max-w-md rounded-xl border border-white/30 bg-gray-900/80 p-6 shadow-xl backdrop-blur-md"
            onClick={(e) => e.stopPropagation()}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <h2 className="mb-4 text-2xl font-bold text-white">
              {title || "Konfirmasi Aksi"}
            </h2>

            <div className="mb-6 text-gray-300">{children}</div>

            <div className="flex justify-end gap-3">
              <button
                className="rounded-lg bg-gray-700 px-4 py-2 font-semibold text-white transition-all hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
                onClick={onClose}
              >
                Batal
              </button>

              <button
                className="rounded-lg bg-red-600 px-4 py-2 font-semibold text-white transition-all hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-400"
                onClick={onConfirm}
              >
                Ya, Hapus
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmationModal;
