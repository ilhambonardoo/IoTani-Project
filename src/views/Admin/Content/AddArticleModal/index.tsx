"use client";

import { motion, AnimatePresence } from "framer-motion";
import { FaSave, FaTimes } from "react-icons/fa";

interface AddArticleModalProps {
  isOpen: boolean;
  formData: {
    title: string;
    content: string;
    category: string;
  };
  categories: string[];
  isSubmitting: boolean;
  onFormDataChange: (data: AddArticleModalProps["formData"]) => void;
  onClose: () => void;
  onSave: () => void;
}

const AddArticleModal = ({
  isOpen,
  formData,
  categories,
  isSubmitting,
  onFormDataChange,
  onClose,
  onSave,
}: AddArticleModalProps) => {
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
            className="relative w-full max-w-3xl rounded-2xl bg-white p-4 sm:p-6 shadow-xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl font-semibold text-neutral-800">
                Tambah Artikel Baru
              </h2>
              <motion.button
                onClick={onClose}
                className="rounded-lg bg-neutral-100 p-2 text-neutral-600 transition-all hover:bg-neutral-200"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Tutup"
              >
                <FaTimes size={20} />
              </motion.button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  Judul Artikel
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    onFormDataChange({ ...formData, title: e.target.value })
                  }
                  placeholder="Masukkan judul artikel"
                  className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-2 text-base sm:text-lg font-semibold text-neutral-800 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/50"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  Kategori
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    onFormDataChange({ ...formData, category: e.target.value })
                  }
                  className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-2 text-neutral-800 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/50"
                >
                  <option value="">Pilih Kategori</option>
                  {categories.map((category) => (
                    <option value={category} key={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  Konten Artikel
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) =>
                    onFormDataChange({ ...formData, content: e.target.value })
                  }
                  placeholder="Masukkan konten artikel"
                  rows={10}
                  className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-2 text-neutral-800 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 resize-y"
                />
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                <motion.button
                  onClick={onSave}
                  className="flex items-center gap-2 rounded-lg bg-green-500 px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-semibold text-white transition-all hover:bg-green-600 disabled:opacity-50"
                  whileHover={{ scale: isSubmitting ? 1 : 1.05 }}
                  whileTap={{ scale: isSubmitting ? 1 : 0.95 }}
                  disabled={isSubmitting}
                >
                  <FaSave size={18} />
                  {isSubmitting ? "Menyimpan..." : "Simpan Artikel"}
                </motion.button>
                <motion.button
                  onClick={onClose}
                  className="flex items-center gap-2 rounded-lg bg-neutral-200 px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-semibold text-neutral-700 transition-all hover:bg-neutral-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaTimes size={18} />
                  Batal
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddArticleModal;








