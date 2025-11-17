"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { FiEdit, FiPlus, FiSearch, FiTrash2 } from "react-icons/fi";
import { HiOutlineUser } from "react-icons/hi";
import {
  MdAdminPanelSettings,
  MdOutlineSupervisorAccount,
} from "react-icons/md";
import {
  getUser,
  deleteUserAdmin,
  updateUserAdmin,
  addUserAdmin,
} from "@/lib/firebase/service";
import { toast } from "react-toastify";
import ConfirmationModal from "../../../components/ConfirmationModal/page";

const RoleBadge = ({ role }: { role: string }) => {
  // Normalize role to handle both lowercase and capitalized
  const normalizedRole = role
    ? role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()
    : "User";

  const roleColors: { [key: string]: string } = {
    Admin: "bg-red-100 text-red-700",
    Owner: "bg-yellow-100 text-yellow-700",
    User: "bg-green-100 text-green-700",
  };
  const roleIcon: { [key: string]: React.ReactNode } = {
    Admin: <MdAdminPanelSettings className="mr-1 w-4 h-4" />,
    Owner: <MdOutlineSupervisorAccount className="mr-1 w-4 h-4" />,
    User: <HiOutlineUser className="mr-1 w-4 h-4" />,
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
        roleColors[normalizedRole] || "bg-neutral-100 text-neutral-700"
      }`}
    >
      {roleIcon[normalizedRole]}
      {normalizedRole}
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

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<any | null>(null);
  const [editFormData, setEditFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addFormData, setAddFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "user",
  });

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

    const userToDeleteData = users.find((user) => user.id === userToDelete);
    const userName = userToDeleteData?.fullName || "pengguna";

    try {
      const result = await deleteUserAdmin(userToDelete);
      if (result?.status) {
        setUsers((prev) => prev.filter((user) => user.id !== userToDelete));
        toast.success(`✅ Berhasil menghapus pengguna "${userName}"`);
        handleCloseModal();
      } else {
        const errorMsg = result?.message || "Gagal menghapus pengguna dari server";
        setError(errorMsg);
        toast.error(`❌ Gagal menghapus pengguna "${userName}". ${errorMsg}`);
      }
    } catch (error) {
      const errorMsg = "Terjadi kesalahan saat menghapus pengguna";
      setError(errorMsg);
      toast.error(`❌ Gagal menghapus pengguna "${userName}". ${errorMsg}`);
      return error;
    }
  };

  const showEditModal = (user: any) => {
    setUserToEdit(user);
    setEditFormData({
      fullName: user.fullName || "",
      email: user.email || "",
      password: "",
    });
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setUserToEdit(null);
    setEditFormData({
      fullName: "",
      email: "",
      password: "",
    });
  };

  const handleUpdateUser = async () => {
    if (!userToEdit) {
      return;
    }

    if (!editFormData.fullName.trim() || !editFormData.email.trim()) {
      toast.error("⚠️ Nama dan email harus diisi");
      return;
    }

    if (!editFormData.password.trim()) {
      toast.error("⚠️ Password harus diisi");
      return;
    }

    const userName = editFormData.fullName;

    try {
      const result = await updateUserAdmin(
        userToEdit.id,
        editFormData.fullName,
        editFormData.email,
        editFormData.password
      );

      if (result?.status) {
        setUsers((prev) =>
          prev.map((user) =>
            user.id === userToEdit.id
              ? {
                  ...user,
                  fullName: editFormData.fullName,
                  email: editFormData.email,
                }
              : user
          )
        );
        toast.success(`✅ Berhasil mengupdate data pengguna "${userName}"`);
        handleCloseEditModal();
      } else {
        const errorMsg = result?.message || "Gagal mengupdate pengguna dari server";
        setError(errorMsg);
        toast.error(`❌ Gagal mengupdate pengguna "${userName}". ${errorMsg}`);
      }
    } catch (error) {
      const errorMsg = "Terjadi kesalahan saat mengupdate pengguna";
      setError(errorMsg);
      toast.error(`❌ Gagal mengupdate pengguna "${userName}". ${errorMsg}`);
      return error;
    }
  };

  const showAddModal = () => {
    setAddFormData({
      fullName: "",
      email: "",
      password: "",
      role: "user",
    });
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
    setAddFormData({
      fullName: "",
      email: "",
      password: "",
      role: "user",
    });
  };

  const handleAddUser = async () => {
    if (!addFormData.fullName.trim() || !addFormData.email.trim()) {
      toast.error("⚠️ Nama dan email harus diisi");
      return;
    }

    if (!addFormData.password.trim()) {
      toast.error("⚠️ Password harus diisi");
      return;
    }

    if (addFormData.password.length < 6) {
      toast.error("⚠️ Password minimal 6 karakter");
      return;
    }

    const userName = addFormData.fullName;
    const userRole = addFormData.role.charAt(0).toUpperCase() + addFormData.role.slice(1);

    try {
      const result = await addUserAdmin({
        fullName: addFormData.fullName,
        email: addFormData.email,
        password: addFormData.password,
        role: addFormData.role,
      });

      if (result?.status) {
        // Refresh user list
        const userList = await getUser();
        setUsers(userList);
        toast.success(`✅ Berhasil menambahkan pengguna "${userName}" sebagai ${userRole}`);
        handleCloseAddModal();
      } else {
        const errorMsg = result?.message || "Gagal menambahkan pengguna dari server";
        setError(errorMsg);
        toast.error(`❌ Gagal menambahkan pengguna "${userName}". ${errorMsg}`);
      }
    } catch (error) {
      const errorMsg = "Terjadi kesalahan saat menambahkan pengguna";
      setError(errorMsg);
      toast.error(`❌ Gagal menambahkan pengguna "${userName}". ${errorMsg}`);
      return error;
    }
  };
  if (loading) {
    return (
      <div className="flex h-60 w-full items-center justify-center text-neutral-600">
        <div className="text-center">
          <div className="mb-2 h-8 w-8 animate-spin rounded-full border-4 border-green-500 border-t-transparent mx-auto"></div>
          <p>Memuat data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-60 w-full items-center justify-center rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
        <p>Error: {error}</p>
      </div>
    );
  }
  return (
    <div className="min-h-screen p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
        >
          <div className="mb-8 flex flex-col items-center justify-between gap-4 md:flex-row">
            <div>
              <h1 className="flex items-center text-3xl font-bold text-neutral-800 lg:text-4xl">
                <MdAdminPanelSettings className="mr-3 text-green-600 w-8 h-8" />
                Manajemen Pengguna
              </h1>
              <p className="mt-2 text-neutral-600">
                Kelola pengguna dan peran akses sistem
              </p>
            </div>
            <div className="flex w-full gap-2 md:w-auto">
              <div className="relative flex-grow">
                <input
                  type="text"
                  placeholder="Cari pengguna..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-3 pl-10 text-neutral-800 placeholder-neutral-400 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/50"
                />
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              </div>
              <motion.button
                onClick={showAddModal}
                className="flex items-center cursor-pointer justify-center gap-2 rounded-lg bg-green-500 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiPlus size={18} />
                Tambah Pengguna
              </motion.button>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl bg-white shadow-lg">
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
                {filteredUsers.map((user) => (
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
                          onClick={() => showEditModal(user)}
                          className="text-green-600 transition-colors hover:text-green-700"
                          aria-label={`Edit ${user.fullName}`}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <FiEdit size={18} />
                        </motion.button>
                        {user.role !== "admin" && (
                          <motion.button
                            onClick={() => showDeleteConfirm(user.id)}
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

          {/* Add User Modal */}
          <AnimatePresence>
            {isAddModalOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                onClick={handleCloseAddModal}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <h2 className="mb-4 text-2xl font-bold text-neutral-800">
                    Tambah Pengguna Baru
                  </h2>

                  <div className="mb-6 space-y-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-neutral-700">
                        Nama Lengkap
                      </label>
                      <input
                        type="text"
                        value={addFormData.fullName}
                        onChange={(e) =>
                          setAddFormData({
                            ...addFormData,
                            fullName: e.target.value,
                          })
                        }
                        className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-3 text-neutral-800 placeholder-neutral-400 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/50"
                        placeholder="Masukkan nama lengkap"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-neutral-700">
                        Email
                      </label>
                      <input
                        type="email"
                        value={addFormData.email}
                        onChange={(e) =>
                          setAddFormData({
                            ...addFormData,
                            email: e.target.value,
                          })
                        }
                        className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-3 text-neutral-800 placeholder-neutral-400 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/50"
                        placeholder="Masukkan email"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-neutral-700">
                        Password
                      </label>
                      <input
                        type="password"
                        value={addFormData.password}
                        onChange={(e) =>
                          setAddFormData({
                            ...addFormData,
                            password: e.target.value,
                          })
                        }
                        className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-3 text-neutral-800 placeholder-neutral-400 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/50"
                        placeholder="Minimal 6 karakter"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-neutral-700">
                        Role
                      </label>
                      <select
                        value={addFormData.role}
                        onChange={(e) =>
                          setAddFormData({
                            ...addFormData,
                            role: e.target.value,
                          })
                        }
                        className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-3 text-neutral-800 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/50"
                      >
                        <option value="user">User</option>
                        <option value="owner">Owner</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3">
                    <motion.button
                      className="rounded-lg bg-neutral-200 px-4 py-2 font-semibold text-neutral-700 transition-all hover:bg-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-400"
                      onClick={handleCloseAddModal}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Batal
                    </motion.button>

                    <motion.button
                      className="rounded-lg bg-green-500 px-4 py-2 font-semibold text-white transition-all hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                      onClick={handleAddUser}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Tambah
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Edit User Modal */}
          <AnimatePresence>
            {isEditModalOpen && userToEdit && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                onClick={handleCloseEditModal}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <h2 className="mb-4 text-2xl font-bold text-neutral-800">
                    Edit Pengguna
                  </h2>

                  <div className="mb-6 space-y-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-neutral-700">
                        Nama Lengkap
                      </label>
                      <input
                        type="text"
                        value={editFormData.fullName}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            fullName: e.target.value,
                          })
                        }
                        className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-3 text-neutral-800 placeholder-neutral-400 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/50"
                        placeholder="Masukkan nama lengkap"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-neutral-700">
                        Email
                      </label>
                      <input
                        type="email"
                        value={editFormData.email}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            email: e.target.value,
                          })
                        }
                        className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-3 text-neutral-800 placeholder-neutral-400 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/50"
                        placeholder="Masukkan email"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-neutral-700">
                        Password Baru
                      </label>
                      <input
                        type="password"
                        value={editFormData.password}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            password: e.target.value,
                          })
                        }
                        className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-3 text-neutral-800 placeholder-neutral-400 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/50"
                        placeholder="Masukkan password baru"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3">
                    <motion.button
                      className="rounded-lg bg-neutral-200 px-4 py-2 font-semibold text-neutral-700 transition-all hover:bg-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-400"
                      onClick={handleCloseEditModal}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Batal
                    </motion.button>

                    <motion.button
                      className="rounded-lg bg-green-500 px-4 py-2 font-semibold text-white transition-all hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                      onClick={handleUpdateUser}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Simpan
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {filteredUsers.length === 0 && !loading && (
            <div className="mt-4 rounded-2xl bg-white p-10 text-center shadow-lg">
              <p className="text-neutral-600">
                {searchTerm
                  ? `Tidak ada pengguna yang cocok dengan pencarian "${searchTerm}".`
                  : "Tidak ada data pengguna."}
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
