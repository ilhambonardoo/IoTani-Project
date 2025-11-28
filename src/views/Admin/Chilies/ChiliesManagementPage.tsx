"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { useChilies, useForm, useFileUpload, useDeleteConfirm } from "@/hooks";
import ConfirmationModal from "@/components/ui/ConfirmationModal/page";
import ChiliesHeader from "./ChiliesHeader";
import ChiliCard from "./ChiliCard";
import ChiliForm from "./ChiliForm";
import type { Chili } from "@/types";

const initialForm = {
  name: "",
  description: "",
  imageUrl: "",
  characteristics: "",
  uses: "",
};

const ChiliesManagementPage = () => {
  const {
    chilies,
    isLoading,
    error,
    refetch: fetchChilies,
    createChili,
    updateChili,
    deleteChili,
  } = useChilies();

  const {
    formData,
    setFormData,
    isSubmitting,
    setIsSubmitting,
    reset: resetForm,
  } = useForm(initialForm);

  const { uploadPreview, selectedFile, fileRef, handleFileChange, clearFile } =
    useFileUpload({
      maxSize: 5 * 1024 * 1024,
      allowedTypes: ["image/"],
      folder: "chilies",
    });

  const deleteConfirm = useDeleteConfirm();
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [activeActionId, setActiveActionId] = useState<string | null>(null);

  const handleAdd = () => {
    setIsAdding(true);
    setIsEditing(null);
    resetForm();
    clearFile();
  };

  const handleEdit = (chili: Chili) => {
    setIsEditing(chili.id);
    setIsAdding(false);
    setFormData({
      name: chili.name,
      description: chili.description,
      imageUrl: chili.imageUrl || "",
      characteristics: chili.characteristics || "",
      uses: chili.uses || "",
    });
    clearFile();
  };

  const resetFormState = () => {
    resetForm();
    setIsEditing(null);
    setIsAdding(false);
    clearFile();
  };

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.description.trim()) {
      toast.error("⚠️ Nama dan deskripsi wajib diisi");
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEditing) {
        await updateChili(isEditing, formData, selectedFile || undefined);
      } else {
        await createChili(formData, selectedFile || undefined);
      }
      resetFormState();
    } catch {
      // Error sudah di-handle di hook
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (activeActionId === id) return;
    deleteConfirm.open(id);
  };

  const confirmDelete = async () => {
    if (!deleteConfirm.id) return;
    setActiveActionId(deleteConfirm.id);
    try {
      await deleteChili(deleteConfirm.id);
    } catch {
    } finally {
      setActiveActionId(null);
      deleteConfirm.close();
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-neutral-50 to-neutral-100 p-4 sm:p-6 lg:p-8 pt-16 md:pt-4">
      <div className="mx-auto max-w-7xl">
        <ChiliesHeader
          onAddClick={handleAdd}
          onRefresh={fetchChilies}
          isLoading={isLoading}
        />

        {error && !isLoading && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            <div className="flex items-center justify-between">
              <p>{error}</p>
              <button
                onClick={() => fetchChilies(true)}
                className="text-sm font-semibold text-red-700 underline"
              >
                Coba lagi
              </button>
            </div>
          </div>
        )}

        {(isAdding || isEditing) && (
          <ChiliForm
            isEditing={!!isEditing}
            formData={formData}
            uploadPreview={uploadPreview}
            selectedFile={selectedFile}
            fileRef={fileRef}
            isSubmitting={isSubmitting}
            onFormDataChange={setFormData}
            onFileChange={handleFileChange}
            onSave={handleSave}
            onCancel={resetFormState}
          />
        )}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            <div className="col-span-full flex h-60 w-full items-center justify-center">
              <div className="text-center text-neutral-600">
                <div className="mx-auto mb-2 h-10 w-10 animate-spin rounded-full border-4 border-green-500 border-t-transparent" />
                <p>Memuat data cabai...</p>
              </div>
            </div>
          ) : chilies.length === 0 ? (
            <div className="col-span-full rounded-2xl border border-dashed border-neutral-300 bg-white p-10 text-center text-neutral-500">
              <p className="text-lg font-semibold text-neutral-700">
                Belum ada cabai
              </p>
              <p className="mt-2">
                Tambah cabai baru untuk ditampilkan di landing page.
              </p>
            </div>
          ) : (
            chilies.map((chili) => (
              <ChiliCard
                key={chili.id}
                chili={chili}
                activeActionId={activeActionId}
                onEdit={() => handleEdit(chili)}
                onDelete={() => handleDelete(chili.id)}
              />
            ))
          )}
        </div>

        <ConfirmationModal
          isOpen={deleteConfirm.isOpen}
          onClose={deleteConfirm.close}
          onConfirm={confirmDelete}
          title="Konfirmasi Hapus"
        >
          <p className="text-neutral-600">
            Apakah Anda yakin ingin menghapus cabai ini? Tindakan ini tidak
            dapat dibatalkan.
          </p>
        </ConfirmationModal>
      </div>
    </div>
  );
};

export default ChiliesManagementPage;




