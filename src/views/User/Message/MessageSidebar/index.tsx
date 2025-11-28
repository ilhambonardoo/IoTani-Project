"use client";

import { motion } from "framer-motion";
import { FaUser } from "react-icons/fa";
import { HiOutlineSearch } from "react-icons/hi";
import { FiRefreshCcw } from "react-icons/fi";
import { toast } from "react-toastify";
import type { QuestionThread } from "@/types";

interface MessageSidebarProps {
  searchTerm: string;
  isLoading: boolean;
  filteredThreads: QuestionThread[];
  selectedThreadId: string | null;
  onSearchChange: (term: string) => void;
  onRefresh: () => void;
  onThreadSelect: (threadId: string) => void;
}

const MessageSidebar = ({
  searchTerm,
  isLoading,
  filteredThreads,
  selectedThreadId,
  onSearchChange,
  onRefresh,
  onThreadSelect,
}: MessageSidebarProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="lg:col-span-1 h-full lg:h-auto"
    >
      <div className="rounded-xl md:rounded-2xl bg-white shadow-lg h-full lg:h-auto flex flex-col max-h-screen lg:max-h-none lg:w-[420px]">
        <div className="border-b border-neutral-100 p-4 space-y-3">
          <div className="relative">
            <HiOutlineSearch
              className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Cari pesan..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-10 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
            />
          </div>
          <button
            onClick={() => {
              onRefresh();
              toast.success("✅ Pesan terbaru dimuat");
            }}
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-green-100 bg-green-50 px-3 py-2 text-sm font-medium text-green-700 hover:bg-green-100 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
          >
            <FiRefreshCcw className={isLoading ? "animate-spin" : ""} />
            Muat Ulang
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex h-32 items-center justify-center text-sm text-neutral-500">
              Memuat...
            </div>
          ) : filteredThreads.length === 0 ? (
            <div className="p-8 text-center text-sm text-neutral-500">
              Tidak ada pesan.
            </div>
          ) : (
            <div className="divide-y divide-neutral-100">
              {filteredThreads.map((thread) => (
                <button
                  key={thread.id}
                  onClick={() => onThreadSelect(thread.id)}
                  className={`cursor-pointer w-full p-4 text-left transition-colors hover:bg-neutral-50 ${
                    selectedThreadId === thread.id
                      ? "bg-green-50/60 hover:bg-green-50"
                      : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-green-400 to-green-600 text-white shadow-sm">
                      <FaUser size={14} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="truncate font-semibold text-neutral-800">
                        {thread.title}
                      </h4>
                      <p className="truncate text-sm text-neutral-500">
                        {thread.replies.length > 0
                          ? thread.replies[thread.replies.length - 1].content
                          : thread.content}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-medium text-neutral-600">
                          {thread.category}
                        </span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                            thread.recipientRole === "admin"
                              ? "bg-purple-100 text-purple-700"
                              : "bg-orange-100 text-orange-700"
                          }`}
                        >
                          {thread.recipientRole === "admin" ? "Admin" : "Owner"}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default MessageSidebar;
