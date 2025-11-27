"use client";

import { motion } from "framer-motion";
import { FaBell } from "react-icons/fa";
import type { Template } from "@/types";

interface TemplatesReminderCardProps {
  templates: Template[];
  isLoading: boolean;
}

const TemplatesReminderCard = ({
  templates,
  isLoading,
}: TemplatesReminderCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-white p-4 sm:p-6 shadow-lg transition-all hover:shadow-xl md:col-span-2 lg:col-span-3"
    >
      <div className="mb-4 flex items-center gap-2">
        <FaBell className="text-green-500" size={24} />
        <h2 className="text-lg font-semibold text-neutral-800">
          Pengingat Penting
        </h2>
      </div>
      {isLoading ? (
        <div className="flex h-40 items-center justify-center text-neutral-500">
          Memuat pengingat...
        </div>
      ) : templates.length === 0 ? (
        <div className="flex h-40 items-center justify-center text-neutral-500">
          <div className="text-center">
            <FaBell size={48} className="mx-auto mb-2 opacity-50" />
            <p>Belum ada pengingat</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => (
            <motion.div
              key={template.id}
              className="rounded-xl border border-neutral-200 bg-linear-to-br from-green-50 to-white p-4 shadow-sm transition-all hover:shadow-md"
              whileHover={{ y: -2 }}
            >
              <div className="mb-3 flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-neutral-800 text-sm">
                    {template.name}
                  </h3>
                  <p className="text-xs text-neutral-500 mt-1">
                    {template.createdAt}
                  </p>
                </div>
                <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 ml-2">
                  {template.category}
                </span>
              </div>

              <p className="mb-2 text-sm font-medium text-neutral-700">
                {template.title}
              </p>

              <p className="line-clamp-3 text-xs text-neutral-600">
                {template.content}
              </p>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default TemplatesReminderCard;

