"use client";

import { useState, useRef, useCallback } from "react";
import { toast } from "react-toastify";

interface UseFileUploadOptions {
  maxSize?: number; // in bytes
  allowedTypes?: string[];
  folder?: string;
}

export function useFileUpload(options: UseFileUploadOptions = {}) {
  const {
    maxSize = 5 * 1024 * 1024, // 5MB default
    allowedTypes = ["image/"],
    folder = "uploads",
  } = options;

  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback(
    (file: File) => {
      // Validate file type
      const isValidType = allowedTypes.some((type) =>
        file.type.startsWith(type)
      );
      if (!isValidType) {
        toast.error("File type tidak didukung");
        return false;
      }

      // Validate file size
      if (file.size > maxSize) {
        toast.error(
          `Ukuran file maksimal ${Math.round(maxSize / 1024 / 1024)}MB`
        );
        return false;
      }

      setSelectedFile(file);
      setUploadPreview(URL.createObjectURL(file));
      return true;
    },
    [allowedTypes, maxSize]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFileSelect(file);
      }
    },
    [handleFileSelect]
  );

  const uploadFile = useCallback(
    async (uploadEndpoint: string): Promise<string | null> => {
      if (!selectedFile) {
        return null;
      }

      setIsUploading(true);
      try {
        const uploadFormData = new FormData();
        uploadFormData.append("file", selectedFile);
        if (folder) {
          uploadFormData.append("folder", folder);
        }

        const res = await fetch(uploadEndpoint, {
          method: "POST",
          body: uploadFormData,
        });

        const data = await res.json();
        if (!res.ok || !data.status || !data.data?.url) {
          throw new Error(data.message || "Gagal mengupload file");
        }

        return data.data.url;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Unknown error";
        toast.error(`❌ ${message}`);
        return null;
      } finally {
        setIsUploading(false);
      }
    },
    [selectedFile, folder]
  );

  const clearFile = useCallback(() => {
    if (uploadPreview) {
      URL.revokeObjectURL(uploadPreview);
    }
    setSelectedFile(null);
    setUploadPreview(null);
    if (fileRef.current) {
      fileRef.current.value = "";
    }
  }, [uploadPreview]);

  const openFileDialog = useCallback(() => {
    fileRef.current?.click();
  }, []);

  return {
    uploadPreview,
    selectedFile,
    isUploading,
    fileRef,
    handleFileChange,
    handleFileSelect,
    uploadFile,
    clearFile,
    openFileDialog,
  };
}

