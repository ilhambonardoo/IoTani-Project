"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { FaUser, FaPaperPlane, FaTrash } from "react-icons/fa";
import { HiOutlineSearch } from "react-icons/hi";
import { FiRefreshCcw } from "react-icons/fi";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import ConfirmationModal from "@/components/ConfirmationModal/page";

// --- Interface Definitions ---
interface QuestionReply {
  id: string;
  responderName: string;
  responderRole?: string;
  content: string;
  createdAt: string;
}

interface QuestionMessage {
  id: string;
  authorName: string;
  authorEmail?: string;
  authorRole?: string;
  recipientRole?: string;
  category: string;
  title: string;
  content: string;
  createdAt: string;
  replies?: QuestionReply[];
}

interface ExtendedSessionUser {
  email?: string | null;
  name?: string | null;
  fullName?: string | null;
  role?: string | null;
}

const OwnerMessagePage = () => {

  const { data: session } = useSession();
  const sessionUser = session?.user as ExtendedSessionUser | undefined
  const [selectedMessage, setSelectedMessage] =
    useState<QuestionMessage | null>(null);
  const [replyText, setReplyText] = useState("");
  const [messages, setMessages] = useState<QuestionMessage[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [senderRoleFilter, setSenderRoleFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isSendingReply, setIsSendingReply] = useState(false);

  // State untuk Delete
  const [isDeletingMessage, setIsDeletingMessage] = useState(false);
  const [isDeletingReply, setIsDeletingReply] = useState<string | null>(null);
  const [deleteConfirmModal, setDeleteConfirmModal] = useState({
    isOpen: false,
    type: "message" as "message" | "reply",
    replyId: "",
  });

  // --- Responder Info (Owner) ---
  const responderName =
  sessionUser?.fullName || sessionUser?.name || sessionUser?.email || "Owner";

  // Hardcoded role untuk halaman ini
  const responderRole = "Owner";

  // --- Fetch Data ---
  const fetchMessages = async (
    withToast?: boolean,
    focusMessageId?: string
  ) => {
    setIsLoading(true);
    try {
      // Logic khusus Owner: recipientRole selalu 'owner'
      const url =
        senderRoleFilter !== "all"
          ? `/api/forum/questions?recipientRole=owner&authorRole=${senderRoleFilter}`
          : `/api/forum/questions?recipientRole=owner`;

      const res = await fetch(url);
      const data = await res.json();

      if (!res.ok || !data.status) {
        throw new Error(data.message || "Gagal memuat pesan owner");
      }

      const questionList: QuestionMessage[] = Array.isArray(data.data)
        ? data.data
        : [];

      setMessages(questionList);

      // Logic pemilihan pesan otomatis setelah refresh
      const targetId = focusMessageId || selectedMessage?.id;
      if (targetId) {
        const focused = questionList.find((item) => item.id === targetId);
        setSelectedMessage(focused || questionList[0] || null);
      } else if (!selectedMessage && questionList.length > 0) {
        setSelectedMessage(questionList[0]);
      }

      if (withToast) {
        toast.success("✅ Pesan terbaru berhasil dimuat");
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Terjadi kesalahan server";
      if (withToast) {
        toast.error(`❌ ${message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [senderRoleFilter]);

  // --- Filtering ---
  const filteredMessages = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();
    return messages.filter((message) => {
      return (
        message.authorName.toLowerCase().includes(keyword) ||
        message.title.toLowerCase().includes(keyword) ||
        message.content.toLowerCase().includes(keyword) ||
        message.category.toLowerCase().includes(keyword)
      );
    });
  }, [messages, searchTerm]);

  // --- Handlers ---
  const handleReply = async () => {
    if (!selectedMessage) {
      toast.error("Tidak ada pesan yang dipilih");
      return;
    }
    if (!replyText.trim()) {
      toast.error("Isi balasan tidak boleh kosong");
      return;
    }

    setIsSendingReply(true);
    try {
      const res = await fetch(
        `/api/forum/questions/${selectedMessage.id}/reply`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content: replyText,
            responderName,
            responderRole,
          }),
        }
      );
      const data = await res.json();
      if (!res.ok || !data.status) {
        throw new Error(data.message || "Gagal mengirim balasan");
      }

      toast.success("✅ Balasan terkirim");
      setReplyText("");
      await fetchMessages(false, selectedMessage.id);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Terjadi kesalahan server";
      toast.error(`❌ ${message}`);
    } finally {
      setIsSendingReply(false);
    }
  };

  const handleDeleteMessage = async () => {
    if (!selectedMessage) {
      toast.error("Tidak ada pesan yang dipilih");
      return;
    }
    setDeleteConfirmModal({ isOpen: true, type: "message", replyId: "" });
  };

  const confirmDeleteMessage = async () => {
    if (!selectedMessage) return;

    setIsDeletingMessage(true);
    setDeleteConfirmModal({ isOpen: false, type: "message", replyId: "" });
    try {
      const res = await fetch(
        `/api/forum/questions/${selectedMessage.id}/delete`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        }
      );
      const data = await res.json();
      if (!res.ok || !data.status) {
        throw new Error(data.message || "Gagal menghapus pesan");
      }

      toast.success("✅ Pesan berhasil dihapus");
      setSelectedMessage(null);
      await fetchMessages(false);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Terjadi kesalahan server";
      toast.error(`❌ ${message}`);
    } finally {
      setIsDeletingMessage(false);
    }
  };

  const handleDeleteReply = async (replyId: string) => {
    if (!selectedMessage) {
      toast.error("Tidak ada pesan yang dipilih");
      return;
    }
    setDeleteConfirmModal({ isOpen: true, type: "reply", replyId });
  };

  const confirmDeleteReply = async () => {
    if (!selectedMessage || !deleteConfirmModal.replyId) return;

    const replyId = deleteConfirmModal.replyId;
    setIsDeletingReply(replyId);
    setDeleteConfirmModal({ isOpen: false, type: "message", replyId: "" });
    try {
      const res = await fetch(
        `/api/forum/questions/${selectedMessage.id}/reply/${replyId}/delete`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        }
      );
      const data = await res.json();
      if (!res.ok || !data.status) {
        throw new Error(data.message || "Gagal menghapus balasan");
      }

      toast.success("✅ Balasan berhasil dihapus");
      await fetchMessages(false, selectedMessage.id);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Terjadi kesalahan server";
      toast.error(`❌ ${message}`);
    } finally {
      setIsDeletingReply(null);
    }
  };

  // --- Chat Bubble Logic ---
  const chatBubbles = useMemo(() => {
    if (!selectedMessage) return [];
    const bubbles: Array<{
      id: string;
      sender: "user" | "owner";
      content: string;
      timestamp: string;
      senderLabel: string;
      replyId?: string;
    }> = [
      {
        id: `${selectedMessage.id}-question`,
        sender: "user",
        content: selectedMessage.content,
        timestamp: selectedMessage.createdAt,
        senderLabel: selectedMessage.authorName || "Pengguna",
      },
    ];
    selectedMessage.replies?.forEach((reply) => {
      bubbles.push({
        id: reply.id,
        sender: "owner",
        content: reply.content,
        timestamp: reply.createdAt,
        senderLabel: reply.responderName || "Owner",
        replyId: reply.id,
      });
    });
    return bubbles;
  }, [selectedMessage]);

  return (
    <>
      {/* Modal Konfirmasi Delete */}
      <ConfirmationModal
        isOpen={deleteConfirmModal.isOpen}
        onClose={() =>
          setDeleteConfirmModal({ isOpen: false, type: "message", replyId: "" })
        }
        onConfirm={
          deleteConfirmModal.type === "message"
            ? confirmDeleteMessage
            : confirmDeleteReply
        }
        title={
          deleteConfirmModal.type === "message"
            ? "Hapus Pesan"
            : "Hapus Balasan"
        }
      >
        {deleteConfirmModal.type === "message" ? (
          <p className="text-neutral-700">
            Apakah Anda yakin ingin menghapus pesan ini? Semua percakapan akan
            dihapus dan tindakan ini tidak dapat dibatalkan.
          </p>
        ) : (
          <p className="text-neutral-700">
            Apakah Anda yakin ingin menghapus balasan ini? Tindakan ini tidak
            dapat dibatalkan.
          </p>
        )}
      </ConfirmationModal>

      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 p-4 sm:p-6 lg:p-8 pt-16 md:pt-4">
        <div className="mx-auto max-w-7xl">
          {/* Header Page */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 sm:mb-8"
          >
            <h1 className="text-2xl sm:text-3xl font-bold text-neutral-800 lg:text-4xl text-center md:text-left">
              Owner Inbox
            </h1>
            <p className="mt-2 text-sm sm:text-base text-neutral-600 text-center md:text-left">
              Kelola pesan yang masuk ke Owner
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
            {/* Kolom Kiri: List Pesan */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1"
            >
              <div className="rounded-2xl bg-white shadow-lg">
                {/* Search & Filter Section */}
                <div className="border-b border-neutral-200 p-4 space-y-3">
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
                      className="w-full rounded-lg border border-neutral-300 bg-neutral-50 px-10 py-2 text-sm text-neutral-800 placeholder-neutral-400 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/50"
                    />
                  </div>
                  <select
                    value={senderRoleFilter}
                    onChange={(e) => setSenderRoleFilter(e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-800 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/50"
                  >
                    <option value="all">Semua Pengirim</option>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                  <button
                    onClick={() => fetchMessages(true)}
                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-green-200 bg-white px-3 py-2 text-sm font-medium text-green-600 transition-all hover:bg-green-50 disabled:opacity-50"
                    disabled={isLoading}
                  >
                    <FiRefreshCcw
                      size={16}
                      className={isLoading ? "animate-spin" : "text-green-600"}
                    />
                    Muat ulang
                  </button>
                </div>

                {/* List Pesan Scrollable */}
                <div className="max-h-[600px] overflow-y-auto">
                  {isLoading ? (
                    <div className="flex h-40 items-center justify-center text-sm text-neutral-500">
                      Memuat pesan...
                    </div>
                  ) : filteredMessages.length === 0 ? (
                    <div className="p-6 text-center text-sm text-neutral-500">
                      Tidak ada pesan ditemukan.
                    </div>
                  ) : (
                    filteredMessages.map((message) => (
                      <button
                        key={message.id}
                        onClick={() => setSelectedMessage(message)}
                        className={`w-full border-b border-neutral-200 p-4 text-left transition-all hover:bg-neutral-50 ${
                          selectedMessage?.id === message.id
                            ? "bg-green-50"
                            : ""
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500 text-white">
                            <FaUser size={16} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-2">
                              <h3 className="truncate font-semibold text-neutral-800">
                                {message.authorName}
                              </h3>
                            </div>
                            <p className="mt-1 truncate text-sm text-neutral-600">
                              {message.title}
                            </p>
                            <p className="mt-1 text-xs text-neutral-400">
                              {message.createdAt}
                            </p>
                          </div>
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                          <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-[11px] font-medium text-green-700">
                            {message.category}
                          </span>
                          {message.authorRole && (
                            <span
                              className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${
                                message.authorRole === "user"
                                  ? "bg-blue-100 text-blue-700"
                                  : message.authorRole === "admin"
                                  ? "bg-purple-100 text-purple-700"
                                  : "bg-orange-100 text-orange-700"
                              }`}
                            >
                              {message.authorRole === "user"
                                ? "User"
                                : message.authorRole === "admin"
                                ? "Admin"
                                : "Owner"}
                            </span>
                          )}
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            </motion.div>

            {/* Kolom Kanan: Detail Pesan / Chat View */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-3"
            >
              <div className="flex h-[600px] flex-col rounded-2xl bg-white shadow-lg">
                {selectedMessage ? (
                  <>
                    {/* Header Chat */}
                    <div className="border-b border-neutral-200 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500 text-white">
                            <FaUser size={18} />
                          </div>
                          <div>
                            <h3 className="font-semibold text-neutral-800">
                              {selectedMessage.title}
                            </h3>
                            <p className="text-xs text-neutral-500">
                              Dari: {selectedMessage.authorName} • Kategori:{" "}
                              {selectedMessage.category}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={handleDeleteMessage}
                          disabled={isDeletingMessage}
                          className="flex items-center gap-2 rounded-lg bg-red-100 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-200 transition-all disabled:opacity-50"
                        >
                          <FaTrash size={12} />
                          {isDeletingMessage ? "Menghapus..." : "Hapus"}
                        </button>
                      </div>
                    </div>

                    {/* Area Chat */}
                    <div className="flex-1 space-y-4 overflow-y-auto bg-neutral-50 p-4">
                      {chatBubbles.map((bubble) => (
                        <motion.div
                          key={bubble.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex ${
                            bubble.sender === "user"
                              ? "justify-start"
                              : "justify-end"
                          }`}
                        >
                          <div className="group relative">
                            <div
                              className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                                bubble.sender === "user"
                                  ? "bg-white text-neutral-800 shadow-md"
                                  : "bg-green-500 text-white"
                              }`}
                            >
                              <div
                                className={`text-xs font-semibold ${
                                  bubble.sender === "user"
                                    ? "text-neutral-500"
                                    : "text-green-100"
                                }`}
                              >
                                {bubble.senderLabel}
                              </div>
                              <p className="text-sm">{bubble.content}</p>
                              <p
                                className={`mt-1 text-xs ${
                                  bubble.sender === "user"
                                    ? "text-neutral-400"
                                    : "text-green-100"
                                }`}
                              >
                                {bubble.timestamp}
                              </p>
                            </div>
                            {/* Tombol Hapus Reply (Hanya untuk balasan owner) */}
                            {bubble.sender !== "user" && bubble.replyId && (
                              <button
                                onClick={() =>
                                  handleDeleteReply(bubble.replyId!)
                                }
                                disabled={isDeletingReply === bubble.replyId}
                                className="absolute -right-8 top-0 rounded p-2 text-red-600 opacity-0 transition-all hover:bg-red-100 group-hover:opacity-100 disabled:opacity-50"
                                title="Hapus balasan"
                              >
                                <FaTrash size={12} />
                              </button>
                            )}
                          </div>
                        </motion.div>
                      ))}
                      {chatBubbles.length === 0 && (
                        <p className="text-center text-sm text-neutral-500">
                          Belum ada pesan dalam percakapan ini.
                        </p>
                      )}
                    </div>

                    {/* Input Balasan */}
                    <div className="border-t border-neutral-200 bg-white p-4">
                      <div className="flex gap-3">
                        <textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Tulis balasan..."
                          rows={3}
                          className="flex-1 rounded-lg border border-neutral-300 px-4 py-2 text-sm text-neutral-800 placeholder-neutral-400 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/50"
                        />
                        <motion.button
                          onClick={handleReply}
                          disabled={isSendingReply || !replyText.trim()}
                          className="flex items-center gap-2 rounded-lg bg-green-500 px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-50"
                          whileHover={{ scale: isSendingReply ? 1 : 1.02 }}
                          whileTap={{ scale: isSendingReply ? 1 : 0.98 }}
                        >
                          <FaPaperPlane size={14} />
                          {isSendingReply ? "Mengirim..." : "Kirim"}
                        </motion.button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex h-full items-center justify-center text-neutral-500">
                    Pilih pesan untuk melihat detail dan membalas.
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OwnerMessagePage;



