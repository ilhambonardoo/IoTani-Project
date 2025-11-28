"use client";

import { motion } from "framer-motion";
import { LuUser } from "react-icons/lu";

const inputStyle =
  "w-full p-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all bg-white text-neutral-800";

interface ProfileAboutProps {
  bio: string;
  isEditing: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export default function ProfileAbout({
  bio,
  isEditing,
  onInputChange,
}: ProfileAboutProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="rounded-2xl bg-white p-4 sm:p-6 shadow-xl md:p-8"
    >
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-lg bg-green-100 p-2">
          <LuUser className="text-green-600" size={24} />
        </div>
        <h2 className="text-2xl font-bold text-neutral-800">Tentang Saya</h2>
      </div>

      {isEditing ? (
        <textarea
          name="bio"
          rows={6}
          value={bio}
          onChange={onInputChange}
          className={inputStyle}
          placeholder="Ceritakan tentang diri Anda..."
        />
      ) : (
        <p className="text-base leading-relaxed text-neutral-700 whitespace-pre-wrap">
          {bio ||
            "Belum ada informasi tentang diri Anda. Klik tombol Edit untuk menambahkan."}
        </p>
      )}
    </motion.div>
  );
}

