"use client";

import { motion } from "framer-motion";
import { FaEdit, FaTrash } from "react-icons/fa";
import { HiOutlineDocumentText } from "react-icons/hi";
import type { Article } from "@/types";

interface ArticleCardProps {
  article: Article;
  activeActionId: string | null;
  onEdit: () => void;
  onDelete: () => void;
}

const ArticleCard = ({
  article,
  activeActionId,
  onEdit,
  onDelete,
}: ArticleCardProps) => {
  return (
    <div>
      <div className="mb-4 flex items-start justify-between">
        <div className="flex-1">
          <div className="mb-2 flex items-center gap-2">
            <HiOutlineDocumentText className="text-green-500" size={20} />
            <h3 className="text-xl font-semibold text-neutral-800">
              {article.title}
            </h3>
          </div>
          <p className="mb-3 whitespace-pre-wrap text-neutral-600 leading-relaxed">
            {article.content}
          </p>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="rounded-full bg-green-100 px-3 py-1 text-green-700">
              {article.category}
            </span>
            <span className="text-neutral-500">
              Oleh: {article.author || "Admin"}
            </span>
            <span className="text-neutral-500">
              Dibuat: {article.createdAt}
            </span>
            <span className="text-neutral-500">
              Diperbarui: {article.updatedAt}
            </span>
          </div>
        </div>
        <div className="ml-4 flex gap-2">
          <motion.button
            onClick={onEdit}
            className="rounded-lg bg-blue-100 p-2 text-blue-600 transition-all hover:bg-blue-200"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FaEdit size={16} />
          </motion.button>
          <motion.button
            onClick={onDelete}
            className="rounded-lg bg-red-100 p-2 text-red-600 transition-all hover:bg-red-200 disabled:opacity-50"
            whileHover={{
              scale: activeActionId === article.id ? 1 : 1.1,
            }}
            whileTap={{
              scale: activeActionId === article.id ? 1 : 0.9,
            }}
            disabled={activeActionId === article.id}
          >
            <FaTrash size={16} />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;







