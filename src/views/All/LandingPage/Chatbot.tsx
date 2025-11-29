"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoChatbubbleEllipses, IoClose } from "react-icons/io5";
import { FiSend } from "react-icons/fi";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [messages, setMessages] = useState<Array<{
    id: number;
    text: string;
    sender: "bot" | "user";
    timestamp: Date;
  }>>([]);
  const [inputMessage, setInputMessage] = useState("");

  useEffect(() => {
    setMounted(true);
    // Initialize with fixed timestamp to avoid hydration mismatch
    setMessages([
      {
        id: 1,
        text: "Halo! Saya adalah asisten virtual IoTani. Ada yang bisa saya bantu?",
        sender: "bot",
        timestamp: new Date("2024-01-01T12:00:00"),
      },
    ]);
  }, []);

  const handleSendMessage = () => {
    if (!inputMessage.trim() || !mounted) return;

    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: "user" as const,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");

    // Simulate bot response
    setTimeout(() => {
      const botResponses = [
        "Terima kasih atas pertanyaan Anda. IoTani adalah platform smart farming yang membantu petani memantau dan mengelola lahan mereka dengan teknologi IoT.",
        "Fitur utama IoTani meliputi monitoring real-time (pH, kelembapan, suhu), kontrol otomatis robot semprot/siram, dan deteksi hama menggunakan AI.",
        "Untuk informasi lebih lanjut, silakan hubungi tim kami atau daftar untuk mendapatkan akses ke platform.",
        "Saya di sini untuk membantu! Apakah ada pertanyaan lain tentang IoTani?",
      ];

      const randomResponse =
        botResponses[Math.floor(Math.random() * botResponses.length)];

      const botMessage = {
        id: messages.length + 2,
        text: randomResponse,
        sender: "bot" as const,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    }, 1000);
  };

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(true)}
        className={`cursor-pointer fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg shadow-green-500/50 transition-all hover:shadow-xl hover:shadow-green-500/60 hover:scale-110 ${
          isOpen ? "hidden sm:flex" : "flex"
        }`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ scale: 0 }}
        animate={{ scale: isOpen ? 0 : 1 }}
        transition={{ delay: isOpen ? 0 : 1, type: "spring", stiffness: 200 }}
      >
        <IoChatbubbleEllipses className="h-6 w-6 sm:h-7 sm:w-7" />
        {!isOpen && (
          <motion.span
            className="absolute -top-1 -right-1 h-3 w-3 sm:h-4 sm:w-4 rounded-full bg-orange-500"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          />
        )}
      </motion.button>

      {/* Chatbot Window */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Mobile Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 sm:hidden"
              onClick={() => setIsOpen(false)}
            />
            
            <motion.div
              initial={{ opacity: 0, y: "100%" }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: "100%" }}
              transition={{ 
                type: "spring", 
                damping: 25, 
                stiffness: 200 
              }}
              className="fixed inset-x-0 bottom-0 sm:inset-x-auto sm:bottom-24 sm:right-6 z-50 h-[85vh] sm:h-[500px] w-full sm:w-[380px] md:w-[420px] max-w-[100vw] sm:max-w-[380px] md:max-w-[420px] rounded-t-2xl sm:rounded-2xl bg-white shadow-2xl flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between bg-gradient-to-r from-green-500 to-green-600 px-3 sm:px-4 py-3 flex-shrink-0">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="h-2 w-2 rounded-full bg-white animate-pulse flex-shrink-0" />
                  <h3 className="font-semibold text-white text-sm sm:text-base truncate">IoTani Assistant</h3>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="cursor-pointer text-white hover:text-neutral-100 transition-colors p-1 flex-shrink-0"
                >
                  <IoClose className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 sm:p-4 space-y-3 sm:space-y-4 bg-neutral-50 min-w-0">
                {mounted && messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex min-w-0 w-full ${
                      message.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[85%] sm:max-w-[80%] min-w-0 rounded-2xl px-3 py-2 sm:px-4 sm:py-2 ${
                        message.sender === "user"
                          ? "bg-green-500 text-white"
                          : "bg-white text-neutral-800 shadow-md"
                      }`}
                    >
                      <p className="text-xs sm:text-sm leading-relaxed break-words">{message.text}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Input */}
              <div className="border-t border-neutral-200 p-3 sm:p-4 bg-white min-w-0 flex-shrink-0">
                <div className="flex gap-2 min-w-0 w-full">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder="Tulis pesan..."
                    className="flex-1 min-w-0 w-0 rounded-lg border border-neutral-300 px-3 py-2 sm:px-4 sm:py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <motion.button
                    onClick={handleSendMessage}
                    className="cursor-pointer flex items-center justify-center rounded-lg bg-green-500 px-3 py-2 sm:px-4 sm:py-2 text-white transition-colors hover:bg-green-600 flex-shrink-0"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FiSend className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;
