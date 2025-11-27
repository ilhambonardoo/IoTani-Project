"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import type { Template, TemplatePayload } from "@/types";

export function useTemplates() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTemplates = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/templates");
      const data = await res.json();

      if (res.ok && data.status) {
        setTemplates(data.data || []);
      } else {
        setError(data.message || "Failed to fetch templates");
        toast.error(`❌ ${data.message || "Failed to fetch templates"}`);
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unknown error";
      setError(message);
      toast.error(`❌ ${message}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const createTemplate = useCallback(
    async (data: TemplatePayload) => {
      try {
        const res = await fetch("/api/templates", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        const result = await res.json();
        if (!res.ok || !result.status) {
          throw new Error(result.message || "Failed to create template");
        }

        toast.success("✅ Template berhasil dibuat");
        await fetchTemplates();
        return result;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Unknown error";
        toast.error(`❌ ${message}`);
        throw err;
      }
    },
    [fetchTemplates]
  );

  const updateTemplate = useCallback(
    async (id: string, data: Partial<TemplatePayload>) => {
      try {
        const res = await fetch(`/api/templates/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        const result = await res.json();
        if (!res.ok || !result.status) {
          throw new Error(result.message || "Failed to update template");
        }

        toast.success("✅ Template berhasil diperbarui");
        await fetchTemplates();
        return result;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Unknown error";
        toast.error(`❌ ${message}`);
        throw err;
      }
    },
    [fetchTemplates]
  );

  const deleteTemplate = useCallback(
    async (id: string) => {
      try {
        const res = await fetch(`/api/templates/${id}`, {
          method: "DELETE",
        });

        const result = await res.json();
        if (!res.ok || !result.status) {
          throw new Error(result.message || "Failed to delete template");
        }

        toast.success("✅ Template berhasil dihapus");
        await fetchTemplates();
        return result;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Unknown error";
        toast.error(`❌ ${message}`);
        throw err;
      }
    },
    [fetchTemplates]
  );

  const sendTemplate = useCallback(
    async (
      id: string,
      targetRole: "user" | "admin" | "owner" | "all",
      senderName: string,
      senderRole: string = "admin"
    ) => {
      try {
        const res = await fetch(`/api/templates/${id}/send`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            targetRole,
            senderName,
            senderRole,
          }),
        });

        const result = await res.json();
        if (!res.ok || !result.status) {
          throw new Error(result.message || "Failed to send template");
        }

        toast.success(
          `✅ Template berhasil dikirim ke ${result.data?.sentCount || 0} pengguna`
        );
        return result;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Unknown error";
        toast.error(`❌ ${message}`);
        throw err;
      }
    },
    []
  );

  return {
    templates,
    isLoading,
    error,
    refetch: fetchTemplates,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    sendTemplate,
  };
}

