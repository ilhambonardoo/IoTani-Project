"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { toast } from "react-toastify";
import type { Article, ContentPayload } from "@/types";

export function useContent() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchContents = useCallback(async (withToast = false) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/content");
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
  }, []);

  useEffect(() => {
    fetchContents();
  }, [fetchContents]);

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

  const createContent = useCallback(
    async (data: ContentPayload) => {
      try {
        const response = await fetch("/api/content", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        const result = await response.json();
        if (!response.ok || !result.status) {
          throw new Error(result.message || "Operasi gagal dijalankan");
        }

        toast.success("✅ Konten baru berhasil ditambahkan");
        await fetchContents();
        return result;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Terjadi kesalahan pada server";
        toast.error(`❌ ${message}`);
        throw err;
      }
    },
    [fetchContents]
  );

  const updateContent = useCallback(
    async (id: string, data: Partial<ContentPayload>) => {
      try {
        const response = await fetch("/api/content", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, ...data }),
        });

        const result = await response.json();
        if (!response.ok || !result.status) {
          throw new Error(result.message || "Operasi gagal dijalankan");
        }

        toast.success("✅ Konten berhasil diperbarui");
        await fetchContents();
        return result;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Terjadi kesalahan pada server";
        toast.error(`❌ ${message}`);
        throw err;
      }
    },
    [fetchContents]
  );

  const deleteContent = useCallback(
    async (id: string) => {
      try {
        const response = await fetch(`/api/content?id=${id}`, {
          method: "DELETE",
        });

        const result = await response.json();
        if (!response.ok || !result.status) {
          throw new Error(result.message || "Tidak dapat menghapus konten");
        }

        toast.success("✅ Konten berhasil dihapus");
        await fetchContents();
        return result;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Terjadi kesalahan server";
        toast.error(`❌ ${message}`);
        throw err;
      }
    },
    [fetchContents]
  );

  return {
    articles,
    filteredArticles,
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    refetch: fetchContents,
    createContent,
    updateContent,
    deleteContent,
  };
}
