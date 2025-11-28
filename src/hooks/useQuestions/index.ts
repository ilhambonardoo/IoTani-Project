"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useAuth } from "../useAuth";
import type { QuestionThread } from "@/types";

// Interval untuk polling real-time (dalam milliseconds)
const POLLING_INTERVAL = 3000; // 3 detik

export function useQuestions() {
  const { email } = useAuth();
  const [threads, setThreads] = useState<QuestionThread[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isFirstLoad = useRef(true);

  const fetchThreads = useCallback(async (silent = false) => {
    if (!email) {
      setIsLoading(false);
      return;
    }

    if (!silent && isFirstLoad.current) {
      setIsLoading(true);
      setError(null);
    } else if (!silent) {
      setError(null);
    }

    try {
      const res = await fetch(
        `/api/forum/questions/user?email=${encodeURIComponent(email)}`
      );
      const data = await res.json();

      isFirstLoad.current = false;

      if (res.ok && data.status) {
        const list: QuestionThread[] = (data.data || []).map(
          (item: QuestionThread) => ({
            ...item,
            replies: item.replies || [],
          })
        );
        setThreads(list);
      } else {
        if (!silent) {
          setError(data.message || "Failed to fetch questions");
        }
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      if (!silent) {
        setError(message);
      }
    } finally {
      if (!silent && isFirstLoad.current) {
        setIsLoading(false);
      } else if (!silent) {
        setIsLoading(false);
      }
    }
  }, [email]);

  // Setup polling untuk real-time updates
  useEffect(() => {
    if (!email) {
      setIsLoading(false);
      return;
    }

    // Fetch pertama kali
    fetchThreads(false);

    // Setup polling interval untuk update otomatis
    pollingIntervalRef.current = setInterval(() => {
      fetchThreads(true); // Silent fetch untuk polling
    }, POLLING_INTERVAL);

    // Cleanup interval saat unmount atau saat dependencies berubah
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    };
  }, [email, fetchThreads]);

 

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

  // Wrapper untuk refetch manual (dengan loading indicator)
  const refetch = useCallback(() => {
    return fetchThreads(false);
  }, [fetchThreads]);

  return {
    threads,
    filteredThreads,
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    refetch,
  };
}
