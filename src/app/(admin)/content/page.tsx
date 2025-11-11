"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes } from "react-icons/fa";
import { HiOutlineDocumentText } from "react-icons/hi";

interface Article {
  id: number;
  title: string;
  content: string;
  category: string;
  author: string;
  createdAt: string;
  updatedAt: string;
}

const ContentManagementPage = () => {
  const [articles, setArticles] = useState<Article[]>([
    {
      id: 1,
      title: "Cara Mengatasi Hama pada Tanaman Cabai",
      content: "Artikel lengkap tentang cara mengatasi hama...",
      category: "Hama & Penyakit",
      author: "Admin",
      createdAt: "2024-01-10",
      updatedAt: "2024-01-15",
    },
    {
      id: 2,
      title: "Panduan pH Tanah Optimal untuk Cabai",
      content: "Penjelasan tentang pH tanah yang optimal...",
      category: "Teknologi",
      author: "Admin",
      createdAt: "2024-01-08",
      updatedAt: "2024-01-08",
    },
  ]);

  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
  });

  const handleAdd = () => {
    setIsAdding(true);
    setFormData({ title: "", content: "", category: "" });
  };

  const handleEdit = (article: Article) => {
    setIsEditing(article.id);
    setFormData({
      title: article.title,
      content: article.content,
      category: article.category,
    });
  };

  const handleSave = () => {
    if (isEditing) {
      setArticles(
        articles.map((a) =>
          a.id === isEditing
            ? { ...a, ...formData, updatedAt: new Date().toISOString().split("T")[0] }
            : a
        )
      );
      setIsEditing(null);
    } else {
      const newArticle: Article = {
        id: articles.length + 1,
        ...formData,
        author: "Admin",
        createdAt: new Date().toISOString().split("T")[0],
        updatedAt: new Date().toISOString().split("T")[0],
      };
      setArticles([...articles, newArticle]);
      setIsAdding(false);
    }
    setFormData({ title: "", content: "", category: "" });
  };

  const handleDelete = (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus artikel ini?")) {
      setArticles(articles.filter((a) => a.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-neutral-800 lg:text-4xl">
              Manajemen Konten
            </h1>
            <p className="mt-2 text-neutral-600">
              Kelola artikel dan konten edukasi untuk Forum QnA
            </p>
          </div>
          <motion.button
            onClick={handleAdd}
            className="flex items-center gap-2 rounded-lg bg-green-500 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:bg-green-600"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaPlus size={18} />
            Tambah Artikel
          </motion.button>
        </motion.div>

        {/* Articles List */}
        <div className="space-y-4">
          {articles.map((article) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl bg-white p-6 shadow-lg"
            >
              {isEditing === article.id ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="Judul Artikel"
                    className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-2 text-lg font-semibold text-neutral-800 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/50"
                  />
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-2 text-neutral-800 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/50"
                  >
                    <option value="">Pilih Kategori</option>
                    <option value="Hama & Penyakit">Hama & Penyakit</option>
                    <option value="Perawatan">Perawatan</option>
                    <option value="Teknologi">Teknologi</option>
                    <option value="Pupuk">Pupuk</option>
                  </select>
                  <textarea
                    value={formData.content}
                    onChange={(e) =>
                      setFormData({ ...formData, content: e.target.value })
                    }
                    placeholder="Konten Artikel"
                    rows={6}
                    className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-2 text-neutral-800 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/50"
                  />
                  <div className="flex gap-2">
                    <motion.button
                      onClick={handleSave}
                      className="flex items-center gap-2 rounded-lg bg-green-500 px-4 py-2 text-white transition-all hover:bg-green-600"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FaSave size={16} />
                      Simpan
                    </motion.button>
                    <motion.button
                      onClick={() => setIsEditing(null)}
                      className="flex items-center gap-2 rounded-lg bg-neutral-200 px-4 py-2 text-neutral-700 transition-all hover:bg-neutral-300"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FaTimes size={16} />
                      Batal
                    </motion.button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-2">
                        <HiOutlineDocumentText className="text-green-500" size={20} />
                        <h3 className="text-xl font-semibold text-neutral-800">
                          {article.title}
                        </h3>
                      </div>
                      <p className="mb-2 text-neutral-600">{article.content}</p>
                      <div className="flex flex-wrap items-center gap-3 text-sm">
                        <span className="rounded-full bg-green-100 px-3 py-1 text-green-700">
                          {article.category}
                        </span>
                        <span className="text-neutral-500">
                          Oleh: {article.author}
                        </span>
                        <span className="text-neutral-500">
                          Diperbarui: {article.updatedAt}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4 flex gap-2">
                      <motion.button
                        onClick={() => handleEdit(article)}
                        className="rounded-lg bg-blue-100 p-2 text-blue-600 transition-all hover:bg-blue-200"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <FaEdit size={16} />
                      </motion.button>
                      <motion.button
                        onClick={() => handleDelete(article.id)}
                        className="rounded-lg bg-red-100 p-2 text-red-600 transition-all hover:bg-red-200"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <FaTrash size={16} />
                      </motion.button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Add Article Form */}
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 rounded-2xl bg-white p-6 shadow-lg"
          >
            <h2 className="mb-4 text-xl font-semibold text-neutral-800">
              Tambah Artikel Baru
            </h2>
            <div className="space-y-4">
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Judul Artikel"
                className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-2 text-lg font-semibold text-neutral-800 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/50"
              />
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-2 text-neutral-800 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/50"
              >
                <option value="">Pilih Kategori</option>
                <option value="Hama & Penyakit">Hama & Penyakit</option>
                <option value="Perawatan">Perawatan</option>
                <option value="Teknologi">Teknologi</option>
                <option value="Pupuk">Pupuk</option>
              </select>
              <textarea
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                placeholder="Konten Artikel"
                rows={8}
                className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-2 text-neutral-800 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/50"
              />
              <div className="flex gap-2">
                <motion.button
                  onClick={handleSave}
                  className="flex items-center gap-2 rounded-lg bg-green-500 px-6 py-3 font-semibold text-white transition-all hover:bg-green-600"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaSave size={18} />
                  Simpan Artikel
                </motion.button>
                <motion.button
                  onClick={() => setIsAdding(false)}
                  className="flex items-center gap-2 rounded-lg bg-neutral-200 px-6 py-3 font-semibold text-neutral-700 transition-all hover:bg-neutral-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaTimes size={18} />
                  Batal
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ContentManagementPage;


