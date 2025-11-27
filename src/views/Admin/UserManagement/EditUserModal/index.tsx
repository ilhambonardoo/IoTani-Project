"use client";

import { motion, AnimatePresence } from "framer-motion";

interface EditUserModalProps {
  isOpen: boolean;
  formData: {
    fullName: string;
    email: string;
    password: string;
  };
  onFormDataChange: (data: EditUserModalProps["formData"]) => void;
  onClose: () => void;
  onSave: () => void;
}

const EditUserModal = ({
  isOpen,
  formData,
  onFormDataChange,
  onClose,
  onSave,
}: EditUserModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md rounded-2xl bg-white p-4 sm:p-6 shadow-xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="mb-4 text-xl sm:text-2xl font-bold text-neutral-800">
              Edit Pengguna
            </h2>

            <div className="mb-6 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) =>
                    onFormDataChange({
                      ...formData,
                      fullName: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-3 text-neutral-800 placeholder-neutral-400 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/50"
                  placeholder="Masukkan nama lengkap"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    onFormDataChange({
                      ...formData,
                      email: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-3 text-neutral-800 placeholder-neutral-400 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/50"
                  placeholder="Masukkan email"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  Password Baru
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    onFormDataChange({
                      ...formData,
                      password: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-3 text-neutral-800 placeholder-neutral-400 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/50"
                  placeholder="Masukkan password baru"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <motion.button
                className="rounded-lg bg-neutral-200 px-4 py-2 font-semibold text-neutral-700 transition-all hover:bg-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-400"
                onClick={onClose}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Batal
              </motion.button>

              <motion.button
                className="rounded-lg bg-green-500 px-4 py-2 font-semibold text-white transition-all hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                onClick={onSave}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Simpan
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EditUserModal;



