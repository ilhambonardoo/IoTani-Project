"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { FaUser, FaPaperPlane, FaCheck } from "react-icons/fa";
import { HiOutlineSearch } from "react-icons/hi";

interface Message {
  id: number;
  from: string;
  role: string;
  subject: string;
  content: string;
  timestamp: string;
  unread: boolean;
}

const AdminInboxPage = () => {
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [replyText, setReplyText] = useState("");

  const messages: Message[] = [
    {
      id: 1,
      from: "Petani A",
      role: "User",
      subject: "Pertanyaan tentang pH tanah",
      content:
        "Halo, saya ingin bertanya tentang pH tanah yang optimal untuk tanaman cabai. Saat ini pH tanah saya menunjukkan 5.8, apakah ini masih dalam rentang normal?",
      timestamp: "2 jam lalu",
      unread: true,
    },
    {
      id: 2,
      from: "Petani B",
      role: "User",
      subject: "Masalah dengan sensor",
      content:
        "Sensor kelembapan di Zona A saya tidak mengirim data sejak kemarin. Apakah ada masalah dengan perangkat?",
      timestamp: "5 jam lalu",
      unread: true,
    },
    {
      id: 3,
      from: "Petani C",
      role: "User",
      subject: "Terima kasih atas bantuannya",
      content: "Terima kasih banyak atas saran yang diberikan. Tanaman saya sekarang sudah lebih baik!",
      timestamp: "1 hari lalu",
      unread: false,
    },
  ];

  const handleReply = () => {
    if (!replyText.trim()) return;
    alert("Pesan terkirim!");
    setReplyText("");
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
            Inbox
          </h1>
          <p className="mt-2 text-neutral-600">
            Kelola pesan dari semua pengguna
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          {/* Messages List */}
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
                    placeholder="Cari pesan..."
                    className="w-full rounded-lg border border-neutral-300 bg-neutral-50 px-10 py-2 text-sm text-neutral-800 placeholder-neutral-400 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/50"
                  />
                </div>
              </div>

              {/* Messages */}
              <div className="max-h-[600px] overflow-y-auto">
                {messages.map((message) => (
                  <button
                    key={message.id}
                    onClick={() => setSelectedMessage(message)}
                    className={`w-full border-b border-neutral-200 p-4 text-left transition-all hover:bg-neutral-50 ${
                      selectedMessage?.id === message.id ? "bg-green-50" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500 text-white">
                        <FaUser size={16} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="truncate font-semibold text-neutral-800">
                            {message.from}
                          </h3>
                          {message.unread && (
                            <span className="ml-2 h-2 w-2 rounded-full bg-green-500" />
                          )}
                        </div>
                        <p className="mt-1 truncate text-sm text-neutral-600">
                          {message.subject}
                        </p>
                        <p className="mt-1 text-xs text-neutral-400">
                          {message.timestamp}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Message View */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-3"
          >
            {selectedMessage ? (
              <div className="flex h-[600px] flex-col rounded-2xl bg-white shadow-lg">
                {/* Message Header */}
                <div className="border-b border-neutral-200 p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500 text-white">
                        <FaUser size={20} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-neutral-800">
                          {selectedMessage.from}
                        </h3>
                        <p className="text-sm text-neutral-500">
                          {selectedMessage.role} • {selectedMessage.timestamp}
                        </p>
                      </div>
                    </div>
                    {selectedMessage.unread && (
                      <button className="flex items-center gap-2 rounded-lg bg-green-100 px-3 py-2 text-sm font-medium text-green-700">
                        <FaCheck size={12} />
                        Tandai Dibaca
                      </button>
                    )}
                  </div>
                  <h2 className="mt-4 text-xl font-semibold text-neutral-800">
                    {selectedMessage.subject}
                  </h2>
                </div>

                {/* Message Content */}
                <div className="flex-1 overflow-y-auto p-6 bg-neutral-50">
                  <p className="text-neutral-700 leading-relaxed">
                    {selectedMessage.content}
                  </p>
                </div>

                {/* Reply Section */}
                <div className="border-t border-neutral-200 p-6 bg-white">
                  <label className="mb-2 block text-sm font-medium text-neutral-700">
                    Balas Pesan
                  </label>
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Tulis balasan..."
                    rows={4}
                    className="mb-4 w-full rounded-lg border border-neutral-300 px-4 py-3 text-sm text-neutral-800 placeholder-neutral-400 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/50"
                  />
                  <motion.button
                    onClick={handleReply}
                    className="flex items-center gap-2 rounded-lg bg-green-500 px-6 py-3 font-medium text-white transition-all hover:bg-green-600"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FaPaperPlane size={16} />
                    Kirim Balasan
                  </motion.button>
                </div>
              </div>
            ) : (
              <div className="flex h-[600px] items-center justify-center rounded-2xl bg-white shadow-lg">
                <p className="text-neutral-500">Pilih pesan untuk melihat detail</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminInboxPage;





