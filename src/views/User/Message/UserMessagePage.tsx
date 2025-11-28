"use client";

import { AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import ConfirmationModal from "@/components/ui/ConfirmationModal/page";
import { useAuth, useQuestions } from "@/hooks";
import MessageHeader from "./MessageHeader";
import QuestionFormModal from "../../../components/ui/QuestionFormModal";
import MessageSidebar from "./MessageSidebar";
import MessageChat from "./MessageChat";
import MessageAccessDenied from "./MessageAccessDenied";
import type { QuestionFormData } from "@/types";
import { formatChatBubbles } from "@/lib/utils/formatHelper";

const MessagePage = () => {
  const { fullName: userName, email: userEmail } = useAuth();
  const {
    threads,
    filteredThreads,
    isLoading,
    searchTerm,
    setSearchTerm,
    refetch: refetchThreads,
  } = useQuestions();
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeletingMessage, setIsDeletingMessage] = useState(false);
  const [isDeletingReply, setIsDeletingReply] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [isSendingReply, setIsSendingReply] = useState(false);

  const [deleteConfirmModal, setDeleteConfirmModal] = useState({
    isOpen: false,
    type: "message" as "message" | "reply",
    replyId: "",
  });

  useEffect(() => {
    if (!selectedThreadId && threads.length > 0) {
      setSelectedThreadId(threads[0].id);
    }
  }, [threads, selectedThreadId]);

  const selectedThread = useMemo(
    () => threads.find((thread) => thread.id === selectedThreadId) || null,
    [threads, selectedThreadId]
  );

  const chatBubbles = useMemo(
    () => formatChatBubbles(selectedThread),
    [selectedThread]
  );

  const handleCreateQuestion = async (formData: QuestionFormData) => {
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
      await refetchThreads();
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
      await refetchThreads();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Terjadi kesalahan server";
      toast.error(`❌ ${message}`);
    } finally {
      if (isReply) setIsDeletingReply(null);
      else setIsDeletingMessage(false);
    }
  };
  const handleReply = async () => {
    if (!selectedThreadId) {
      toast.error("Tidak ada percakapan yang dipilih");
      return;
    }

    if (!replyText.trim()) {
      toast.error("Isi balasan tidak boleh kosong");
      return;
    }

    setIsSendingReply(true);
    try {
      const res = await fetch(
        `/api/forum/questions/${selectedThreadId}/reply`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content: replyText,
            responderName: userName || "User",
            responderRole: "user",
            responderEmail: userEmail,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok || !data.status) {
        throw new Error(data.message || "Gagal mengirim balasan");
      }

      toast.success("✅ Balasan terkirim");
      setReplyText(""); // Reset text area
      await refetchThreads(); // Refresh data chat agar balasan muncul
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Gagal mengirim balasan";
      toast.error(`❌ ${message}`);
    } finally {
      setIsSendingReply(false);
    }
  };

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

      <div className="min-h-screen bg-linear-to-br from-neutral-50 to-neutral-100 p-4 sm:p-6 lg:p-8 pt-16 md:pt-4">
        <div className="mx-auto max-w-7xl">
          <MessageHeader onCreateQuestion={() => setShowForm(true)} />

          {!userEmail ? (
            <MessageAccessDenied />
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-4 lg:flex lg:gap-8">
              <MessageSidebar
                searchTerm={searchTerm}
                isLoading={isLoading}
                filteredThreads={filteredThreads}
                selectedThreadId={selectedThreadId}
                onSearchChange={setSearchTerm}
                onRefresh={refetchThreads}
                onThreadSelect={setSelectedThreadId}
              />
              <MessageChat
                selectedThread={selectedThread}
                chatBubbles={chatBubbles}
                isDeletingMessage={isDeletingMessage}
                isDeletingReply={isDeletingReply}
                onDeleteMessage={handleDeleteMessage}
                onDeleteReply={handleDeleteReply}
                onCreateQuestion={() => setShowForm(true)}
                onReplyTextChange={setReplyText}
                replyText={replyText}
                onReply={handleReply}
                isSendingReply={isSendingReply}
              />
            </div>
          )}
        </div>
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
