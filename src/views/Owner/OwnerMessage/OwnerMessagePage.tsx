"use client";

import { useState, useMemo } from "react";
import { toast } from "react-toastify";
import ConfirmationModal from "@/components/ui/ConfirmationModal/page";
import { useAuth, useMessages, useConfirmModal } from "@/hooks";
import OwnerMessageHeader from "./OwnerMessageHeader";
import MessageSidebar from "./MessageSidebar";
import MessageChat from "./MessageChat";
import { formatChatBubbles } from "@/lib/utils/formatHelper";

const OwnerMessagePage = () => {
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
    sendReply,
    deleteMessage,
    deleteReply,
  } = useMessages("owner");

  const [replyText, setReplyText] = useState("");
  const [isSendingReply, setIsSendingReply] = useState(false);
  const [isDeletingMessage, setIsDeletingMessage] = useState(false);
  const [isDeletingReply, setIsDeletingReply] = useState<string | null>(null);
  const deleteConfirmModal = useConfirmModal();

  const responderName =
    sessionUser?.fullName || sessionUser?.name || sessionUser?.email || "owner";
  const responderRole = "owner";

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
      await sendReply(
        selectedMessage.id,
        {
          content: replyText,
          responderName,
          responderRole,
        },
        selectedMessage.id
      );
      setReplyText("");
    } catch {
    } finally {
      setIsSendingReply(false);
    }
  };

  const handleDeleteMessage = async () => {
    if (!selectedMessage) {
      toast.error("Tidak ada pesan yang dipilih");
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
    } finally {
      setIsDeletingMessage(false);
    }
  };

  const handleDeleteReply = async (replyId: string) => {
    if (!selectedMessage) {
      toast.error("Tidak ada pesan yang dipilih");
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

      <div className="min-h-screen bg-linear-to-br from-neutral-50 to-neutral-100 p-4 sm:p-6 lg:p-8 pt-16 md:pt-4">
        <div className="mx-auto max-w-7xl">
          <OwnerMessageHeader />

          <div className="grid grid-cols-1 gap-6 lg:flex lg:gap-8 mt-6 lg:mt-8">
            <MessageSidebar
              searchTerm={searchTerm}
              senderRoleFilter={senderRoleFilter}
              isLoading={isLoading}
              filteredMessages={filteredMessages}
              selectedMessage={selectedMessage}
              onSearchChange={setSearchTerm}
              onFilterChange={setSenderRoleFilter}
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
      </div>
    </>
  );
};

export default OwnerMessagePage;
