"use client";

import { FaUser } from "react-icons/fa";
import type { QuestionMessage } from "@/types";

interface RecentMessagesCardProps {
  messages: QuestionMessage[];
  isLoading: boolean;
}

const RecentMessagesCard = ({
  messages,
  isLoading,
}: RecentMessagesCardProps) => {
  return (
    <div className="rounded-2xl bg-white p-4 sm:p-6 shadow-lg">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-neutral-800">
          Pesan Terbaru
        </h2>
        <a
          href="/admin-message"
          className="text-sm font-medium text-green-600 hover:text-green-700"
        >
          Lihat Semua
        </a>
      </div>
      <div className="space-y-3 max-h-[500px] overflow-y-auto">
        {isLoading ? (
          <div className="flex h-40 items-center justify-center text-sm text-neutral-500">
            Memuat pesan...
          </div>
        ) : messages.length === 0 ? (
          <div className="p-6 text-center text-sm text-neutral-500">
            Tidak ada pesan terbaru.
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className="rounded-lg border border-neutral-200 p-4 transition-all hover:bg-neutral-50"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500 text-white shrink-0">
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
                  <div className="mt-2 flex items-center gap-2 flex-wrap">
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
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecentMessagesCard;

