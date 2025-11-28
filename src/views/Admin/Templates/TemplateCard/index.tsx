"use client";

import { motion } from "framer-motion";
import { FaEdit, FaTrash, FaPaperPlane } from "react-icons/fa";
import type { Template } from "@/types";

interface TemplateCardProps {
  template: Template;
  onEdit: () => void;
  onSend: () => void;
  onDelete: () => void;
}

const TemplateCard = ({
  template,
  onEdit,
  onSend,
  onDelete,
}: TemplateCardProps) => {
  return (
    <motion.div
      className="rounded-2xl bg-white p-6 shadow-lg hover:shadow-xl transition-all"
      whileHover={{ y: -5 }}
    >
      <div className="mb-3 flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-neutral-800">{template.name}</h3>
          <p className="text-xs text-neutral-500">{template.createdAt}</p>
        </div>
        <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
          {template.category}
        </span>
      </div>

      <p className="mb-4 text-sm font-medium text-neutral-700">
        {template.title}
      </p>

      <p className="mb-4 line-clamp-2 text-sm text-neutral-600">
        {template.content}
      </p>

      <div className="flex gap-2">
        <motion.button
          onClick={onEdit}
          className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-blue-100 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-200 transition-all"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <FaEdit size={14} />
          Edit
        </motion.button>

        <motion.button
          onClick={onSend}
          className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-green-100 px-3 py-2 text-sm font-medium text-green-700 hover:bg-green-200 transition-all"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <FaPaperPlane size={14} />
          Kirim
        </motion.button>

        <motion.button
          onClick={onDelete}
          className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-red-100 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-200 transition-all"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <FaTrash size={14} />
          Hapus
        </motion.button>
      </div>
    </motion.div>
  );
};

export default TemplateCard;



