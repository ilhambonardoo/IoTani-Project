"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useAuth } from "../useAuth";
import type { QuestionThread } from "@/types";

export function useQuestions() {
  const { email } = useAuth();
  const [threads, setThreads] = useState<QuestionThread[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchThreads = useCallback(async () => {
    if (!email) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `/api/forum/questions/user?email=${encodeURIComponent(email)}`
      );
      const data = await res.json();

      if (res.ok && data.status) {
        const list: QuestionThread[] = (data.data || []).map(
          (item: QuestionThread) => ({
            ...item,
            replies: item.replies || [],
          })
        );
        setThreads(list);
      } else {
        setError(data.message || "Failed to fetch questions");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [email]);

  useEffect(() => {
    fetchThreads();
  }, [fetchThreads]);

  const filteredThreads = useMemo(() => {
    if (!searchTerm.trim()) return threads;

    const keyword = searchTerm.trim().toLowerCase();
    return threads.filter(
      (thread) =>
        thread.title.toLowerCase().includes(keyword) ||
        thread.category.toLowerCase().includes(keyword) ||
        thread.content.toLowerCase().includes(keyword)
    );
  }, [threads, searchTerm]);

  return {
    threads,
    filteredThreads,
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    refetch: fetchThreads,
  };
}
