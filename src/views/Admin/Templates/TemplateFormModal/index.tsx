"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { Template } from "@/types";

interface TemplateFormModalProps {
  isOpen: boolean;
  editingTemplate: Template | null;
  formData: {
    name: string;
    title: string;
    content: string;
    category: string;
  };
  isSubmitting: boolean;
  onFormDataChange: (data: TemplateFormModalProps["formData"]) => void;
  onClose: () => void;
  onSubmit: () => void;
}

const TemplateFormModal = ({
  isOpen,
  editingTemplate,
  formData,
  isSubmitting,
  onFormDataChange,
  onClose,
  onSubmit,
}: TemplateFormModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="form-overlay"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            key="form-modal"
            className="relative w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <h2 className="mb-4 text-2xl font-bold text-neutral-800">
              {editingTemplate ? "Edit Template" : "Template Baru"}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700">
                  Nama Template
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    onFormDataChange({ ...formData, name: e.target.value })
                  }
                  placeholder="Misal: Pengingat Verifikasi Akun"
                  className="mt-1 w-full rounded-lg border border-neutral-300 px-4 py-2 text-neutral-800 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700">
                  Judul Pesan
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    onFormDataChange({ ...formData, title: e.target.value })
                  }
                  placeholder="Judul yang akan ditampilkan"
                  className="mt-1 w-full rounded-lg border border-neutral-300 px-4 py-2 text-neutral-800 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700">
                  Kategori
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    onFormDataChange({ ...formData, category: e.target.value })
                  }
                  className="mt-1 w-full rounded-lg border border-neutral-300 px-4 py-2 text-neutral-800 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/50"
                >
                  <option value="Umum">Umum</option>
                  <option value="Pengingat">Pengingat</option>
                  <option value="Update">Update</option>
                  <option value="Penting">Penting</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700">
                  Isi Pesan
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) =>
                    onFormDataChange({ ...formData, content: e.target.value })
                  }
                  placeholder="Isi pesan template..."
                  rows={6}
                  className="mt-1 w-full rounded-lg border border-neutral-300 px-4 py-2 text-neutral-800 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/50"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <motion.button
                onClick={onClose}
                className="rounded-lg bg-neutral-200 px-6 py-2 font-semibold text-neutral-700 transition-all hover:bg-neutral-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Batal
              </motion.button>
              <motion.button
                onClick={onSubmit}
                disabled={isSubmitting}
                className="flex items-center gap-2 rounded-lg bg-green-500 px-6 py-2 font-semibold text-white transition-all hover:bg-green-600 disabled:opacity-50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isSubmitting ? "Menyimpan..." : "Simpan"}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TemplateFormModal;



