"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import {
  FaUser,
  FaLeaf,
  FaBug,
  FaWrench,
  FaBook,
  FaFileAlt,
  FaFlask,
} from "react-icons/fa";
import { HiOutlineSearch } from "react-icons/hi";
import { FiRefreshCcw } from "react-icons/fi";
import { toast } from "react-toastify";

interface Article {
  id: string;
  title: string;
  content: string;
  author?: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

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

const ForumPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchArticles = async (withToast?: boolean) => {
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch("/api/content/get");
      const data = await res.json();
      if (!res.ok || !data.status) {
        throw new Error(data.message || "Gagal mengambil data konten");
      }
      setArticles(data.data || []);
      if (withToast) {
        toast.success("✅ Konten edukasi diperbarui");
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Terjadi kesalahan server";
      setError(message);
      if (withToast) {
        toast.error(`❌ ${message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  useEffect(() => {
    // Trigger re-filter when selectedCategory changes
    // This ensures articles update when switching categories
  }, [selectedCategory]);

  const filteredArticles = useMemo(() => {
    const keyword = searchQuery.trim().toLowerCase();
    return articles.filter((article) => {
      const matchSearch =
        !keyword ||
        article.title.toLowerCase().includes(keyword) ||
        article.content.toLowerCase().includes(keyword);
      const matchCategory =
        selectedCategory === "Semua" || article.category === selectedCategory;
      return matchSearch && matchCategory;
    });
  }, [articles, searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 p-4 sm:p-6 lg:p-8 pt-16 md:pt-4">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-800 lg:text-4xl text-center md:text-left">
            Edukasi
          </h1>
          <p className="mt-2 text-sm sm:text-base text-neutral-600 text-center md:text-left">
            Ajukan pertanyaan dan dapatkan jawaban dari penyuluh pertanian
          </p>
        </motion.div>

        {/* Search and Filter */}
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
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-neutral-300 bg-white px-12 py-3 text-neutral-800 placeholder-neutral-400 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/50"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
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

        {/* Ask Question Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <motion.button
            onClick={() => fetchArticles(true)}
            className="flex items-center gap-2 rounded-lg bg-white px-6 py-3 font-semibold text-green-600 shadow-md ring-1 ring-green-200 transition-all hover:bg-green-50 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
            whileHover={{ scale: isLoading ? 1 : 1.02 }}
            whileTap={{ scale: isLoading ? 1 : 0.98 }}
            disabled={isLoading}
          >
            <FiRefreshCcw
              size={18}
              className={isLoading ? "animate-spin" : "text-green-600"}
            />
            Muat ulang konten
          </motion.button>
        </motion.div>

        {/* Content List */}
        {error && !isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700"
          >
            <p>{error}</p>
          </motion.div>
        )}

        {isLoading ? (
          <div className="flex h-60 items-center justify-center text-neutral-500">
            <div>
              <div className="mx-auto mb-3 h-10 w-10 animate-spin rounded-full border-4 border-green-500 border-t-transparent" />
              <p>Memuat artikel edukasi...</p>
            </div>
          </div>
        ) : filteredArticles.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-2xl bg-white p-12 text-center shadow-lg"
          >
            <FaBook className="mx-auto mb-4 text-neutral-400" size={48} />
            <p className="text-lg text-neutral-600">
              {articles.length === 0
                ? "Belum ada konten yang dipublikasikan admin."
                : "Konten tidak ditemukan, coba kata kunci lain."}
            </p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {filteredArticles.map((article, index) => (
              <motion.div
                key={article.id}
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
                    <p className="text-neutral-600">{article.content}</p>
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ForumPage;
