"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { FaQuestionCircle, FaUser, FaCheckCircle } from "react-icons/fa";
import { HiOutlineSearch } from "react-icons/hi";
import { FiMessageSquare, FiThumbsUp } from "react-icons/fi";

interface Question {
  id: number;
  title: string;
  content: string;
  author: string;
  category: string;
  answers: number;
  votes: number;
  isAnswered: boolean;
  timestamp: string;
}

const ForumPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const questions: Question[] = [
    {
      id: 1,
      title: "Bagaimana cara mengatasi hama pada tanaman cabai?",
      content:
        "Saya mengalami masalah dengan hama pada tanaman cabai saya. Apakah ada solusi yang efektif?",
      author: "Petani A",
      category: "Hama & Penyakit",
      answers: 5,
      votes: 12,
      isAnswered: true,
      timestamp: "2 jam lalu",
    },
    {
      id: 2,
      title: "Kapan waktu terbaik untuk menyiram tanaman?",
      content:
        "Saya ingin tahu kapan waktu yang paling optimal untuk menyiram tanaman cabai.",
      author: "Petani B",
      category: "Perawatan",
      answers: 3,
      votes: 8,
      isAnswered: true,
      timestamp: "5 jam lalu",
    },
    {
      id: 3,
      title: "Berapa pH optimal untuk tanaman cabai?",
      content:
        "Saya baru menggunakan sistem IoTani dan ingin tahu pH tanah yang optimal untuk cabai.",
      author: "Petani C",
      category: "Teknologi",
      answers: 2,
      votes: 6,
      isAnswered: false,
      timestamp: "1 hari lalu",
    },
  ];

  const categories = [
    "Semua",
    "Hama & Penyakit",
    "Perawatan",
    "Teknologi",
    "Pupuk",
    "Lainnya",
  ];

  const filteredQuestions = questions.filter((q) => {
    const matchesSearch =
      q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || q.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
            Forum QnA / Edukasi
          </h1>
          <p className="mt-2 text-neutral-600">
            Ajukan pertanyaan dan dapatkan jawaban dari penyuluh pertanian
          </p>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 space-y-4"
        >
          <div className="relative">
            <HiOutlineSearch
              className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Cari pertanyaan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-neutral-300 bg-white px-12 py-3 text-neutral-800 placeholder-neutral-400 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/50"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() =>
                  setSelectedCategory(category === "Semua" ? "all" : category)
                }
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                  (selectedCategory === "all" && category === "Semua") ||
                  selectedCategory === category
                    ? "bg-green-500 text-white shadow-md"
                    : "bg-white text-neutral-700 hover:bg-neutral-100"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Ask Question Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <motion.button
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-green-500 to-green-600 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:from-green-600 hover:to-green-700 hover:shadow-xl"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FaQuestionCircle size={20} />
            Ajukan Pertanyaan
          </motion.button>
        </motion.div>

        {/* Questions List */}
        <div className="space-y-4">
          {filteredQuestions.map((question, index) => (
            <motion.div
              key={question.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="rounded-2xl bg-white p-6 shadow-lg transition-all hover:shadow-xl"
            >
              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center gap-2">
                  <button className="flex flex-col items-center rounded-lg border border-neutral-200 p-2 transition-all hover:bg-green-50 hover:border-green-500">
                    <FiThumbsUp size={20} className="text-neutral-600" />
                    <span className="text-sm font-medium text-neutral-700">
                      {question.votes}
                    </span>
                  </button>
                </div>

                <div className="flex-1">
                  <div className="mb-2 flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-2">
                        <h3 className="text-lg font-semibold text-neutral-800">
                          {question.title}
                        </h3>
                        {question.isAnswered && (
                          <FaCheckCircle className="text-green-500" size={18} />
                        )}
                      </div>
                      <p className="text-neutral-600">{question.content}</p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <FaUser className="text-neutral-400" size={14} />
                      <span className="text-neutral-600">
                        {question.author}
                      </span>
                    </div>
                    <span className="rounded-full bg-green-100 px-3 py-1 text-green-700">
                      {question.category}
                    </span>
                    <div className="flex items-center gap-2 text-neutral-500">
                      <FiMessageSquare size={14} />
                      <span>{question.answers} jawaban</span>
                    </div>
                    <span className="text-neutral-500">
                      {question.timestamp}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredQuestions.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-2xl bg-white p-12 text-center shadow-lg"
          >
            <FaQuestionCircle
              className="mx-auto mb-4 text-neutral-400"
              size={48}
            />
            <p className="text-lg text-neutral-600">
              Tidak ada pertanyaan yang ditemukan
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ForumPage;
