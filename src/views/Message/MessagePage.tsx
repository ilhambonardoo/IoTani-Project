"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { FaUser, FaPaperPlane, FaTrash, FaTimes } from "react-icons/fa";
import { HiOutlineSearch } from "react-icons/hi";
import { FiRefreshCcw } from "react-icons/fi";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import ConfirmationModal from "@/components/ConfirmationModal/page";

// --- Tipe Data ---

const CATEGORIES = [
  "Hama & Penyakit",
  "Perawatan",
  "Teknologi",
  "Pupuk",
  "Lainnya",
];

interface QuestionReply {
  id: string;
  responderName: string;
  responderRole?: string;
  content: string;
  createdAt: string;
}

interface QuestionThread {
  id: string;
  title: string;
  category: string;
  content: string;
  createdAt: string;
  authorName?: string;
  authorEmail?: string;
  recipientRole?: string;
  replies: QuestionReply[];
}

interface ChatBubble {
  id: string;
  sender: "user" | "admin";
  content: string;
  timestamp: string;
  senderLabel: string;
  replyId?: string;
}

// --- Sub-Component: Modal Form ---

const QuestionFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  userName,
  userEmail,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  isSubmitting: boolean;
  userName: string;
  userEmail: string;
}) => {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    content: "",
    recipientRole: "admin",
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm transition-all">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl rounded-2xl bg-white p-4 sm:p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="mb-6 flex items-center justify-between border-b border-neutral-100 pb-4">
          <div>
            <h3 className="text-xl font-bold text-neutral-800">
              Ajukan Pertanyaan Baru
            </h3>
            <p className="text-sm text-neutral-500">
              Pertanyaan Anda akan diproses oleh tim admin.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600"
          >
            <FaTimes />
          </button>
        </div>

        <div className="space-y-4">
          {/* Read-only User Info */}
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-neutral-700">
                Nama
              </label>
              <input
                type="text"
                value={userName}
                disabled
                className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-2 text-sm text-neutral-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-neutral-700">
                Email
              </label>
              <input
                type="email"
                value={userEmail}
                disabled
                className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-2 text-sm text-neutral-500"
              />
            </div>
          </div>

          {/* Form Input */}
          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">
              Judul Pertanyaan
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full rounded-lg border border-neutral-300 px-4 py-2 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
              placeholder="Contoh: Daun tanaman menguning"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-neutral-700">
                Kategori
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full rounded-lg border border-neutral-300 px-4 py-2 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
              >
                <option value="">Pilih kategori</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-neutral-700">
                Kirim Kepada
              </label>
              <select
                value={formData.recipientRole}
                onChange={(e) =>
                  setFormData({ ...formData, recipientRole: e.target.value })
                }
                className="w-full rounded-lg border border-neutral-300 px-4 py-2 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
              >
                <option value="admin">Admin</option>
                <option value="owner">Owner</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">
              Detail Pertanyaan
            </label>
            <textarea
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              rows={5}
              className="w-full rounded-lg border border-neutral-300 px-4 py-2 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
              placeholder="Ceritakan detail masalah Anda..."
            />
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-100"
            >
              Batal
            </button>
            <button
              onClick={() => onSubmit(formData)}
              disabled={isSubmitting}
              className="flex items-center gap-2 rounded-lg bg-green-600 px-6 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-70"
            >
              {isSubmitting ? (
                "Mengirim..."
              ) : (
                <>
                  <FaPaperPlane size={12} /> Kirim Pertanyaan
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// --- Main Component ---

const MessagePage = () => {
  const { data: session }: { data: any } = useSession();
  const [threads, setThreads] = useState<QuestionThread[]>([]);
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeletingMessage, setIsDeletingMessage] = useState(false);
  const [isDeletingReply, setIsDeletingReply] = useState<string | null>(null);

  const [deleteConfirmModal, setDeleteConfirmModal] = useState({
    isOpen: false,
    type: "message" as "message" | "reply",
    replyId: "",
  });

  const userName = session?.user?.fullName || "";
  const userEmail = session?.user?.email || "";

  // --- Data Fetching ---

  const fetchThreads = async () => {
    if (!userEmail) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch(
        `/api/forum/questions/user?email=${encodeURIComponent(userEmail)}`
      );
      const data = await res.json();
      if (!res.ok || !data.status) {
        throw new Error(data.message || "Gagal mengambil percakapan");
      }
      const list: QuestionThread[] = (data.data || []).map(
        (item: QuestionThread) => ({
          ...item,
          replies: item.replies || [],
        })
      );
      setThreads(list);
      if (!selectedThreadId && list.length > 0) {
        setSelectedThreadId(list[0].id);
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Terjadi kesalahan server";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchThreads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userEmail]);

  // --- Memos ---

  const filteredThreads = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();
    return threads.filter(
      (thread) =>
        thread.title.toLowerCase().includes(keyword) ||
        thread.category.toLowerCase().includes(keyword) ||
        thread.content.toLowerCase().includes(keyword)
    );
  }, [threads, searchTerm]);

  const selectedThread = useMemo(
    () => threads.find((thread) => thread.id === selectedThreadId) || null,
    [threads, selectedThreadId]
  );

  const chatBubbles: ChatBubble[] = useMemo(() => {
    if (!selectedThread) return [];
    const threadBubbles: ChatBubble[] = [
      {
        id: `${selectedThread.id}-question`,
        sender: "user",
        content: selectedThread.content,
        timestamp: selectedThread.createdAt,
        senderLabel: selectedThread.authorName || userName || "Anda",
      },
    ];
    selectedThread.replies.forEach((reply) => {
      threadBubbles.push({
        id: reply.id,
        sender: "admin",
        content: reply.content,
        timestamp: reply.createdAt,
        senderLabel:
          reply.responderName ||
          (reply.responderRole === "Owner" ? "Owner" : "Admin"),
        replyId: reply.id,
      });
    });
    return threadBubbles;
  }, [selectedThread, userName]);

  // --- Handlers ---

  const handleCreateQuestion = async (formData: any) => {
    if (!userName || !userEmail) {
      toast.error("Lengkapi profil Anda terlebih dahulu.");
      return;
    }
    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error("Judul dan pertanyaan tidak boleh kosong");
      return;
    }
    if (!formData.category) {
      toast.error("Pilih kategori pertanyaan");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/forum/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          content: formData.content,
          category: formData.category,
          authorName: userName,
          authorEmail: userEmail,
          authorRole: "user",
          recipientRole: formData.recipientRole,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.status) {
        throw new Error(data.message || "Gagal mengirim pertanyaan");
      }
      toast.success("✅ Pertanyaan berhasil dikirim");
      setShowForm(false);
      await fetchThreads();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Terjadi kesalahan server";
      toast.error(`❌ ${message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteMessage = () => {
    if (!selectedThreadId) return;
    setDeleteConfirmModal({ isOpen: true, type: "message", replyId: "" });
  };

  const handleDeleteReply = (replyId: string) => {
    if (!selectedThreadId) return;
    setDeleteConfirmModal({ isOpen: true, type: "reply", replyId });
  };

  const executeDelete = async () => {
    if (!selectedThreadId) return;
    const isReply = deleteConfirmModal.type === "reply";
    const replyId = deleteConfirmModal.replyId;

    if (isReply) setIsDeletingReply(replyId);
    else setIsDeletingMessage(true);

    setDeleteConfirmModal({ isOpen: false, type: "message", replyId: "" });

    try {
      const endpoint = isReply
        ? `/api/forum/questions/${selectedThreadId}/reply/${replyId}/delete`
        : `/api/forum/questions/${selectedThreadId}/delete`;

      const res = await fetch(endpoint, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      if (!res.ok || !data.status) {
        throw new Error(
          data.message ||
            `Gagal menghapus ${isReply ? "balasan" : "pertanyaan"}`
        );
      }

      toast.success(
        `✅ ${isReply ? "Balasan" : "Pertanyaan"} berhasil dihapus`
      );
      if (!isReply) setSelectedThreadId(null);
      await fetchThreads();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Terjadi kesalahan server";
      toast.error(`❌ ${message}`);
    } finally {
      if (isReply) setIsDeletingReply(null);
      else setIsDeletingMessage(false);
    }
  };

  // --- Render ---

  return (
    <>
      <ConfirmationModal
        isOpen={deleteConfirmModal.isOpen}
        onClose={() =>
          setDeleteConfirmModal({
            isOpen: false,
            type: "message",
            replyId: "",
          })
        }
        onConfirm={executeDelete}
        title={
          deleteConfirmModal.type === "message"
            ? "Hapus Pertanyaan"
            : "Hapus Balasan"
        }
      >
        <p className="text-neutral-700">
          {deleteConfirmModal.type === "message"
            ? "Apakah Anda yakin ingin menghapus pertanyaan ini? Semua balasan juga akan dihapus dan tindakan ini tidak dapat dibatalkan."
            : "Apakah Anda yakin ingin menghapus balasan ini? Tindakan ini tidak dapat dibatalkan."}
        </p>
      </ConfirmationModal>

      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 p-4 sm:p-6 lg:p-8 pt-16 md:pt-4">
        <div className="mx-auto max-w-7xl">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 sm:mb-8"
          >
            <h1 className="text-2xl sm:text-3xl font-bold text-neutral-800 lg:text-4xl text-center md:text-left">
              Pesan
            </h1>
            <p className="mt-2 text-sm sm:text-base text-neutral-600 text-center md:text-left">
              Kelola dan lihat percakapan dengan admin atau owner
            </p>
          </motion.div>

          {!userEmail ? (
            <div className="rounded-2xl bg-white p-12 text-center shadow-sm">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100 text-neutral-400">
                <FaUser size={24} />
              </div>
              <h3 className="text-lg font-medium text-neutral-900">
                Akses Terbatas
              </h3>
              <p className="mt-1 text-neutral-600">
                Silakan masuk terlebih dahulu untuk mengirim pesan.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-4">
              {/* Left Sidebar: Thread List */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="lg:col-span-1 order-2 lg:order-1"
              >
                <div className="flex h-[400px] sm:h-[500px] lg:h-[600px] flex-col rounded-2xl bg-white shadow-lg">
                  {/* Search & Refresh */}
                  <div className="border-b border-neutral-100 p-4 space-y-3">
                    <div className="relative">
                      <HiOutlineSearch
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
                        size={18}
                      />
                      <input
                        type="text"
                        placeholder="Cari pesan..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-10 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                      />
                    </div>
                    <button
                      onClick={() => {
                        fetchThreads();
                        toast.success("✅ Pesan terbaru dimuat");
                      }}
                      disabled={isLoading}
                      className="flex w-full items-center justify-center gap-2 rounded-lg border border-green-100 bg-green-50 px-3 py-2 text-sm font-medium text-green-700 hover:bg-green-100 disabled:opacity-50"
                    >
                      <FiRefreshCcw
                        className={isLoading ? "animate-spin" : ""}
                      />
                      Muat Ulang
                    </button>
                  </div>

                  {/* Thread List */}
                  <div className="flex-1 overflow-y-auto">
                    {isLoading ? (
                      <div className="flex h-32 items-center justify-center text-sm text-neutral-500">
                        Memuat...
                      </div>
                    ) : filteredThreads.length === 0 ? (
                      <div className="p-8 text-center text-sm text-neutral-500">
                        Tidak ada pesan.
                      </div>
                    ) : (
                      <div className="divide-y divide-neutral-100">
                        {filteredThreads.map((thread) => (
                          <button
                            key={thread.id}
                            onClick={() => setSelectedThreadId(thread.id)}
                            className={`w-full p-4 text-left transition-colors hover:bg-neutral-50 ${
                              selectedThreadId === thread.id
                                ? "bg-green-50/60 hover:bg-green-50"
                                : ""
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-green-600 text-white shadow-sm">
                                <FaUser size={14} />
                              </div>
                              <div className="min-w-0 flex-1">
                                <h4 className="truncate font-semibold text-neutral-800">
                                  {thread.title}
                                </h4>
                                <p className="truncate text-sm text-neutral-500">
                                  {thread.replies.length > 0
                                    ? thread.replies[thread.replies.length - 1]
                                        .content
                                    : thread.content}
                                </p>
                                <div className="mt-2 flex flex-wrap items-center gap-2">
                                  <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-medium text-neutral-600">
                                    {thread.category}
                                  </span>
                                  <span
                                    className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                                      thread.recipientRole === "admin"
                                        ? "bg-purple-100 text-purple-700"
                                        : "bg-orange-100 text-orange-700"
                                    }`}
                                  >
                                    {thread.recipientRole === "admin"
                                      ? "Admin"
                                      : "Owner"}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Right Content: Chat Window */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="lg:col-span-3 order-1 lg:order-2"
              >
                <div className="flex h-[400px] sm:h-[500px] lg:h-[600px] flex-col overflow-hidden rounded-2xl bg-white shadow-lg">
                  {selectedThread ? (
                    <>
                      {/* Header Chat */}
                      <div className="flex items-center justify-between border-b border-neutral-100 bg-white p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600">
                            <FaUser />
                          </div>
                          <div>
                            <h3 className="font-bold text-neutral-800">
                              {selectedThread.title}
                            </h3>
                            <p className="text-xs text-neutral-500">
                              {selectedThread.createdAt}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={handleDeleteMessage}
                          disabled={isDeletingMessage}
                          className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600 transition-colors hover:bg-red-100 disabled:opacity-50"
                        >
                          <FaTrash />
                          {isDeletingMessage ? "..." : "Hapus"}
                        </button>
                      </div>

                      {/* Chat Area */}
                      <div className="flex-1 space-y-4 sm:space-y-6 overflow-y-auto bg-neutral-50/50 p-4 sm:p-6">
                        {chatBubbles.length === 0 ? (
                          <p className="text-center text-sm text-neutral-500">
                            Belum ada percakapan.
                          </p>
                        ) : (
                          chatBubbles.map((bubble) => (
                            <motion.div
                              key={bubble.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className={`flex ${
                                bubble.sender === "user"
                                  ? "justify-end"
                                  : "justify-start"
                              }`}
                            >
                              <div className="group relative max-w-[80%] lg:max-w-[70%]">
                                {/* Bubble */}
                                <div
                                  className={`rounded-2xl px-5 py-3 shadow-sm ${
                                    bubble.sender === "user"
                                      ? "bg-green-600 text-white"
                                      : "bg-white text-neutral-800 border border-neutral-100"
                                  }`}
                                >
                                  <div
                                    className={`mb-1 text-xs font-bold ${
                                      bubble.sender === "user"
                                        ? "text-green-100"
                                        : "text-neutral-400"
                                    }`}
                                  >
                                    {bubble.senderLabel}
                                  </div>
                                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                                    {bubble.content}
                                  </p>
                                  <div
                                    className={`mt-2 text-[10px] ${
                                      bubble.sender === "user"
                                        ? "text-green-100"
                                        : "text-neutral-400"
                                    }`}
                                  >
                                    {bubble.timestamp}
                                  </div>
                                </div>

                                {/* Label (User Question) */}
                                {bubble.sender === "user" &&
                                  !bubble.replyId && (
                                    <p className="mt-1 text-right text-[10px] text-neutral-400">
                                      Pertanyaan Anda
                                    </p>
                                  )}

                                {/* Delete Button (Admin Reply) */}
                                {bubble.sender !== "user" && bubble.replyId && (
                                  <button
                                    onClick={() =>
                                      handleDeleteReply(bubble.replyId!)
                                    }
                                    disabled={
                                      isDeletingReply === bubble.replyId
                                    }
                                    className="absolute -right-8 top-2 opacity-0 transition-opacity group-hover:opacity-100 disabled:opacity-50 text-red-400 hover:text-red-600"
                                    title="Hapus balasan ini"
                                  >
                                    <FaTrash size={12} />
                                  </button>
                                )}
                              </div>
                            </motion.div>
                          ))
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center p-8 text-center text-neutral-500">
                      <div className="mb-4 rounded-full bg-green-50 p-4 text-green-500">
                        <FaPaperPlane size={32} />
                      </div>
                      <h3 className="text-lg font-medium text-neutral-800">
                        Belum ada pesan dipilih
                      </h3>
                      <p className="mt-2 max-w-xs text-sm">
                        Pilih percakapan dari daftar di sebelah kiri untuk
                        melihat detail atau buat pertanyaan baru.
                      </p>
                    </div>
                  )}

                  {/* Bottom Action Bar (Always Visible) */}
                  <div className="border-t border-neutral-100 bg-white p-4">
                    <button
                      onClick={() => setShowForm(true)}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 py-3 text-sm font-semibold text-white shadow-lg shadow-green-600/20 transition-all hover:bg-green-700 hover:shadow-green-600/30 active:scale-[0.98]"
                    >
                      <FaPaperPlane />
                      Buat Pertanyaan Baru
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </div>

        {/* Modal Component */}
        <AnimatePresence>
          {showForm && (
            <QuestionFormModal
              isOpen={showForm}
              onClose={() => setShowForm(false)}
              onSubmit={handleCreateQuestion}
              isSubmitting={isSubmitting}
              userName={userName}
              userEmail={userEmail}
            />
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default MessagePage;
