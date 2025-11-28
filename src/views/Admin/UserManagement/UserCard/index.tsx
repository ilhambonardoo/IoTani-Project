"use client";

import { motion } from "framer-motion";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import RoleBadge from "../RoleBadge";
import type { User } from "@/types";

interface UserCardProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (id: string) => void;
}

const UserCard = ({ users, onEdit, onDelete }: UserCardProps) => {
  return (
    <div className="md:hidden space-y-4">
      {users.map((user) => (
        <motion.div
          key={user.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-white p-4 shadow-lg"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600 font-semibold text-lg">
                {(user.fullName || "U").charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-neutral-800 truncate">
                  {user.fullName}
                </div>
                <div className="text-sm text-neutral-500 truncate">
                  {user.email}
                </div>
                <div className="mt-2">
                  <RoleBadge role={user.role} />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 ml-2 flex-shrink-0">
              <motion.button
                onClick={() => onEdit(user)}
                className="p-2 text-green-600 transition-colors hover:bg-green-50 rounded-lg"
                aria-label={`Edit ${user.fullName}`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FiEdit size={20} />
              </motion.button>
              {user.role !== "admin" && user.role !== "owner" && (
                <motion.button
                  onClick={() => onDelete(user.id)}
                  className="p-2 text-red-500 transition-colors hover:bg-red-50 rounded-lg"
                  aria-label={`Delete ${user.fullName}`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FiTrash2 size={20} />
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default UserCard;







