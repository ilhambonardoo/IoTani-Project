"use client";

import { motion } from "framer-motion";
import {
  FaUser,
  FaLeaf,
  FaBug,
  FaWrench,
  FaBook,
  FaFileAlt,
  FaFlask,
} from "react-icons/fa";
import type { Article } from "@/types";

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "Hama & Penyakit":
      return <FaBug size={18} />;
    case "Perawatan":
      return <FaLeaf size={18} />;
    case "Teknologi":
      return <FaWrench size={18} />;
    case "Pupuk":
      return <FaFlask size={18} />;
    case "Lainnya":
      return <FaFileAlt size={18} />;
    default:
      return <FaBook size={18} />;
  }
};

interface ForumArticleCardProps {
  article: Article;
  index: number;
}

const ForumArticleCard = ({ article, index }: ForumArticleCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="rounded-2xl bg-white p-6 shadow-lg transition-all hover:shadow-xl"
    >
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="mb-2 flex items-center gap-2">
            <span className="text-green-500">
              {getCategoryIcon(article.category)}
            </span>
            <h3 className="text-xl font-semibold text-neutral-800">
              {article.title}
            </h3>
          </div>
          <p className="text-neutral-600 whitespace-pre-wrap">
            {article.content}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-500">
        <div className="flex items-center gap-2">
          <FaUser size={14} />
          <span>{article.author || "Admin"}</span>
        </div>
        <span className="rounded-full bg-green-100 px-3 py-1 text-green-700">
          {article.category}
        </span>
        <span>Diterbitkan: {article.createdAt}</span>
        <span>Diperbarui: {article.updatedAt}</span>
      </div>
    </motion.div>
  );
};

export default ForumArticleCard;

