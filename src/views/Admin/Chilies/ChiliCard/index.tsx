"use client";

import { motion } from "framer-motion";
import Image from "next/legacy/image";
import { FaEdit, FaTrash, FaImage } from "react-icons/fa";
import type { Chili } from "@/types";

interface ChiliCardProps {
  chili: Chili;
  activeActionId: string | null;
  onEdit: () => void;
  onDelete: () => void;
}

const ChiliCard = ({
  chili,
  activeActionId,
  onEdit,
  onDelete,
}: ChiliCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-white p-4 shadow-lg"
    >
      <div className="relative mb-4 aspect-video w-full overflow-hidden rounded-xl bg-neutral-100">
        {chili.imageUrl ? (
          chili.imageUrl.includes("supabase.co") ? (
            <Image
              src={chili.imageUrl}
              alt={chili.name}
              className="h-full w-full object-cover rounded-2xl"
              loading="lazy"
              unoptimized={chili.imageUrl.includes("supabase.co")}
              width={480}
              height={300}
              onError={(e) => {
                const target = e.currentTarget;
                target.src =
                  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23e5e7eb" width="400" height="300"/%3E%3Ctext fill="%239ca3af" font-family="sans-serif" font-size="16" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EGambar tidak dapat dimuat%3C/text%3E%3C/svg%3E';
                target.onerror = null;
              }}
            />
          ) : (
            <Image
              src={chili.imageUrl}
              alt={chili.name}
              layout="fill"
              className="object-cover"
              unoptimized={chili.imageUrl.includes("supabase.co")}
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          )
        ) : (
          <div className="flex h-full items-center justify-center">
            <FaImage className="text-neutral-400" size={48} />
          </div>
        )}
      </div>
      <h3 className="mb-2 text-lg font-bold text-neutral-800">
        {chili.name}
      </h3>
      <p className="mb-4 line-clamp-3 text-sm text-neutral-600">
        {chili.description}
      </p>
      <div className="flex gap-2">
        <button
          onClick={onEdit}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-100"
        >
          <FaEdit size={14} />
          Edit
        </button>
        <button
          onClick={onDelete}
          disabled={activeActionId === chili.id}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-100 disabled:opacity-50"
        >
          <FaTrash size={14} />
          {activeActionId === chili.id ? "..." : "Hapus"}
        </button>
      </div>
    </motion.div>
  );
};

export default ChiliCard;








