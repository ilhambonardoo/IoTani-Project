"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import type { Chili, ChiliPayload } from "@/types";

export function useChilies() {
  const [chilies, setChilies] = useState<Chili[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchChilies = useCallback(async (withToast = false) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/chilies");
      const result = await response.json();

      if (!response.ok || !result.status) {
        throw new Error(result.message || "Gagal mengambil data cabai");
      }

      const chiliesList: Chili[] = Array.isArray(result.data)
        ? result.data
        : [];

      setChilies(chiliesList);
      if (withToast) {
        toast.success("✅ Data cabai berhasil diperbarui");
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
    fetchChilies();
  }, [fetchChilies]);

  const createChili = useCallback(
    async (data: ChiliPayload, imageFile?: File) => {
      try {
        let imageUrl = data.imageUrl || "";

        // Upload image if provided
        if (imageFile) {
          const uploadFormData = new FormData();
          uploadFormData.append("file", imageFile);
          uploadFormData.append("folder", "chilies");

          const uploadRes = await fetch("/api/chilies/upload", {
            method: "POST",
            body: uploadFormData,
          });

          const uploadData = await uploadRes.json();
          if (uploadRes.ok && uploadData.status && uploadData.data?.url) {
            imageUrl = uploadData.data.url;
          } else {
            throw new Error(uploadData.message || "Gagal mengupload gambar");
          }
        }

        const response = await fetch("/api/chilies", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...data, imageUrl }),
        });

        const result = await response.json();
        if (!response.ok || !result.status) {
          throw new Error(result.message || "Operasi gagal dijalankan");
        }

        toast.success("✅ Cabai baru berhasil ditambahkan");
        await fetchChilies();
        return result;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Terjadi kesalahan pada server";
        toast.error(`❌ ${message}`);
        throw err;
      }
    },
    [fetchChilies]
  );

  const updateChili = useCallback(
    async (id: string, data: Partial<ChiliPayload>, imageFile?: File) => {
      try {
        let imageUrl = data.imageUrl;

        // Upload image if provided
        if (imageFile) {
          const uploadFormData = new FormData();
          uploadFormData.append("file", imageFile);
          uploadFormData.append("folder", "chilies");

          const uploadRes = await fetch("/api/chilies/upload", {
            method: "POST",
            body: uploadFormData,
          });

          const uploadData = await uploadRes.json();
          if (uploadRes.ok && uploadData.status && uploadData.data?.url) {
            imageUrl = uploadData.data.url;
          } else {
            throw new Error(uploadData.message || "Gagal mengupload gambar");
          }
        }

        const response = await fetch("/api/chilies", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, ...data, imageUrl }),
        });

        const result = await response.json();
        if (!response.ok || !result.status) {
          throw new Error(result.message || "Operasi gagal dijalankan");
        }

        toast.success("✅ Cabai berhasil diperbarui");
        await fetchChilies();
        return result;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Terjadi kesalahan pada server";
        toast.error(`❌ ${message}`);
        throw err;
      }
    },
    [fetchChilies]
  );

  const deleteChili = useCallback(
    async (id: string) => {
      try {
        const response = await fetch(`/api/chilies?id=${id}`, {
          method: "DELETE",
        });

        const result = await response.json();
        if (!response.ok || !result.status) {
          throw new Error(result.message || "Tidak dapat menghapus cabai");
        }

        toast.success("✅ Cabai berhasil dihapus");
        await fetchChilies();
        return result;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Terjadi kesalahan server";
        toast.error(`❌ ${message}`);
        throw err;
      }
    },
    [fetchChilies]
  );

  return {
    chilies,
    isLoading,
    error,
    refetch: fetchChilies,
    createChili,
    updateChili,
    deleteChili,
  };
}
