"use client";

import { useState, useMemo } from "react";
import { AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import ConfirmationModal from "@/components/ui/ConfirmationModal/page";
import { useAuth, useMessages, useConfirmModal } from "@/hooks";
import AdminMessageHeader from "./AdminMessageHeader";
import MessageSidebar from "./MessageSidebar";
import MessageChat from "./MessageChat";
import QuestionFormModal from "@/components/ui/QuestionFormModal";
import { formatChatBubbles } from "@/lib/utils/formatHelper";
import type { QuestionFormData } from "@/types";

const AdminMessagePage = () => {
  const { user: sessionUser } = useAuth();
  const {
    filteredMessages,
    selectedMessage,
    setSelectedMessage,
    isLoading,
    searchTerm,
    setSearchTerm,
    senderRoleFilter,
    setSenderRoleFilter,
    refetch: fetchMessages,
    deleteMessage,
    deleteReply,
    isModalOpen,
    setIsModalOpen,
    isSubmitting,
    createMessage,
  } = useMessages();

  const [replyText, setReplyText] = useState("");
  const [isSendingReply, setIsSendingReply] = useState(false);
  const [isDeletingMessage, setIsDeletingMessage] = useState(false);
  const [isDeletingReply, setIsDeletingReply] = useState<string | null>(null);
  const deleteConfirmModal = useConfirmModal();

  const handleCreateMessage = async (formData: QuestionFormData) => {
    try {
      await createMessage(formData);
      await fetchMessages(false);
    } catch {
      // Error sudah di-handle di createMessage
    }
  };

  const responderName =
    sessionUser?.fullName || sessionUser?.name || sessionUser?.email || "Admin";

  const responderRole = sessionUser?.role === "admin" ? "admin" : "owner";

  const handleReply = async () => {
    if (!selectedMessage) {
      toast.error("Tidak ada pertanyaan yang dipilih");
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
      setReplyText(""); // Reset text area
      await fetchMessages(false, selectedMessage.id); // Refresh data chat agar balasan muncul
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Gagal mengirim balasan";
      toast.error(`❌ ${message}`);
    } finally {
      setIsSendingReply(false);
    }
  };

  const handleDeleteMessage = async () => {
    if (!selectedMessage) {
      toast.error("Tidak ada pertanyaan yang dipilih");
      return;
    }

    deleteConfirmModal.open("message");
  };

  const confirmDeleteMessage = async () => {
    if (!selectedMessage) return;

    setIsDeletingMessage(true);
    deleteConfirmModal.close();
    try {
      await deleteMessage(selectedMessage.id);
      setSelectedMessage(null);
    } catch {
      return {};
    } finally {
      setIsDeletingMessage(false);
    }
  };

  const handleDeleteReply = async (replyId: string) => {
    if (!selectedMessage) {
      toast.error("Tidak ada pertanyaan yang dipilih");
      return;
    }

    deleteConfirmModal.open("reply", replyId);
  };

  const confirmDeleteReply = async () => {
    if (!selectedMessage || !deleteConfirmModal.replyId) return;

    const replyId = deleteConfirmModal.replyId;
    setIsDeletingReply(replyId);
    deleteConfirmModal.close();
    try {
      await deleteReply(selectedMessage.id, replyId);
    } catch {
      // Error sudah di-handle di hook
    } finally {
      setIsDeletingReply(null);
    }
  };

  const chatBubbles = useMemo(
    () => formatChatBubbles(selectedMessage),
    [selectedMessage]
  );

  return (
    <>
      <ConfirmationModal
        isOpen={deleteConfirmModal.isOpen}
        onClose={deleteConfirmModal.close}
        onConfirm={
          deleteConfirmModal.type === "message"
            ? confirmDeleteMessage
            : confirmDeleteReply
        }
        title={
          deleteConfirmModal.type === "message"
            ? "Hapus Pertanyaan"
            : "Hapus Balasan"
        }
        userName={responderName}
      >
        {deleteConfirmModal.type === "message" ? (
          <p className="text-neutral-700">
            Apakah Anda yakin ingin menghapus pertanyaan ini? Semua balasan juga
            akan dihapus dan tindakan ini tidak dapat dibatalkan.
          </p>
        ) : (
          <p className="text-neutral-700">
            Apakah Anda yakin ingin menghapus balasan ini? Tindakan ini tidak
            dapat dibatalkan.
          </p>
        )}
      </ConfirmationModal>
      <div className="min-h-screen bg-linear-to-br from-neutral-50 to-neutral-100 p-4 sm:p-6 lg:p-8 pt-16 md:pt-4">
        <div className="mx-auto max-w-7xl">
          <AdminMessageHeader onCreateMessage={() => setIsModalOpen(true)} />
          <div className="grid grid-cols-1 gap-6 lg:flex lg:gap-8 mt-6 lg:mt-8">
            <MessageSidebar
              searchTerm={searchTerm}
              senderRoleFilter={senderRoleFilter}
              isLoading={isLoading}
              filteredMessages={filteredMessages}
              selectedMessage={selectedMessage}
              onSearchChange={setSearchTerm}
              onFilterChange={(value: string) =>
                setSenderRoleFilter(value as "admin" | "owner" | "user" | "all")
              }
              onRefresh={fetchMessages}
              onMessageSelect={setSelectedMessage}
            />

            <MessageChat
              selectedMessage={selectedMessage}
              chatBubbles={chatBubbles}
              replyText={replyText}
              isSendingReply={isSendingReply}
              isDeletingMessage={isDeletingMessage}
              isDeletingReply={isDeletingReply}
              onReplyTextChange={setReplyText}
              onReply={handleReply}
              onDeleteMessage={handleDeleteMessage}
              onDeleteReply={handleDeleteReply}
            />
          </div>
        </div>
        <AnimatePresence>
          {isModalOpen && (
            <QuestionFormModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onSubmit={handleCreateMessage}
              isSubmitting={isSubmitting}
            />
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default AdminMessagePage;
