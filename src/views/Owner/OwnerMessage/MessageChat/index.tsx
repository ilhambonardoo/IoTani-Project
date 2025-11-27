"use client";

import { QuestionMessage } from "@/types";
import { motion } from "framer-motion";
import { FaUser, FaPaperPlane, FaTrash } from "react-icons/fa";

interface ChatBubble {
  id: string;
  sender: "user" | "owner";
  content: string;
  timestamp: string;
  senderLabel: string;
  replyId?: string;
}

interface MessageChatProps {
  selectedMessage: QuestionMessage | null;
  chatBubbles: ChatBubble[];
  replyText: string;
  isSendingReply: boolean;
  isDeletingMessage: boolean;
  isDeletingReply: string | null;
  onReplyTextChange: (text: string) => void;
  onReply: () => void;
  onDeleteMessage: () => void;
  onDeleteReply: (replyId: string) => void;
}

const MessageChat = ({
  selectedMessage,
  chatBubbles,
  replyText,
  isSendingReply,
  isDeletingMessage,
  isDeletingReply,
  onReplyTextChange,
  onReply,
  onDeleteMessage,
  onDeleteReply,
}: MessageChatProps) => {
  if (!selectedMessage) {
    return (
      <div className="flex h-[600px] items-center justify-center rounded-2xl bg-white shadow-lg">
        <p className="text-neutral-500">
          Pilih pesan untuk melihat detail dan membalas.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="lg:col-span-3"
    >
      <div className="flex h-[600px] flex-col rounded-2xl bg-white shadow-lg">
        <div className="border-b border-neutral-200 p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500 text-white">
                <FaUser size={18} />
              </div>
              <div>
                <h3 className="font-semibold text-neutral-800">
                  {selectedMessage.title}
                </h3>
                <p className="text-xs text-neutral-500">
                  Dari: {selectedMessage.authorName} • Kategori:{" "}
                  {selectedMessage.category}
                </p>
              </div>
            </div>
            <button
              onClick={onDeleteMessage}
              disabled={isDeletingMessage}
              className="flex items-center gap-2 rounded-lg bg-red-100 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-200 transition-all disabled:opacity-50"
            >
              <FaTrash size={12} />
              {isDeletingMessage ? "Menghapus..." : "Hapus"}
            </button>
          </div>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto bg-neutral-50 p-4">
          {chatBubbles.map((bubble) => (
            <motion.div
              key={bubble.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${
                bubble.sender === "user" ? "justify-start" : "justify-end"
              }`}
            >
              <div className="group relative">
                <div
                  className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                    bubble.sender === "user"
                      ? "bg-white text-neutral-800 shadow-md"
                      : "bg-green-500 text-white"
                  }`}
                >
                  <div
                    className={`text-xs font-semibold ${
                      bubble.sender === "user"
                        ? "text-neutral-500"
                        : "text-green-100"
                    }`}
                  >
                    {bubble.senderLabel}
                  </div>
                  <p className="text-sm">{bubble.content}</p>
                  <p
                    className={`mt-1 text-xs ${
                      bubble.sender === "user"
                        ? "text-neutral-400"
                        : "text-green-100"
                    }`}
                  >
                    {bubble.timestamp}
                  </p>
                </div>
                {bubble.sender !== "user" && bubble.replyId && (
                  <button
                    onClick={() => onDeleteReply(bubble.replyId!)}
                    disabled={isDeletingReply === bubble.replyId}
                    className="absolute -right-8 top-0 rounded p-2 text-red-600 opacity-0 transition-all hover:bg-red-100 group-hover:opacity-100 disabled:opacity-50"
                    title="Hapus balasan"
                  >
                    <FaTrash size={12} />
                  </button>
                )}
              </div>
            </motion.div>
          ))}
          {chatBubbles.length === 0 && (
            <p className="text-center text-sm text-neutral-500">
              Belum ada pesan dalam percakapan ini.
            </p>
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
              disabled={isSendingReply || !replyText.trim()}
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
    </motion.div>
  );
};

export default MessageChat;
