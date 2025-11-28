"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ConfirmationModal from "@/components/ui/ConfirmationModal/page";
import {
  getUser,
  deleteUserAdmin,
  updateUserAdmin,
  addUserAdmin,
} from "@/lib/db/firebase/service";
import UserManagementHeader from "./UserManagementHeader";
import UserTable from "./UserTable";
import UserCard from "./UserCard";
import AddUserModal from "./AddUserModal";
import EditUserModal from "./EditUserModal";
import type { User } from "@/types";

const UserManagementPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isModalOpen, setisModalOpen] = useState(false);
  const [userToDelete, setuserToDelete] = useState<string | null>(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
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
        return err;
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
        const errorMsg =
          result?.message || "Gagal menghapus pengguna dari server";
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

  const showEditModal = (user: User) => {
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
        const errorMsg =
          result?.message || "Gagal mengupdate pengguna dari server";
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
    const userRole =
      addFormData.role.charAt(0).toUpperCase() + addFormData.role.slice(1);

    try {
      const result = await addUserAdmin({
        fullName: addFormData.fullName,
        email: addFormData.email,
        password: addFormData.password,
        role: addFormData.role,
      });

      if (result?.status) {
        const userList = await getUser();
        setUsers(userList);
        toast.success(
          `✅ Berhasil menambahkan pengguna "${userName}" sebagai ${userRole}`
        );
        handleCloseAddModal();
      } else {
        const errorMsg =
          result?.message || "Gagal menambahkan pengguna dari server";
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
          <UserManagementHeader
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onAddClick={showAddModal}
          />

          <UserTable
            users={filteredUsers}
            onEdit={showEditModal}
            onDelete={showDeleteConfirm}
          />

          <UserCard
            users={filteredUsers}
            onEdit={showEditModal}
            onDelete={showDeleteConfirm}
          />

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

          <AddUserModal
            isOpen={isAddModalOpen}
            formData={addFormData}
            onFormDataChange={setAddFormData}
            onClose={handleCloseAddModal}
            onSave={handleAddUser}
          />

          <EditUserModal
            isOpen={isEditModalOpen}
            formData={editFormData}
            onFormDataChange={setEditFormData}
            onClose={handleCloseEditModal}
            onSave={handleUpdateUser}
          />

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
};

export default UserManagementPage;







