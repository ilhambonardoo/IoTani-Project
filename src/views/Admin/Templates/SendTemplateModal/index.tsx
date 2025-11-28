"use client";

import { motion, AnimatePresence } from "framer-motion";
import { FaPaperPlane } from "react-icons/fa";

interface SendTemplateModalProps {
  isOpen: boolean;
  targetRole: "user" | "admin" | "owner" | "all";
  isSending: boolean;
  onTargetRoleChange: (role: SendTemplateModalProps["targetRole"]) => void;
  onClose: () => void;
  onConfirm: () => void;
}

const SendTemplateModal = ({
  isOpen,
  targetRole,
  isSending,
  onTargetRoleChange,
  onClose,
  onConfirm,
}: SendTemplateModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="send-overlay"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            key="send-modal"
            className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <h2 className="mb-4 text-2xl font-bold text-neutral-800">
              Kirim Template
            </h2>

            <div className="mb-6">
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Kirim ke
              </label>
              <select
                value={targetRole}
                onChange={(e) =>
                  onTargetRoleChange(
                    e.target.value as SendTemplateModalProps["targetRole"]
                  )
                }
                className="w-full rounded-lg border border-neutral-300 px-4 py-2 text-neutral-800 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/50"
              >
                <option value="user">Semua User</option>
                <option value="admin">Semua Admin</option>
                <option value="owner">Semua Owner</option>
                <option value="all">Semua Pengguna</option>
              </select>
            </div>

            <p className="mb-6 text-sm text-neutral-600">
              Template ini akan dikirim sebagai pesan baru kepada pengguna
              yang dipilih.
            </p>

            <div className="flex justify-end gap-3">
              <motion.button
                onClick={onClose}
                className="rounded-lg bg-neutral-200 px-6 py-2 font-semibold text-neutral-700 transition-all hover:bg-neutral-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Batal
              </motion.button>
              <motion.button
                onClick={onConfirm}
                disabled={isSending}
                className="flex items-center gap-2 rounded-lg bg-green-500 px-6 py-2 font-semibold text-white transition-all hover:bg-green-600 disabled:opacity-50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaPaperPlane size={16} />
                {isSending ? "Mengirim..." : "Kirim"}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SendTemplateModal;



