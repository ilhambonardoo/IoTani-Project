"use client";

import { useState, useMemo, useCallback } from "react";

export function useSearch<T>(
  items: T[],
  searchFn: (item: T, keyword: string) => boolean
) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredItems = useMemo(() => {
    if (!searchTerm.trim()) return items;

    const keyword = searchTerm.trim().toLowerCase();
    return items.filter((item) => searchFn(item, keyword));
  }, [items, searchTerm, searchFn]);

  const clearSearch = useCallback(() => {
    setSearchTerm("");
  }, []);

  return {
    searchTerm,
    setSearchTerm,
    filteredItems,
    clearSearch,
  };
}

// Helper function untuk search di multiple fields
export function createMultiFieldSearch<T>(
  fields: Array<keyof T | ((item: T) => string)>
) {
  return (item: T, keyword: string): boolean => {
    return fields.some((field) => {
      if (typeof field === "function") {
        const value = field(item);
        return value.toLowerCase().includes(keyword);
      }
      const value = item[field];
      return String(value || "").toLowerCase().includes(keyword);
    });
  };
}

