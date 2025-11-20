"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useState, useRef } from "react";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSave,
  FaTimes,
  FaSyncAlt,
  FaImage,
} from "react-icons/fa";
import { toast } from "react-toastify";
import Image from "next/legacy/image";

interface Chili {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  characteristics?: string;
  uses?: string;
  createdAt: string;
  updatedAt: string;
}

const initialForm = {
  name: "",
  description: "",
  imageUrl: "",
  characteristics: "",
  uses: "",
};

const ChiliesManagementPage = () => {
  const [chilies, setChilies] = useState<Chili[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [activeActionId, setActiveActionId] = useState<string | null>(null);
  const [formData, setFormData] = useState(initialForm);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchChilies = async (withToast = false) => {
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch("/api/chilies/get");
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
  };

  useEffect(() => {
    fetchChilies();
  }, []);

  const handleAdd = () => {
    setIsAdding(true);
    setIsEditing(null);
    setFormData(initialForm);
    setUploadPreview(null);
    setSelectedFile(null);
  };

  const handleEdit = (chili: Chili) => {
    setIsEditing(chili.id);
    setIsAdding(false);
    setFormData({
      name: chili.name,
      description: chili.description,
      imageUrl: chili.imageUrl || "",
      characteristics: chili.characteristics || "",
      uses: chili.uses || "",
    });
    setUploadPreview(chili.imageUrl || null);
    setSelectedFile(null);
  };

  const resetFormState = () => {
    setFormData(initialForm);
    setIsEditing(null);
    setIsAdding(false);
    setUploadPreview(null);
    setSelectedFile(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("File harus berupa gambar");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Ukuran file maksimal 5MB");
      return;
    }

    setSelectedFile(file);
    setUploadPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.description.trim()) {
      toast.error("⚠️ Nama dan deskripsi wajib diisi");
      return;
    }

    setIsSubmitting(true);
    try {
      let imageUrl = formData.imageUrl;

      // Upload image if new file selected
      if (selectedFile) {
        const uploadFormData = new FormData();
        uploadFormData.append("file", selectedFile);
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

      let response: Response;
      if (isEditing) {
        response = await fetch("/api/chilies/update", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: isEditing, ...formData, imageUrl }),
        });
      } else {
        response = await fetch("/api/chilies/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...formData, imageUrl }),
        });
      }

      const result = await response.json();
      if (!response.ok || !result.status) {
        throw new Error(result.message || "Operasi gagal dijalankan");
      }

      toast.success(
        isEditing
          ? "✅ Cabai berhasil diperbarui"
          : "✅ Cabai baru berhasil ditambahkan"
      );
      await fetchChilies();
      resetFormState();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Terjadi kesalahan pada server";
      toast.error(`❌ ${message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (activeActionId === id) return;

    if (!confirm(`Apakah Anda yakin ingin menghapus "${name}"?`)) {
      return;
    }

    setActiveActionId(id);
    try {
      const response = await fetch(`/api/chilies/delete?id=${id}`, {
        method: "DELETE",
      });

      const result = await response.json();
      if (!response.ok || !result.status) {
        throw new Error(result.message || "Gagal menghapus cabai");
      }

      toast.success("✅ Cabai berhasil dihapus");
      await fetchChilies();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Terjadi kesalahan pada server";
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
              Manajemen Cabai
            </h1>
            <p className="mt-2 text-sm sm:text-base text-neutral-600 text-center lg:text-left">
              Kelola informasi cabai untuk ditampilkan di landing page
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <motion.button
              onClick={handleAdd}
              className="flex items-center justify-center gap-2 rounded-lg bg-green-500 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:bg-green-600"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaPlus size={18} />
              Tambah Cabai
            </motion.button>
            <motion.button
              onClick={() => fetchChilies(true)}
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
                onClick={() => fetchChilies(true)}
                className="text-sm font-semibold text-red-700 underline"
              >
                Coba lagi
              </button>
            </div>
          </div>
        )}

        {/* Add/Edit Form */}
        {(isAdding || isEditing) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 rounded-2xl bg-white p-6 shadow-lg"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-neutral-800">
                {isEditing ? "Edit Cabai" : "Tambah Cabai Baru"}
              </h2>
              <button
                onClick={resetFormState}
                className="rounded-lg p-2 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600"
              >
                <FaTimes size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  Nama Cabai *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Contoh: Cabai Rawit, Cabai Merah, dll"
                  className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-2 text-neutral-800 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/50"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  Deskripsi *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Deskripsi singkat tentang cabai ini..."
                  rows={4}
                  className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-2 text-neutral-800 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/50"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  Karakteristik
                </label>
                <textarea
                  value={formData.characteristics}
                  onChange={(e) =>
                    setFormData({ ...formData, characteristics: e.target.value })
                  }
                  placeholder="Karakteristik cabai (tingkat kepedasan, warna, bentuk, dll)"
                  rows={3}
                  className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-2 text-neutral-800 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/50"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  Kegunaan
                </label>
                <textarea
                  value={formData.uses}
                  onChange={(e) =>
                    setFormData({ ...formData, uses: e.target.value })
                  }
                  placeholder="Kegunaan cabai dalam masakan atau budidaya"
                  rows={3}
                  className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-2 text-neutral-800 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/50"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  Gambar
                </label>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => fileRef.current?.click()}
                    className="flex items-center gap-2 rounded-lg border border-neutral-300 bg-white px-4 py-2 text-neutral-700 hover:bg-neutral-50"
                  >
                    <FaImage size={18} />
                    Pilih Gambar
                  </button>
                  {uploadPreview && (
                    <div className="relative h-20 w-20 overflow-hidden rounded-lg">
                      <Image
                        src={uploadPreview}
                        alt="Preview"
                        layout="fill"
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                <motion.button
                  onClick={handleSave}
                  disabled={isSubmitting}
                  className="flex items-center gap-2 rounded-lg bg-green-500 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:bg-green-600 disabled:opacity-50"
                  whileHover={{ scale: isSubmitting ? 1 : 1.05 }}
                  whileTap={{ scale: isSubmitting ? 1 : 0.95 }}
                >
                  <FaSave size={18} />
                  {isSubmitting ? "Menyimpan..." : "Simpan"}
                </motion.button>
                <button
                  onClick={resetFormState}
                  className="rounded-lg border border-neutral-300 bg-white px-6 py-3 font-semibold text-neutral-700 hover:bg-neutral-50"
                >
                  Batal
                </button>
              </div>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {showLoader ? (
            <div className="col-span-full flex h-60 w-full items-center justify-center">
              <div className="text-center text-neutral-600">
                <div className="mx-auto mb-2 h-10 w-10 animate-spin rounded-full border-4 border-green-500 border-t-transparent" />
                <p>Memuat data cabai...</p>
              </div>
            </div>
          ) : chilies.length === 0 ? (
            <div className="col-span-full rounded-2xl border border-dashed border-neutral-300 bg-white p-10 text-center text-neutral-500">
              <p className="text-lg font-semibold text-neutral-700">
                Belum ada cabai
              </p>
              <p className="mt-2">
                Tambah cabai baru untuk ditampilkan di landing page.
              </p>
            </div>
          ) : (
            chilies.map((chili) => (
              <motion.div
                key={chili.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl bg-white p-4 shadow-lg"
              >
                <div className="relative mb-4 aspect-video w-full overflow-hidden rounded-xl bg-neutral-100">
                  {chili.imageUrl ? (
                    <Image
                      src={chili.imageUrl}
                      alt={chili.name}
                      layout="fill"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <FaImage className="text-neutral-400" size={48} />
                    </div>
                  )}
                </div>
                <h3 className="mb-2 text-lg font-bold text-neutral-800">
                  {chili.name}
                </h3>
                <p className="mb-4 line-clamp-3 text-sm text-neutral-600">
                  {chili.description}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(chili)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-100"
                  >
                    <FaEdit size={14} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(chili.id, chili.name)}
                    disabled={activeActionId === chili.id}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-100 disabled:opacity-50"
                  >
                    <FaTrash size={14} />
                    {activeActionId === chili.id ? "..." : "Hapus"}
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ChiliesManagementPage;

