"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useMemo } from "react";
import { FaUser, FaPaperPlane } from "react-icons/fa";
import { HiOutlineSearch } from "react-icons/hi";
// Simple date formatter
const formatTime = (date: Date) => {
  return date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
};

interface Message {
  id: number;
  name: string;
  role: string;
  lastMessage: string;
  timestamp: Date;
  unread: number;
  avatar?: string;
}

interface ChatMessage {
  id: number;
  text: string;
  sender: "user" | "admin";
  timestamp: Date;
}

const MessagePage = () => {
  const [selectedChat, setSelectedChat] = useState<number | null>(1);
  const [messageInput, setMessageInput] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const conversations: Message[] = useMemo(() => {
    if (!mounted) {
      // Return fixed timestamps for SSR
      const baseTime = new Date("2024-01-01T12:00:00");
      return [
        {
          id: 1,
          name: "Admin Penyuluh",
          role: "Penyuluh Pertanian",
          lastMessage: "Terima kasih atas pertanyaannya. Saya akan membantu...",
          timestamp: baseTime,
          unread: 2,
        },
        {
          id: 2,
          name: "Tim Support",
          role: "Support",
          lastMessage: "Masalah Anda sudah kami catat dan akan segera ditindaklanjuti.",
          timestamp: new Date(baseTime.getTime() - 3600000),
          unread: 0,
        },
      ];
    }
    // Use real timestamps on client
    return [
      {
        id: 1,
        name: "Admin Penyuluh",
        role: "Penyuluh Pertanian",
        lastMessage: "Terima kasih atas pertanyaannya. Saya akan membantu...",
        timestamp: new Date(),
        unread: 2,
      },
      {
        id: 2,
        name: "Tim Support",
        role: "Support",
        lastMessage: "Masalah Anda sudah kami catat dan akan segera ditindaklanjuti.",
        timestamp: new Date(Date.now() - 3600000),
        unread: 0,
      },
    ];
  }, [mounted]);

  const [messages] = useState<ChatMessage[]>(() => {
    // Use fixed timestamps for initial state to avoid hydration mismatch
    const baseTime = new Date("2024-01-01T12:00:00");
    return [
      {
        id: 1,
        text: "Halo, ada yang bisa saya bantu?",
        sender: "admin",
        timestamp: new Date(baseTime.getTime() - 7200000),
      },
      {
        id: 2,
        text: "Saya ingin bertanya tentang pH tanah yang optimal untuk cabai",
        sender: "user",
        timestamp: new Date(baseTime.getTime() - 3600000),
      },
      {
        id: 3,
        text: "pH optimal untuk tanaman cabai adalah antara 6.0 hingga 6.8. Apakah pH tanah Anda saat ini sudah dalam rentang tersebut?",
        sender: "admin",
        timestamp: new Date(baseTime.getTime() - 1800000),
      },
      {
        id: 4,
        text: "Terima kasih atas informasinya!",
        sender: "user",
        timestamp: baseTime,
      },
    ];
  });

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;
    // Handle send message
    setMessageInput("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-neutral-800 lg:text-4xl">
            Pesan
          </h1>
          <p className="mt-2 text-neutral-600">
            Komunikasi langsung dengan penyuluh pertanian
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          {/* Conversations List */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="rounded-2xl bg-white shadow-lg">
              {/* Search */}
              <div className="border-b border-neutral-200 p-4">
                <div className="relative">
                  <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                  <input
                    type="text"
                    placeholder="Cari percakapan..."
                    className="w-full rounded-lg border border-neutral-300 bg-neutral-50 px-10 py-2 text-sm text-neutral-800 placeholder-neutral-400 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/50"
                  />
                </div>
              </div>

              {/* Conversations */}
              <div className="max-h-[600px] overflow-y-auto">
                {conversations.map((conversation) => (
                  <button
                    key={conversation.id}
                    onClick={() => setSelectedChat(conversation.id)}
                    className={`w-full border-b border-neutral-200 p-4 text-left transition-all hover:bg-neutral-50 ${
                      selectedChat === conversation.id ? "bg-green-50" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500 text-white">
                        <FaUser size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="truncate font-semibold text-neutral-800">
                            {conversation.name}
                          </h3>
                          {conversation.unread > 0 && (
                            <span className="ml-2 rounded-full bg-green-500 px-2 py-0.5 text-xs font-medium text-white">
                              {conversation.unread}
                            </span>
                          )}
                        </div>
                        <p className="mt-1 truncate text-sm text-neutral-600">
                          {conversation.lastMessage}
                        </p>
                        <p className="mt-1 text-xs text-neutral-400">
                          {formatTime(conversation.timestamp)}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Chat Window */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-3"
          >
            <div className="flex h-[600px] flex-col rounded-2xl bg-white shadow-lg">
              {/* Chat Header */}
              <div className="border-b border-neutral-200 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500 text-white">
                    <FaUser size={18} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-800">
                      {conversations.find((c) => c.id === selectedChat)?.name}
                    </h3>
                    <p className="text-xs text-neutral-500">
                      {conversations.find((c) => c.id === selectedChat)?.role}
                    </p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-neutral-50">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${
                      message.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                        message.sender === "user"
                          ? "bg-green-500 text-white"
                          : "bg-white text-neutral-800 shadow-md"
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                      <p
                        className={`mt-1 text-xs ${
                          message.sender === "user"
                            ? "text-green-100"
                            : "text-neutral-400"
                        }`}
                      >
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Input */}
              <div className="border-t border-neutral-200 p-4 bg-white">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder="Tulis pesan..."
                    className="flex-1 rounded-lg border border-neutral-300 px-4 py-2 text-sm text-neutral-800 placeholder-neutral-400 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/50"
                  />
                  <motion.button
                    onClick={handleSendMessage}
                    className="flex items-center justify-center rounded-lg bg-green-500 px-4 py-2 text-white transition-colors hover:bg-green-600"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaPaperPlane size={18} />
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default MessagePage;

