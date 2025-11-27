"use client";

import { motion } from "framer-motion";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import RoleBadge from "../RoleBadge";
import type { User } from "@/types";

interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (id: string) => void;
}

const UserTable = ({ users, onEdit, onDelete }: UserTableProps) => {
  return (
    <div className="hidden md:block overflow-hidden rounded-2xl bg-white shadow-lg">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-neutral-200">
          <thead className="bg-neutral-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-neutral-700"
              >
                Nama
              </th>
              <th
                scope="col"
                className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-neutral-700"
              >
                Role
              </th>
              <th
                scope="col"
                className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-neutral-700"
              >
                Aksi
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-neutral-200 bg-white">
            {users.map((user) => (
              <tr
                key={user.id}
                className="transition-colors hover:bg-neutral-50"
              >
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex items-center">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600 font-semibold">
                      {(user.fullName || "U").charAt(0).toUpperCase()}
                    </div>
                    <div className="ml-4">
                      <div className="font-medium text-neutral-800">
                        {user.fullName}
                      </div>
                      <div className="text-sm text-neutral-500">
                        {user.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <RoleBadge role={user.role} />
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                  <div className="flex items-center gap-3">
                    <motion.button
                      onClick={() => onEdit(user)}
                      className="text-green-600 transition-colors hover:text-green-700"
                      aria-label={`Edit ${user.fullName}`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <FiEdit size={18} />
                    </motion.button>
                    {user.role !== "admin" && user.role !== "owner" && (
                      <motion.button
                        onClick={() => onDelete(user.id)}
                        className="text-red-500 transition-colors hover:text-red-600"
                        aria-label={`Delete ${user.fullName}`}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <FiTrash2 size={18} />
                      </motion.button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserTable;



