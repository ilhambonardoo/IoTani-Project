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
      className="lg:col-span-1"
    >
      <div className="rounded-2xl bg-white shadow-lg">
        <div className="border-b border-neutral-200 p-4 space-y-3">
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
              className="w-full rounded-lg border border-neutral-300 bg-neutral-50 px-10 py-2 text-sm text-neutral-800 placeholder-neutral-400 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/50"
            />
          </div>
          <select
            value={senderRoleFilter}
            onChange={(e) => onFilterChange(e.target.value)}
            className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-800 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/50"
          >
            <option value="all">Semua Pengirim</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <button
            onClick={() => onRefresh(true)}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-green-200 bg-white px-3 py-2 text-sm font-medium text-green-600 transition-all hover:bg-green-50 disabled:opacity-50"
            disabled={isLoading}
          >
            <FiRefreshCcw
              size={16}
              className={isLoading ? "animate-spin" : "text-green-600"}
            />
            Muat ulang
          </button>
        </div>

        <div className="max-h-[600px] overflow-y-auto">
          {isLoading ? (
            <div className="flex h-40 items-center justify-center text-sm text-neutral-500">
              Memuat pesan...
            </div>
          ) : filteredMessages.length === 0 ? (
            <div className="p-6 text-center text-sm text-neutral-500">
              Tidak ada pesan ditemukan.
            </div>
          ) : (
            filteredMessages.map((message) => (
              <button
                key={message.id}
                onClick={() => onMessageSelect(message)}
                className={`w-full border-b border-neutral-200 p-4 text-left transition-all hover:bg-neutral-50 ${
                  selectedMessage?.id === message.id ? "bg-green-50" : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500 text-white">
                    <FaUser size={16} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="truncate font-semibold text-neutral-800">
                        {message.authorName}
                      </h3>
                    </div>
                    <p className="mt-1 truncate text-sm text-neutral-600">
                      {message.title}
                    </p>
                    <p className="mt-1 text-xs text-neutral-400">
                      {message.createdAt}
                    </p>
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-[11px] font-medium text-green-700">
                    {message.category}
                  </span>
                  {message.authorRole && (
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${
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
