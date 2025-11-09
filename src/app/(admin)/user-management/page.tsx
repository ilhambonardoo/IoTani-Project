"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FiEdit, FiPlus, FiSearch, FiTrash2 } from "react-icons/fi";
import { HiOutlineUser } from "react-icons/hi";
import {
  MdAdminPanelSettings,
  MdOutlineSupervisorAccount,
} from "react-icons/md";
import { getUser, deleteUserAdmin } from "@/lib/firebase/service";
import { toast } from "react-toastify";
import ConfirmationModal from "../../../components/ConfirmationModal/page";

const RoleBadge = ({ role }: { role: string }) => {
  const roleColors: { [key: string]: string } = {
    Admin: "bg-red-500/20 text-red-300",
    Manager: "bg-yellow-500/20 text-yellow-300",
    User: "bg-blue-500/20 text-blue-300",
  };
  const roleIcon: { [key: string]: React.ReactNode } = {
    Admin: <MdAdminPanelSettings className="mr-1 w-4 h-4" />,
    Manager: <MdOutlineSupervisorAccount className="mr-1 w-4 h-4" />,
    User: <HiOutlineUser className="mr-1 w-4 h-4" />,
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
        roleColors[role] || "bg-gray-500/20 text-gray-300"
      }`}
    >
      {roleIcon[role]}
      {role}
    </span>
  );
};

export default function UserManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // const { data: session }: { data: any } = useSession();
  // const isAdmin = session?.user?.role === "admin";

  const [isModalOpen, setisModalOpen] = useState(false);
  const [userToDelete, setuserToDelete] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const userList = await getUser();
        setUsers(userList);
      } catch (err) {
        setError("Gagal mengambil data pengguna");
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  const filteredUsers = users.filter((user) => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return true;
    return (
      (user.fullName || "").toLowerCase().includes(q) ||
      (user.email || "").toLowerCase().includes(q) ||
      (user.role || "").toLowerCase().includes(q)
    );
  });

  const handleCloseModal = () => {
    setisModalOpen(false);
    setuserToDelete(null);
  };

  const showDeleteConfirm = (id: string) => {
    setisModalOpen(true);
    setuserToDelete(id);
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) {
      return;
    }

    try {
      const result = await deleteUserAdmin(userToDelete);
      if (result?.status) {
        setUsers((prev) => prev.filter((user) => user.id !== userToDelete));
        toast.success("Berhasil menghapus pengguna");
        handleCloseModal();
      } else {
        setError("Gagal menghapus pengguna dari server");
        toast.error("Gagal menghapus pengguna");
      }
    } catch (error) {
      setError("Gagal menghapus pengguna");
      toast.error("Gagal menghapus pengguna");
      return error;
    }
  };

  const handleUpdateUser = async (id: string) => {};
  if (loading) {
    return (
      <div className="flex h-60 w-full items-center justify-center text-white">
        Loading data...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-60 w-full items-center justify-center rounded-lg border border-red-500/50 bg-red-500/10 p-4 text-red-300">
        Error: {error}
      </div>
    );
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
      className="w-full"
    >
      <div className="mb-6 flex flex-col items-center justify-between gap-4 md:flex-row">
        <h2 className="flex items-center text-3xl font-bold text-white">
          <MdAdminPanelSettings className="mr-3 text-lime-400 w-8 h-8" />
          User Management
        </h2>
        <div className="flex w-full gap-2 md:w-auto">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Cari user..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-white/30 bg-black/40 px-4 py-2 pl-10 text-white placeholder-gray-400 backdrop-blur-md focus:border-lime-400 focus:outline-none focus:ring-1 focus:ring-lime-400"
            />
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
          <button className="flex items-center justify-center rounded-lg bg-lime-500 px-4 py-2 font-semibold text-black transition-all hover:bg-lime-400 focus:outline-none focus:ring-2 focus:ring-lime-300">
            <FiPlus className="mr-2" />
            Add User
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/30 bg-black/40 backdrop-blur-md">
        <table className="min-w-full divide-y divide-white/30">
          <thead className="bg-black/30">
            <tr>
              <th
                scope="col"
                className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-lime-400"
              >
                Nama
              </th>
              <th
                scope="col"
                className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-lime-400"
              >
                Role
              </th>

              <th
                scope="col"
                className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-lime-400"
              >
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/20">
            {filteredUsers.map((user) => (
              <tr
                key={user.id}
                className="text-stone-100 transition-colors hover:bg-black/20"
              >
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0">
                      {/* <img
                        className="h-10 w-10 rounded-full object-cover"
                        src={user.avatar}
                        alt={user.fullName || "Avatar"}
                        onError={(e) => {
                          const target = e.currentTarget;
                          target.src =
                            "https://placehold.co/40x40/374151/FFF?text=" +
                            (user.fullName ? user.fullName.charAt(0) : "U");
                          target.onerror = null; // Mencegah loop error
                        }}
                      /> */}
                    </div>
                    <div className="ml-4">
                      <div className="font-medium text-white">
                        {user.fullName}
                      </div>
                      <div className="text-sm text-gray-400">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <RoleBadge role={user.role} />
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                  <button
                    className="mr-3 text-lime-400 transition-colors hover:text-lime-300"
                    aria-label={`Edit ${user.fullName}`}
                  >
                    <FiEdit size={18} />
                  </button>
                  {user.role !== "admin" && (
                    <button
                      onClick={() => showDeleteConfirm(user.id)}
                      className={`text-red-500 transition-colors hover:text-red-400`}
                      aria-label={`Delete ${user.fullName}`}
                    >
                      <FiTrash2 size={18} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleDeleteUser}
        title="Konfirmasi Hapus Penggua"
      >
        <p>Apakah Anda yakin ingin menghapus pengguna ini?</p>
        <p className="mt-2 text-sm text-gray-400">
          Tindakan ini tidak dapat dibatalkan.
        </p>
      </ConfirmationModal>

      {filteredUsers.length === 0 && !loading && (
        <div className="mt-4 rounded-lg border border-white/30 bg-black/40 p-10 text-center text-gray-400 backdrop-blur-md">
          {searchTerm
            ? `Tidak ada pengguna yang cocok dengan pencarian "${searchTerm}".`
            : "Tidak ada data pengguna."}
        </div>
      )}
    </motion.div>
  );
}
