"use client";

import { motion } from "framer-motion";
import { FaUser } from "react-icons/fa";
import { HiOutlineSearch } from "react-icons/hi";
import { FiRefreshCcw } from "react-icons/fi";
import type { QuestionMessage } from "@/types";

interface MessageSidebarProps {
  searchTerm: string;
  senderRoleFilter: string;
  isLoading: boolean;
  filteredMessages: QuestionMessage[];
  selectedMessage: QuestionMessage | null;
  onSearchChange: (term: string) => void;
  onFilterChange: (filter: string) => void;
  onRefresh: (showToast?: boolean) => void;
  onMessageSelect: (message: QuestionMessage) => void;
}

const MessageSidebar = ({
  searchTerm,
  senderRoleFilter,
  isLoading,
  filteredMessages,
  selectedMessage,
  onSearchChange,
  onFilterChange,
  onRefresh,
  onMessageSelect,
}: MessageSidebarProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="lg:col-span-1 h-full lg:h-auto"
    >
      <div className="rounded-xl md:rounded-2xl bg-white shadow-lg h-full lg:h-auto flex flex-col max-h-screen lg:max-h-none lg:w-[420px]">
        <div className="border-b border-neutral-200 p-3 sm:p-4 space-y-2 sm:space-y-3 shrink-0">
          <div className="relative">
            <HiOutlineSearch
              className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Cari pertanyaan..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full rounded-lg border border-neutral-300 bg-neutral-50 px-9 sm:px-10 py-2 text-xs sm:text-sm text-neutral-800 placeholder-neutral-400 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/50"
            />
          </div>
          <select
            value={senderRoleFilter}
            onChange={(e) => onFilterChange(e.target.value)}
            className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs sm:text-sm text-neutral-800 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/50"
          >
            <option value="all">Semua Pengirim</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="owner">Owner</option>
          </select>
          <button
            onClick={() => onRefresh(true)}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-green-200 bg-white px-3 py-2 text-xs sm:text-sm font-medium text-green-600 transition-all hover:bg-green-50 disabled:opacity-50"
            disabled={isLoading}
          >
            <FiRefreshCcw
              size={14}
              className={isLoading ? "animate-spin" : "text-green-600"}
            />
            <span className="hidden sm:inline">Muat ulang pertanyaan</span>
            <span className="sm:hidden">Refresh</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto min-h-0 rounded-2xl">
          {isLoading ? (
            <div className="flex h-32 sm:h-40 items-center justify-center text-xs sm:text-sm text-neutral-500">
              Memuat pertanyaan...
            </div>
          ) : filteredMessages.length === 0 ? (
            <div className="p-4 sm:p-6 text-center text-xs sm:text-sm text-neutral-500">
              Tidak ada pertanyaan ditemukan.
            </div>
          ) : (
            filteredMessages.map((message) => (
              <button
                key={message.id}
                onClick={() => onMessageSelect(message)}
                className={`w-full border-b border-neutral-200 p-3 sm:p-4 text-left transition-all hover:bg-neutral-50 ${
                  selectedMessage?.id === message.id ? "bg-green-50" : ""
                }`}
              >
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-green-500 text-white shrink-0">
                    <FaUser size={14} className="sm:w-4 sm:h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="truncate font-semibold text-xs sm:text-sm text-neutral-800">
                        {message.authorName}
                      </h3>
                    </div>
                    <p className="mt-1 truncate text-xs sm:text-sm text-neutral-600">
                      {message.title}
                    </p>
                    <p className="mt-1 text-[10px] sm:text-xs text-neutral-400">
                      {message.createdAt}
                    </p>
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-1.5 sm:gap-2 flex-wrap">
                  <span className="inline-flex items-center rounded-full bg-green-100 px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-[11px] font-medium text-green-700">
                    {message.category}
                  </span>
                  {message.authorRole && (
                    <span
                      className={`inline-flex items-center rounded-full px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-[11px] font-medium ${
                        message.authorRole === "user"
                          ? "bg-blue-100 text-blue-700"
                          : message.authorRole === "admin"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      {message.authorRole === "user"
                        ? "User"
                        : message.authorRole === "admin"
                        ? "Admin"
                        : "Owner"}
                    </span>
                  )}
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default MessageSidebar;
