"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaHome, FaArrowLeft, FaSeedling } from "react-icons/fa";

export default function NotFound() {
  const router = useRouter();

  return (
    <div 
      data-not-found="true"
      className="flex min-h-screen items-center justify-center bg-gradient-to-br from-neutral-50 via-green-50 to-neutral-100 px-4"
    >
      <div className="text-center">
        {/* 404 Number */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="mb-6"
        >
          <h1 className="text-9xl font-extrabold text-green-600 sm:text-[12rem]">
            404
          </h1>
        </motion.div>

        {/* Icon Animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6 flex justify-center"
        >
          <div className="relative">
            <motion.div
              animate={{
                rotate: [0, 10, -10, 10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 1,
              }}
            >
              <FaSeedling className="text-6xl text-green-500 sm:text-7xl" />
            </motion.div>
            <motion.div
              className="absolute inset-0 rounded-full bg-green-200/50"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 0, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            />
          </div>
        </motion.div>

        {/* Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <h2 className="mb-3 text-3xl font-bold text-neutral-800 sm:text-4xl">
            Halaman Tidak Ditemukan
          </h2>
          <p className="mx-auto max-w-md text-lg text-neutral-600 sm:text-xl">
            Maaf, halaman yang Anda cari tidak ditemukan. Mungkin halaman ini
            telah dipindahkan atau dihapus.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <motion.button
            onClick={() => router.back()}
            className="flex items-center gap-2 rounded-lg border-2 border-green-500 bg-white px-6 py-3 font-semibold text-green-600 transition-all hover:bg-green-50 hover:shadow-lg cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaArrowLeft size={18} />
            Kembali
          </motion.button>

          <Link href="/">
            <motion.button
              className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-green-500 to-green-600 px-6 py-3 font-semibold text-white shadow-lg shadow-green-500/30 transition-all hover:from-green-600 hover:to-green-700 hover:shadow-xl cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaHome size={18} />
              Kembali ke Beranda
            </motion.button>
          </Link>
        </motion.div>

        {/* Decorative Elements */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 flex justify-center gap-2"
        >
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="h-2 w-2 rounded-full bg-green-400"
              animate={{
                y: [0, -10, 0],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
}

