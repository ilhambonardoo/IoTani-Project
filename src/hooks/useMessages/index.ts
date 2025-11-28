"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../useAuth";
import type {
  QuestionMessage,
  QuestionReplyPayload,
  QuestionFormData,
} from "@/types";

export function useMessages(recipientRole?: "admin" | "owner") {
  const session = useAuth();
  const [messages, setMessages] = useState<QuestionMessage[]>([]);
  const [selectedMessage, setSelectedMessage] =
    useState<QuestionMessage | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [senderRoleFilter, setSenderRoleFilter] = useState<
    "user" | "admin" | "owner" | "all"
  >("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const effectiveRecipientRole =
    recipientRole || (session.role === "owner" ? "owner" : "admin");

  const fetchMessages = useCallback(
    async (withToast = false, focusMessageId?: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const url =
          senderRoleFilter !== "all"
            ? `/api/forum/questions?recipientRole=${effectiveRecipientRole}&authorRole=${senderRoleFilter}`
            : `/api/forum/questions?recipientRole=${effectiveRecipientRole}`;

        const res = await fetch(url);
        const data = await res.json();

        if (!res.ok || !data.status) {
          throw new Error(data.message || "Gagal memuat pertanyaan pengguna");
        }

        const questionList: QuestionMessage[] = Array.isArray(data.data)
          ? data.data
          : [];

        setMessages(questionList);

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
        setError(message);
        if (withToast) {
          toast.error(`❌ ${message}`);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [effectiveRecipientRole, senderRoleFilter, selectedMessage]
  );

  useEffect(() => {
    fetchMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [senderRoleFilter]);

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

  const createMessage = async (formData: QuestionFormData) => {
    try {
      const res = await fetch(`/api/forum/questions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userName: session.fullName,
          userEmail: session.email,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.status) {
        throw new Error(data.message || "Gagal mengirim pertanyaan");
      }

      toast.success("✅ Pertanyaan terkirim");
      setIsModalOpen(false);
      await fetchMessages(false);
      return data;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Terjadi kesalahan server";
      toast.error(`❌ ${message}`);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const sendReply = useCallback(
    async (
      messageId: string,
      replyData: QuestionReplyPayload,
      focusMessageId?: string
    ) => {
      try {
        const res = await fetch(`/api/forum/questions/${messageId}/reply`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(replyData),
        });

        const data = await res.json();
        if (!res.ok || !data.status) {
          throw new Error(data.message || "Gagal mengirim balasan");
        }

        toast.success("✅ Balasan terkirim");
        await fetchMessages(false, focusMessageId || messageId);
        return data;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Terjadi kesalahan server";
        toast.error(`❌ ${message}`);
        throw err;
      }
    },
    [fetchMessages]
  );

  const deleteMessage = useCallback(
    async (messageId: string) => {
      try {
        const res = await fetch(`/api/forum/questions/${messageId}/delete`, {
          method: "DELETE",
        });

        const data = await res.json();
        if (!res.ok || !data.status) {
          throw new Error(data.message || "Gagal menghapus pertanyaan");
        }

        toast.success("✅ Pertanyaan berhasil dihapus");
        await fetchMessages();
        if (selectedMessage?.id === messageId) {
          setSelectedMessage(null);
        }
        return data;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Terjadi kesalahan server";
        toast.error(`❌ ${message}`);
        throw err;
      }
    },
    [fetchMessages, selectedMessage]
  );

  const deleteReply = useCallback(
    async (messageId: string, replyId: string) => {
      try {
        const res = await fetch(
          `/api/forum/questions/${messageId}/reply/${replyId}/delete`,
          {
            method: "DELETE",
          }
        );

        const data = await res.json();
        if (!res.ok || !data.status) {
          throw new Error(data.message || "Gagal menghapus balasan");
        }

        toast.success("✅ Balasan berhasil dihapus");
        await fetchMessages(false, messageId);
        return data;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Terjadi kesalahan server";
        toast.error(`❌ ${message}`);
        throw err;
      }
    },
    [fetchMessages]
  );

  return {
    messages,
    filteredMessages,
    selectedMessage,
    setSelectedMessage,
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    senderRoleFilter,
    setSenderRoleFilter,
    refetch: fetchMessages,
    sendReply,
    deleteMessage,
    deleteReply,
    isModalOpen,
    setIsModalOpen,
    isSubmitting,
    createMessage,
  };
}
