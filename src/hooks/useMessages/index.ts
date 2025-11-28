"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../useAuth";
import type {
  QuestionMessage,
  QuestionReplyPayload,
  QuestionFormData,
} from "@/types";

// Interval untuk polling real-time (dalam milliseconds)
const POLLING_INTERVAL = 3000; // 3 detik

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
  const isFirstLoad = useRef(true);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const selectedMessageIdRef = useRef<string | undefined>(undefined);
  const selectedMessageRef = useRef<QuestionMessage | null>(null);

  const effectiveRecipientRole =
    recipientRole || (session.role === "owner" ? "owner" : "admin");

  const fetchMessages = useCallback(
    async (withToast = false, focusMessageId?: string, silent = false) => {
      if (!silent && isFirstLoad.current) {
        setIsLoading(true);
      }
      if (!silent) {
        setError(null);
      }

      try {
        // Untuk admin dan owner, fetch pesan dari lawan bicara mereka juga
        const isAdmin = session.role === "admin";
        const isOwner = session.role === "owner";
        const shouldFetchBothDirections = (isAdmin || isOwner) && effectiveRecipientRole !== undefined;

        let questionList: QuestionMessage[] = [];

        if (shouldFetchBothDirections && senderRoleFilter === "all") {
          // Fetch pesan yang ditujukan ke user (recipientRole = effectiveRecipientRole)
          try {
            const url1 = `/api/forum/questions?recipientRole=${effectiveRecipientRole}`;
            const res1 = await fetch(url1);
            const data1 = await res1.json();
            
            if (res1.ok && data1.status) {
              const list1: QuestionMessage[] = Array.isArray(data1.data) ? data1.data : [];
              questionList = [...list1];
            }
          } catch (err) {
            // Continue dengan fetch kedua meskipun yang pertama error
            console.error("Error fetching messages for recipient:", err);
          }

          // Fetch pesan yang user kirim ke lawan bicara
          try {
            const oppositeRole = isAdmin ? "owner" : "admin";
            const url2 = `/api/forum/questions?recipientRole=${oppositeRole}&authorRole=${effectiveRecipientRole}`;
            const res2 = await fetch(url2);
            const data2 = await res2.json();
            
            if (res2.ok && data2.status) {
              const list2: QuestionMessage[] = Array.isArray(data2.data) ? data2.data : [];
              // Merge dan hapus duplikat berdasarkan ID
              const existingIds = new Set(questionList.map(m => m.id));
              const newMessages = list2.filter(m => !existingIds.has(m.id));
              questionList = [...questionList, ...newMessages];
            }
          } catch (err) {
            // Continue meskipun fetch kedua error
            console.error("Error fetching messages sent by user:", err);
          }

          // Sort merged messages by createdAt (newest first)
          questionList.sort((a, b) => {
            const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return bTime - aTime; // Descending (newest first)
          });

          // Jika kedua fetch gagal, throw error
          if (questionList.length === 0) {
            throw new Error("Gagal memuat pesan");
          }
        } else {
          // Fetch normal dengan filter
          const url =
            senderRoleFilter !== "all"
              ? `/api/forum/questions?recipientRole=${effectiveRecipientRole}&authorRole=${senderRoleFilter}`
              : `/api/forum/questions?recipientRole=${effectiveRecipientRole}`;

          const res = await fetch(url);
          const data = await res.json();
          
          if (!res.ok || !data.status) {
            throw new Error(data.message || "Gagal memuat pertanyaan pengguna");
          }

          questionList = Array.isArray(data.data) ? data.data : [];
        }

        isFirstLoad.current = false;

        setMessages(questionList);

        // Prioritaskan focusMessageId jika ada (untuk reply atau action tertentu)
        const targetId = focusMessageId || selectedMessageIdRef.current;
        
        if (targetId) {
          const focused = questionList.find((item) => item.id === targetId);
          if (focused) {
            // Jika ditemukan, pilih yang sama untuk mempertahankan selection setelah refresh
            setSelectedMessage(focused);
            selectedMessageRef.current = focused;
            selectedMessageIdRef.current = focused.id;
          } else {
            // Jika targetId tidak ditemukan di list baru
            if (focusMessageId && !silent) {
              // Jika focusMessageId tidak ditemukan (mungkin dihapus) dan bukan silent fetch, pilih yang pertama
              const firstMessage = questionList[0] || null;
              if (firstMessage) {
                setSelectedMessage(firstMessage);
                selectedMessageRef.current = firstMessage;
                selectedMessageIdRef.current = firstMessage.id;
              } else {
                // Jika tidak ada message sama sekali, reset
                setSelectedMessage(null);
                selectedMessageRef.current = null;
                selectedMessageIdRef.current = undefined;
              }
            }
            // Jika silent fetch (polling) dan targetId tidak ditemukan,
            // JANGAN mengubah selectedMessage sama sekali untuk mempertahankan selection
            // Tidak perlu melakukan apa-apa, biarkan selectedMessage tetap seperti sebelumnya
          }
        } else if (questionList.length === 0) {
          // Jika tidak ada message sama sekali, reset (hanya jika bukan silent)
          if (!silent) {
            setSelectedMessage(null);
            selectedMessageRef.current = null;
            selectedMessageIdRef.current = undefined;
          }
        } else if (!selectedMessageRef.current && !silent && questionList.length > 0) {
          // Hanya pilih yang pertama jika belum ada selectedMessage sama sekali dan bukan silent fetch (first load)
          const firstMessage = questionList[0];
          setSelectedMessage(firstMessage);
          selectedMessageRef.current = firstMessage;
          selectedMessageIdRef.current = firstMessage.id;
        }
        // Jika ada selectedMessage yang lama tapi tidak ada targetId dan silent fetch,
        // tidak perlu melakukan apa-apa - biarkan selectedMessage tetap seperti sebelumnya

        if (!silent && isFirstLoad.current) {
          setIsLoading(false);
        } else if (!silent) {
          setIsLoading(false);
        }

        if (withToast) {
          toast.success("✅ Pesan terbaru berhasil dimuat");
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Terjadi kesalahan server";
        if (!silent) {
          setError(message);
          toast.error(`❌ ${message}`);
        }
      } finally {
        if (!silent && isFirstLoad.current) {
          setIsLoading(false);
        } else if (!silent) {
          setIsLoading(false);
        }
      }
    },
    [effectiveRecipientRole, senderRoleFilter, session.role]
  );

  // Update ref ketika selectedMessage berubah
  useEffect(() => {
    selectedMessageIdRef.current = selectedMessage?.id;
    selectedMessageRef.current = selectedMessage;
  }, [selectedMessage]);

  // Setup polling untuk real-time updates
  useEffect(() => {
    // Fetch pertama kali
    fetchMessages(false, undefined, false);

    // Setup polling interval untuk update otomatis
    pollingIntervalRef.current = setInterval(() => {
      // Gunakan ref untuk mendapatkan selectedMessage ID terbaru tanpa menyebabkan re-render
      // Jangan pass focusMessageId saat polling, biarkan logika di fetchMessages menangani
      fetchMessages(false, undefined, true); // Silent fetch untuk polling
    }, POLLING_INTERVAL);

    // Cleanup interval saat unmount atau saat dependencies berubah
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    };
  }, [senderRoleFilter, effectiveRecipientRole, fetchMessages]);

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
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/forum/questions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          authorName: session.fullName || "User",
          authorEmail: session.email,
          authorRole: session.role || "user",
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
