"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "react-toastify";
import { useContent, useForm, useDeleteConfirm } from "@/hooks";
import ContentHeader from "./ContentHeader";
import ArticleCard from "./ArticleCard";
import ArticleForm from "./ArticleForm";
import AddArticleModal from "./AddArticleModal";
import ConfirmationModal from "@/components/ui/ConfirmationModal/page";
import type { Article } from "@/types";

const categories = ["Hama & Penyakit", "Perawatan", "Teknologi", "Pupuk"];

const initialForm = {
  title: "",
  content: "",
  category: "",
};

const ContentManagementPage = () => {
  const {
    filteredArticles,
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    refetch: fetchContents,
    createContent,
    updateContent,
    deleteContent,
  } = useContent();

  const { formData, setFormData, isSubmitting, setIsSubmitting } =
    useForm(initialForm);

  const deleteConfirm = useDeleteConfirm();
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [activeActionId, setActiveActionId] = useState<string | null>(null);

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
      if (isEditing) {
        await updateContent(isEditing, formData);
      } else {
        await createContent(formData);
      }
      resetFormState();
    } catch {
      // Error sudah di-handle di hook
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (activeActionId === id) return;
    deleteConfirm.open(id);
  };

  const confirmDelete = async () => {
    if (!deleteConfirm.id) return;
    setActiveActionId(deleteConfirm.id);
    try {
      await deleteContent(deleteConfirm.id);
    } catch {
    } finally {
      setActiveActionId(null);
      deleteConfirm.close();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 p-4 sm:p-6 lg:p-8 pt-16 md:pt-4">
      <div className="mx-auto max-w-7xl">
        <ContentHeader
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onAddClick={handleAdd}
          onRefresh={fetchContents}
          isLoading={isLoading}
        />

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
          {isLoading ? (
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
                  <ArticleForm
                    formData={formData}
                    categories={categories}
                    isSubmitting={isSubmitting}
                    onFormDataChange={setFormData}
                    onSave={handleSave}
                    onCancel={resetFormState}
                  />
                ) : (
                  <ArticleCard
                    article={article}
                    activeActionId={activeActionId}
                    onEdit={() => handleEdit(article)}
                    onDelete={() => handleDelete(article.id)}
                  />
                )}
              </motion.div>
            ))
          )}
        </div>

        <ConfirmationModal
          isOpen={deleteConfirm.isOpen}
          onClose={deleteConfirm.close}
          onConfirm={confirmDelete}
          title="Hapus Artikel"
        >
          <p className="text-neutral-700">
            Apakah Anda yakin ingin menghapus artikel ini? Tindakan ini tidak
            dapat dibatalkan.
          </p>
        </ConfirmationModal>

        <AddArticleModal
          isOpen={isAdding}
          formData={formData}
          categories={categories}
          isSubmitting={isSubmitting}
          onFormDataChange={setFormData}
          onClose={resetFormState}
          onSave={handleSave}
        />
      </div>
    </div>
  );
};

export default ContentManagementPage;


