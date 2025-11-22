"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSave,
  FaTimes,
  FaSyncAlt,
} from "react-icons/fa";
import { HiOutlineDocumentText } from "react-icons/hi";
import { toast } from "react-toastify";

interface Article {
  id: string;
  title: string;
  content: string;
  category: string;
  author?: string;
  createdAt: string;
  updatedAt: string;
}

const categories = [
  "Hama & Penyakit",
  "Perawatan",
  "Teknologi",
  "Pupuk",
];

const initialForm = {
  title: "",
  content: "",
  category: "",
};

const ContentManagementPage = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [activeActionId, setActiveActionId] = useState<string | null>(null);
  const [formData, setFormData] = useState(initialForm);

  const fetchContents = async (withToast = false) => {
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch("/api/content/get");
      const result = await response.json();

      if (!response.ok || !result.status) {
        throw new Error(result.message || "Gagal mengambil data konten");
      }

      const contentList: Article[] = Array.isArray(result.data)
        ? result.data
        : [];
      setArticles(contentList);
      if (withToast) {
        toast.success("✅ Data konten berhasil diperbarui");
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
    fetchContents();
  }, []);

  const filteredArticles = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();
    if (!keyword) return articles;
    return articles.filter((article) => {
      return (
        article.title.toLowerCase().includes(keyword) ||
        article.category.toLowerCase().includes(keyword) ||
        article.content.toLowerCase().includes(keyword)
      );
    });
  }, [articles, searchTerm]);

  const handleAdd = () => {
    setIsAdding(true);
    setIsEditing(null);
    setFormData(initialForm);
  };

  const handleEdit = (article: Article) => {
    setIsEditing(article.id);
    setIsAdding(false);
    setFormData({
      title: article.title,
      content: article.content,
      category: article.category,
    });
  };

  const resetFormState = () => {
    setFormData(initialForm);
    setIsEditing(null);
    setIsAdding(false);
  };

  const handleSave = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error("⚠️ Judul dan konten wajib diisi");
      return;
    }
    if (!formData.category) {
      toast.error("⚠️ Kategori belum dipilih");
      return;
    }

    setIsSubmitting(true);
    try {
      let response: Response;
      if (isEditing) {
        response = await fetch("/api/content/update", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: isEditing, ...formData }),
        });
      } else {
        response = await fetch("/api/content/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      }

      const result = await response.json();
      if (!response.ok || !result.status) {
        throw new Error(result.message || "Operasi gagal dijalankan");
      }

      toast.success(
        isEditing
          ? "✅ Konten berhasil diperbarui"
          : "✅ Konten baru berhasil ditambahkan"
      );
      await fetchContents();
      resetFormState();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Terjadi kesalahan pada server";
      toast.error(`❌ ${message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    const confirmation = confirm(
      `Apakah Anda yakin ingin menghapus artikel "${title}"?`
    );
    if (!confirmation) return;

    setActiveActionId(id);
    try {
      const response = await fetch(`/api/content/delete?id=${id}`, {
        method: "DELETE",
      });
      const result = await response.json();
      if (!response.ok || !result.status) {
        throw new Error(result.message || "Tidak dapat menghapus konten");
      }

      toast.success("✅ Konten berhasil dihapus");
      setArticles((prev) => prev.filter((article) => article.id !== id));
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Terjadi kesalahan server";
      toast.error(`❌ ${message}`);
    } finally {
      setActiveActionId(null);
    }
  };

  const showLoader = isLoading;

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 p-4 sm:p-6 lg:p-8 pt-16 md:pt-4">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"
        >
          <div className="w-full lg:w-auto">
            <h1 className="text-2xl sm:text-3xl font-bold text-neutral-800 lg:text-4xl text-center lg:text-left">
              Manajemen Konten
            </h1>
            <p className="mt-2 text-sm sm:text-base text-neutral-600 text-center lg:text-left">
              Kelola artikel dan konten edukasi untuk Forum QnA
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari konten..."
              className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-2 text-neutral-800 placeholder-neutral-400 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 sm:w-64"
            />
            <motion.button
              onClick={handleAdd}
              className="flex items-center justify-center gap-2 rounded-lg bg-green-500 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:bg-green-600"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaPlus size={18} />
              Tambah Artikel
            </motion.button>
            <motion.button
              onClick={() => fetchContents(true)}
              className="flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-3 font-semibold text-green-600 shadow-lg ring-1 ring-inset ring-green-200 transition-all hover:bg-green-50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={isLoading}
            >
              <FaSyncAlt
                size={16}
                className={isLoading ? "animate-spin" : "text-green-600"}
              />
              Muat ulang
            </motion.button>
          </div>
        </motion.div>

        {error && !isLoading && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            <div className="flex items-center justify-between">
              <p>{error}</p>
              <button
                onClick={() => fetchContents(true)}
                className="text-sm font-semibold text-red-700 underline"
              >
                Coba lagi
              </button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {showLoader ? (
            <div className="flex h-60 w-full items-center justify-center">
              <div className="text-center text-neutral-600">
                <div className="mx-auto mb-2 h-10 w-10 animate-spin rounded-full border-4 border-green-500 border-t-transparent" />
                <p>Memuat data konten...</p>
              </div>
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-neutral-300 bg-white p-10 text-center text-neutral-500">
              <p className="text-lg font-semibold text-neutral-700">
                {searchTerm ? "Konten tidak ditemukan" : "Belum ada konten"}
              </p>
              <p className="mt-2">
                {searchTerm
                  ? "Coba gunakan kata kunci lain atau perbarui data."
                  : "Tambah artikel baru untuk mulai mengisi konten edukasi."}
              </p>
            </div>
          ) : (
            filteredArticles.map((article) => (
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
                      {categories.map((category) => (
                        <option value={category} key={category}>
                          {category}
                        </option>
                      ))}
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
                    <div className="flex flex-wrap gap-2">
                      <motion.button
                        onClick={handleSave}
                        className="flex items-center gap-2 rounded-lg bg-green-500 px-4 py-2 text-white transition-all hover:bg-green-600 disabled:opacity-50"
                        whileHover={{ scale: isSubmitting ? 1 : 1.05 }}
                        whileTap={{ scale: isSubmitting ? 1 : 0.95 }}
                        disabled={isSubmitting}
                      >
                        <FaSave size={16} />
                        {isSubmitting ? "Menyimpan..." : "Simpan"}
                      </motion.button>
                      <motion.button
                        onClick={resetFormState}
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
                          <HiOutlineDocumentText
                            className="text-green-500"
                            size={20}
                          />
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
                          onClick={() => handleEdit(article)}
                          className="rounded-lg bg-blue-100 p-2 text-blue-600 transition-all hover:bg-blue-200"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <FaEdit size={16} />
                        </motion.button>
                        <motion.button
                          onClick={() => handleDelete(article.id, article.title)}
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
                )}
              </motion.div>
            ))
          )}
        </div>

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
                {categories.map((category) => (
                  <option value={category} key={category}>
                    {category}
                  </option>
                ))}
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
              <div className="flex flex-wrap gap-2">
                <motion.button
                  onClick={handleSave}
                  className="flex items-center gap-2 rounded-lg bg-green-500 px-6 py-3 font-semibold text-white transition-all hover:bg-green-600 disabled:opacity-50"
                  whileHover={{ scale: isSubmitting ? 1 : 1.05 }}
                  whileTap={{ scale: isSubmitting ? 1 : 0.95 }}
                  disabled={isSubmitting}
                >
                  <FaSave size={18} />
                  {isSubmitting ? "Menyimpan..." : "Simpan Artikel"}
                </motion.button>
                <motion.button
                  onClick={resetFormState}
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
