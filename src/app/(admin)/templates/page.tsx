"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaPaperPlane } from "react-icons/fa";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import ConfirmationModal from "@/components/ConfirmationModal/page";

interface Template {
  id: string;
  name: string;
  title: string;
  content: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

interface ExtendedSessionUser {
  email?: string | null;
  name?: string | null;
  fullName?: string | null;
  role?: string | null;
}

const TemplateManagementPage = () => {
  const { data: session } = useSession();
  const sessionUser = session?.user as ExtendedSessionUser | undefined;
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, id: "" });
  const [sendConfirm, setSendConfirm] = useState({
    isOpen: false,
    id: "",
    targetRole: "user" as "user" | "admin" | "owner" | "all",
  });
  const [isSending, setIsSending] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    title: "",
    content: "",
    category: "Umum",
  });

  const senderName =
    sessionUser?.fullName || sessionUser?.name || "Admin System";

  // Fetch templates
  const fetchTemplates = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/templates");
      const data = await res.json();
      if (!res.ok || !data.status) {
        throw new Error(data.message || "Gagal memuat templates");
      }
      setTemplates(data.data || []);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Terjadi kesalahan server";
      toast.error(`❌ ${message}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  // Handle form submit
  const handleSubmit = async () => {
    if (
      !formData.name.trim() ||
      !formData.title.trim() ||
      !formData.content.trim()
    ) {
      toast.error("Semua field wajib diisi");
      return;
    }

    setIsSubmitting(true);
    try {
      const method = editingTemplate ? "PUT" : "POST";
      const url = editingTemplate
        ? `/api/templates/${editingTemplate.id}`
        : "/api/templates";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok || !data.status) {
        throw new Error(data.message || "Gagal menyimpan template");
      }

      toast.success(
        `✅ Template berhasil ${editingTemplate ? "diperbarui" : "dibuat"}`
      );
      setIsFormOpen(false);
      setEditingTemplate(null);
      setFormData({ name: "", title: "", content: "", category: "Umum" });
      await fetchTemplates();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Terjadi kesalahan server";
      toast.error(`❌ ${message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete
  const confirmDelete = async () => {
    if (!deleteConfirm.id) return;

    try {
      const res = await fetch(`/api/templates/${deleteConfirm.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok || !data.status) {
        throw new Error(data.message || "Gagal menghapus template");
      }

      toast.success("✅ Template berhasil dihapus");
      setDeleteConfirm({ isOpen: false, id: "" });
      await fetchTemplates();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Terjadi kesalahan server";
      toast.error(`❌ ${message}`);
    }
  };

  // Handle send template
  const confirmSend = async () => {
    if (!sendConfirm.id) return;

    setIsSending(true);
    try {
      const res = await fetch(`/api/templates/${sendConfirm.id}/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetRole: sendConfirm.targetRole,
          senderName,
          senderRole: "admin",
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.status) {
        throw new Error(data.message || "Gagal mengirim template");
      }

      toast.success(
        `✅ Template berhasil dikirim ke ${data.data?.sentCount || 0} pengguna`
      );
      setSendConfirm({ isOpen: false, id: "", targetRole: "user" });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Terjadi kesalahan server";
      toast.error(`❌ ${message}`);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 p-4 sm:p-6 lg:p-8 pt-16 md:pt-4">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8 flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div className="w-full sm:w-auto">
            <h1 className="text-2xl sm:text-3xl font-bold text-neutral-800 lg:text-4xl text-center sm:text-left">
              Template Pesan
            </h1>
            <p className="mt-2 text-sm sm:text-base text-neutral-600 text-center sm:text-left">
              Kelola template pesan untuk dikirim ke pengguna
            </p>
          </div>
          <motion.button
            onClick={() => {
              setEditingTemplate(null);
              setFormData({
                name: "",
                title: "",
                content: "",
                category: "Umum",
              });
              setIsFormOpen(true);
            }}
            className="flex items-center gap-2 rounded-lg bg-green-500 px-6 py-3 font-semibold text-white transition-all hover:bg-green-600"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaPlus size={18} />
            Template Baru
          </motion.button>
        </motion.div>

        {/* Form Modal */}
        <AnimatePresence>
          {isFormOpen && (
            <motion.div
              key="form-overlay"
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
              onClick={() => setIsFormOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                key="form-modal"
                className="relative w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl"
                onClick={(e) => e.stopPropagation()}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
              >
                <h2 className="mb-4 text-2xl font-bold text-neutral-800">
                  {editingTemplate ? "Edit Template" : "Template Baru"}
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700">
                      Nama Template
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="Misal: Pengingat Verifikasi Akun"
                      className="mt-1 w-full rounded-lg border border-neutral-300 px-4 py-2 text-neutral-800 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700">
                      Judul Pesan
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      placeholder="Judul yang akan ditampilkan"
                      className="mt-1 w-full rounded-lg border border-neutral-300 px-4 py-2 text-neutral-800 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700">
                      Kategori
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      className="mt-1 w-full rounded-lg border border-neutral-300 px-4 py-2 text-neutral-800 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/50"
                    >
                      <option value="Umum">Umum</option>
                      <option value="Pengingat">Pengingat</option>
                      <option value="Update">Update</option>
                      <option value="Penting">Penting</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700">
                      Isi Pesan
                    </label>
                    <textarea
                      value={formData.content}
                      onChange={(e) =>
                        setFormData({ ...formData, content: e.target.value })
                      }
                      placeholder="Isi pesan template..."
                      rows={6}
                      className="mt-1 w-full rounded-lg border border-neutral-300 px-4 py-2 text-neutral-800 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/50"
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <motion.button
                    onClick={() => setIsFormOpen(false)}
                    className="rounded-lg bg-neutral-200 px-6 py-2 font-semibold text-neutral-700 transition-all hover:bg-neutral-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Batal
                  </motion.button>
                  <motion.button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex items-center gap-2 rounded-lg bg-green-500 px-6 py-2 font-semibold text-white transition-all hover:bg-green-600 disabled:opacity-50"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isSubmitting ? "Menyimpan..." : "Simpan"}
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Templates List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {isLoading ? (
            <div className="flex h-40 items-center justify-center rounded-2xl bg-white shadow-lg text-neutral-500">
              Memuat templates...
            </div>
          ) : templates.length === 0 ? (
            <div className="flex h-40 items-center justify-center rounded-2xl bg-white shadow-lg text-neutral-500">
              Belum ada template. Buat template baru untuk memulai.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {templates.map((template) => (
                <motion.div
                  key={template.id}
                  className="rounded-2xl bg-white p-6 shadow-lg hover:shadow-xl transition-all"
                  whileHover={{ y: -5 }}
                >
                  <div className="mb-3 flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-neutral-800">
                        {template.name}
                      </h3>
                      <p className="text-xs text-neutral-500">
                        {template.createdAt}
                      </p>
                    </div>
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                      {template.category}
                    </span>
                  </div>

                  <p className="mb-4 text-sm font-medium text-neutral-700">
                    {template.title}
                  </p>

                  <p className="mb-4 line-clamp-2 text-sm text-neutral-600">
                    {template.content}
                  </p>

                  <div className="flex gap-2">
                    <motion.button
                      onClick={() => {
                        setEditingTemplate(template);
                        setFormData({
                          name: template.name,
                          title: template.title,
                          content: template.content,
                          category: template.category,
                        });
                        setIsFormOpen(true);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-blue-100 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-200 transition-all"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <FaEdit size={14} />
                      Edit
                    </motion.button>

                    <motion.button
                      onClick={() =>
                        setSendConfirm({
                          isOpen: true,
                          id: template.id,
                          targetRole: "user",
                        })
                      }
                      className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-green-100 px-3 py-2 text-sm font-medium text-green-700 hover:bg-green-200 transition-all"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <FaPaperPlane size={14} />
                      Kirim
                    </motion.button>

                    <motion.button
                      onClick={() =>
                        setDeleteConfirm({ isOpen: true, id: template.id })
                      }
                      className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-red-100 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-200 transition-all"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <FaTrash size={14} />
                      Hapus
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Delete Confirmation Modal */}
        <ConfirmationModal
          isOpen={deleteConfirm.isOpen}
          onClose={() => setDeleteConfirm({ isOpen: false, id: "" })}
          onConfirm={confirmDelete}
          title="Hapus Template"
        >
          <p className="text-neutral-700">
            Apakah Anda yakin ingin menghapus template ini?
          </p>
        </ConfirmationModal>

        {/* Send Template Modal */}
        <AnimatePresence>
          {sendConfirm.isOpen && (
            <motion.div
              key="send-overlay"
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
              onClick={() =>
                setSendConfirm({ isOpen: false, id: "", targetRole: "user" })
              }
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                key="send-modal"
                className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
                onClick={(e) => e.stopPropagation()}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
              >
                <h2 className="mb-4 text-2xl font-bold text-neutral-800">
                  Kirim Template
                </h2>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Kirim ke
                  </label>
                  <select
                    value={sendConfirm.targetRole}
                    onChange={(e) =>
                      setSendConfirm({
                        ...sendConfirm,
                        targetRole: e.target.value as
                          | "user"
                          | "admin"
                          | "owner"
                          | "all",
                      })
                    }
                    className="w-full rounded-lg border border-neutral-300 px-4 py-2 text-neutral-800 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/50"
                  >
                    <option value="user">Semua User</option>
                    <option value="admin">Semua Admin</option>
                    <option value="owner">Semua Owner</option>
                    <option value="all">Semua Pengguna</option>
                  </select>
                </div>

                <p className="mb-6 text-sm text-neutral-600">
                  Template ini akan dikirim sebagai pesan baru kepada pengguna
                  yang dipilih.
                </p>

                <div className="flex justify-end gap-3">
                  <motion.button
                    onClick={() =>
                      setSendConfirm({
                        isOpen: false,
                        id: "",
                        targetRole: "user",
                      })
                    }
                    className="rounded-lg bg-neutral-200 px-6 py-2 font-semibold text-neutral-700 transition-all hover:bg-neutral-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Batal
                  </motion.button>
                  <motion.button
                    onClick={confirmSend}
                    disabled={isSending}
                    className="flex items-center gap-2 rounded-lg bg-green-500 px-6 py-2 font-semibold text-white transition-all hover:bg-green-600 disabled:opacity-50"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaPaperPlane size={16} />
                    {isSending ? "Mengirim..." : "Kirim"}
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TemplateManagementPage;
