"use client";

import { motion } from "framer-motion";
import { FaSave, FaTimes } from "react-icons/fa";

interface ArticleFormProps {
  formData: {
    title: string;
    content: string;
    category: string;
  };
  categories: string[];
  isSubmitting: boolean;
  onFormDataChange: (data: ArticleFormProps["formData"]) => void;
  onSave: () => void;
  onCancel: () => void;
}

const ArticleForm = ({
  formData,
  categories,
  isSubmitting,
  onFormDataChange,
  onSave,
  onCancel,
}: ArticleFormProps) => {
  return (
    <div className="space-y-4">
      <input
        type="text"
        value={formData.title}
        onChange={(e) =>
          onFormDataChange({ ...formData, title: e.target.value })
        }
        placeholder="Judul Artikel"
        className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-2 text-lg font-semibold text-neutral-800 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/50"
      />
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
      <textarea
        value={formData.content}
        onChange={(e) =>
          onFormDataChange({ ...formData, content: e.target.value })
        }
        placeholder="Konten Artikel"
        rows={6}
        className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-2 text-neutral-800 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/50"
      />
      <div className="flex flex-wrap gap-2">
        <motion.button
          onClick={onSave}
          className="flex items-center gap-2 rounded-lg bg-green-500 px-4 py-2 text-white transition-all hover:bg-green-600 disabled:opacity-50"
          whileHover={{ scale: isSubmitting ? 1 : 1.05 }}
          whileTap={{ scale: isSubmitting ? 1 : 0.95 }}
          disabled={isSubmitting}
        >
          <FaSave size={16} />
          {isSubmitting ? "Menyimpan..." : "Simpan"}
        </motion.button>
        <motion.button
          onClick={onCancel}
          className="flex items-center gap-2 rounded-lg bg-neutral-200 px-4 py-2 text-neutral-700 transition-all hover:bg-neutral-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaTimes size={16} />
          Batal
        </motion.button>
      </div>
    </div>
  );
};

export default ArticleForm;



