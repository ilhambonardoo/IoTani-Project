"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { FaPaperPlane, FaTimes } from "react-icons/fa";
import type { QuestionFormData } from "@/types";

const CATEGORIES = [
  "Hama & Penyakit",
  "Perawatan",
  "Teknologi",
  "Pupuk",
  "Lainnya",
] as const;

interface QuestionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: QuestionFormData) => void;
  isSubmitting: boolean;
}

const QuestionFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
}: QuestionFormModalProps) => {
  const [formData, setFormData] = useState<QuestionFormData>({
    title: "",
    category: "",
    content: "",
    recipientRole: "admin",
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm transition-all">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl rounded-2xl bg-white p-4 sm:p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="mb-6 flex items-center justify-between border-b border-neutral-100 pb-4">
          <div>
            <h3 className="text-xl font-bold text-neutral-800">
              Ajukan Pertanyaan Baru
            </h3>
            <p className="text-sm text-neutral-500">
              Pertanyaan Anda akan diproses oleh tim admin.
            </p>
          </div>
          <button
            onClick={onClose}
            className="cursor-pointer rounded-full p-2 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600"
          >
            <FaTimes />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">
              Judul Pertanyaan
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full rounded-lg border border-neutral-300 px-4 py-2 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
              placeholder="Contoh: Daun tanaman menguning"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-neutral-700">
                Kategori
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full rounded-lg border border-neutral-300 px-4 py-2 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
              >
                <option value="">Pilih kategori</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-neutral-700">
                Kirim Kepada
              </label>
              <select
                value={formData.recipientRole}
                onChange={(e) =>
                  setFormData({ ...formData, recipientRole: e.target.value })
                }
                className="w-full rounded-lg border border-neutral-300 px-4 py-2 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
              >
                <option value="admin">Admin</option>
                <option value="owner">Owner</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">
              Detail Pertanyaan
            </label>
            <textarea
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              rows={5}
              className="w-full rounded-lg border border-neutral-300 px-4 py-2 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
              placeholder="Ceritakan detail masalah Anda..."
            />
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="cursor-pointer rounded-lg px-4 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-100"
            >
              Batal
            </button>
            <button
              onClick={() => onSubmit(formData)}
              disabled={isSubmitting}
              className="flex items-center gap-2 rounded-lg bg-green-600 px-6 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-70 cursor-pointer disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                "Mengirim..."
              ) : (
                <>
                  <FaPaperPlane size={12} /> Kirim Pertanyaan
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default QuestionFormModal;
