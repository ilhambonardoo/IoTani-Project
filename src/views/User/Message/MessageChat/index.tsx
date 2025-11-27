"use client";

import { motion } from "framer-motion";
import { FaUser, FaTrash, FaPaperPlane } from "react-icons/fa";
import type { ChatBubble, QuestionThread } from "@/types";

interface MessageChatProps {
  selectedThread: QuestionThread | null;
  chatBubbles: ChatBubble[];
  isDeletingMessage: boolean;
  isDeletingReply: string | null;
  isSendingReply: boolean;
  replyText: string;
  onDeleteMessage: () => void;
  onDeleteReply: (replyId: string) => void;
  onCreateQuestion: () => void;
  onReply: () => void;
  onReplyTextChange: (text: string) => void;
}

const MessageChat = ({
  selectedThread,
  chatBubbles,
  isDeletingReply,
  replyText,
  isSendingReply,
  onReply,
  onReplyTextChange,
  onDeleteReply,
}: MessageChatProps) => {
  if (!selectedThread) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-8 text-center text-neutral-500">
        <div className="mb-4 rounded-full bg-green-50 p-4 text-green-500">
          <FaPaperPlane size={32} />
        </div>
        <h3 className="text-lg font-medium text-neutral-800">
          Belum ada pesan dipilih
        </h3>
        <p className="mt-2 max-w-xs text-sm">
          Pilih percakapan dari daftar di sebelah kiri untuk melihat detail atau
          buat pertanyaan baru.
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-[600px] flex-col rounded-2xl bg-white shadow-lg lg:w-full">
      <div className="flex items-center justify-between border-b border-neutral-100 bg-white p-4 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600">
            <FaUser />
          </div>
          <div>
            <h3 className="font-bold text-neutral-800">
              {selectedThread.title}
            </h3>
            <p className="text-xs text-neutral-500">
              {selectedThread.createdAt}
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-4 sm:space-y-6 overflow-y-auto bg-neutral-50/50 p-4 sm:p-6">
        {chatBubbles.length === 0 ? (
          <p className="text-center text-sm text-neutral-500">
            Belum ada percakapan.
          </p>
        ) : (
          chatBubbles.map((bubble) => (
            <motion.div
              key={bubble.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${
                bubble.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {bubble.sender !== "admin" && bubble.replyId && (
                <button
                  onClick={() => onDeleteReply(bubble.replyId!)}
                  disabled={isDeletingReply === bubble.replyId}
                  className="rounded p-2 text-red-600 transition-all cursor-pointer flex justify-center items-center "
                  title="Hapus balasan"
                >
                  <FaTrash size={12} />
                </button>
              )}
              <div className="group relative max-w-[80%] lg:max-w-[70%]">
                <div
                  className={`rounded-2xl px-5 py-3 shadow-sm ${
                    bubble.sender === "user"
                      ? "bg-green-600 text-white"
                      : "bg-white text-neutral-800 border border-neutral-100"
                  }`}
                >
                  <div
                    className={`mb-1 text-xs font-bold ${
                      bubble.sender === "user"
                        ? "text-green-100"
                        : "text-neutral-400"
                    }`}
                  >
                    {bubble.senderLabel}
                  </div>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {bubble.content}
                  </p>
                  <div
                    className={`mt-2 text-[10px] ${
                      bubble.sender === "user"
                        ? "text-green-100"
                        : "text-neutral-400"
                    }`}
                  >
                    {bubble.timestamp}
                  </div>
                </div>

                {bubble.sender === "user" && !bubble.replyId && (
                  <p className="mt-1 text-right text-[10px] text-neutral-400">
                    Pertanyaan Anda
                  </p>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>

      <div className="border-t border-neutral-200 bg-white p-4">
        <div className="flex gap-3">
          <textarea
            value={replyText}
            onChange={(e) => onReplyTextChange(e.target.value)}
            placeholder="Tulis balasan..."
            rows={3}
            className="flex-1 rounded-lg border border-neutral-300 px-4 py-2 text-sm text-neutral-800 placeholder-neutral-400 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/50"
          />
          <motion.button
            onClick={onReply}
            disabled={isSendingReply || !(replyText || "".trim())}
            className="flex items-center gap-2 rounded-lg bg-green-500 px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-50"
            whileHover={{ scale: isSendingReply ? 1 : 1.02 }}
            whileTap={{ scale: isSendingReply ? 1 : 0.98 }}
          >
            <FaPaperPlane size={14} />
            {isSendingReply ? "Mengirim..." : "Kirim"}
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default MessageChat;
