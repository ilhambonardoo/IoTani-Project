"use client";

import { motion } from "framer-motion";
import {
  FaLeaf,
  FaBug,
  FaWrench,
  FaBook,
  FaFileAlt,
  FaFlask,
} from "react-icons/fa";
import { HiOutlineSearch } from "react-icons/hi";

const categories = [
  "Semua",
  "Hama & Penyakit",
  "Perawatan",
  "Teknologi",
  "Pupuk",
  "Lainnya",
];

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

interface ForumSearchFilterProps {
  searchQuery: string;
  selectedCategory: string;
  onSearchChange: (query: string) => void;
  onCategoryChange: (category: string) => void;
}

const ForumSearchFilter = ({
  searchQuery,
  selectedCategory,
  onSearchChange,
  onCategoryChange,
}: ForumSearchFilterProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6 space-y-4"
    >
      <div className="relative">
        <HiOutlineSearch
          className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
          size={20}
        />
        <input
          type="text"
          placeholder="Cari pertanyaan..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-lg border border-neutral-300 bg-white px-12 py-3 text-neutral-800 placeholder-neutral-400 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/50"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`cursor-pointer flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              selectedCategory === category
                ? "bg-green-500 text-white shadow-md"
                : "bg-white text-neutral-700 hover:bg-neutral-100"
            }`}
          >
            {getCategoryIcon(category)}
            {category}
          </button>
        ))}
      </div>
    </motion.div>
  );
};

export default ForumSearchFilter;
