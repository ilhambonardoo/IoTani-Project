"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "react-toastify";
import ConfirmationModal from "@/components/ui/ConfirmationModal/page";
import {
  useAuth,
  useTemplates,
  useForm,
  useModal,
  useDeleteConfirm,
} from "@/hooks";
import TemplateHeader from "./TemplateHeader";
import TemplateCard from "./TemplateCard";
import TemplateFormModal from "./TemplateFormModal";
import SendTemplateModal from "./SendTemplateModal";
import type { Template } from "@/types";

const TemplateManagementPage = () => {
  const { user: sessionUser, fullName } = useAuth();
  const {
    templates,
    isLoading,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    sendTemplate,
  } = useTemplates();

  const {
    formData,
    setFormData,
    isSubmitting,
    setIsSubmitting,
    reset: resetForm,
  } = useForm({
    name: "",
    title: "",
    content: "",
    category: "Umum",
  });

  const isFormOpen = useModal(false);
  const deleteConfirm = useDeleteConfirm();
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [sendConfirm, setSendConfirm] = useState({
    isOpen: false,
    id: "",
    targetRole: "user" as "user" | "admin" | "owner" | "all",
  });
  const [isSending, setIsSending] = useState(false);

  const senderName = fullName || sessionUser?.name || "Admin System";

  const handleSubmit = async () => {
    if (
      !formData.name.trim() ||
      !formData.title.trim() ||
      !formData.content.trim()
    ) {
      toast.error("Semua field wajib diisi");
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingTemplate) {
        await updateTemplate(editingTemplate.id, formData);
      } else {
        await createTemplate(formData);
      }
      isFormOpen.close();
      setEditingTemplate(null);
      resetForm();
    } catch {
      // Error sudah di-handle di hook
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteConfirm.id) return;

    try {
      await deleteTemplate(deleteConfirm.id);
      deleteConfirm.close();
    } catch {
      // Error sudah di-handle di hook
    }
  };

  const confirmSend = async () => {
    if (!sendConfirm.id) return;

    setIsSending(true);
    try {
      await sendTemplate(
        sendConfirm.id,
        sendConfirm.targetRole,
        senderName,
        "admin"
      );
      setSendConfirm({ isOpen: false, id: "", targetRole: "user" });
    } catch {
      // Error sudah di-handle di hook
    } finally {
      setIsSending(false);
    }
  };

  const handleEdit = (template: Template) => {
    setEditingTemplate(template);
    setFormData({
      name: template.name,
      title: template.title,
      content: template.content,
      category: template.category,
    });
    isFormOpen.open();
  };

  const handleNew = () => {
    setEditingTemplate(null);
    resetForm();
    isFormOpen.open();
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-neutral-50 to-neutral-100 p-4 sm:p-6 lg:p-8 pt-16 md:pt-4">
      <div className="mx-auto max-w-6xl">
        <TemplateHeader onNewClick={handleNew} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {isLoading ? (
            <div className="flex h-40 items-center justify-center rounded-2xl bg-white shadow-lg text-neutral-500">
              Memuat templates...
            </div>
          ) : templates.length === 0 ? (
            <div className="flex h-40 items-center justify-center rounded-2xl bg-white shadow-lg text-neutral-500">
              Belum ada template. Buat template baru untuk memulai.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {templates.map((template) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  onEdit={() => handleEdit(template)}
                  onSend={() =>
                    setSendConfirm({
                      isOpen: true,
                      id: template.id,
                      targetRole: "user",
                    })
                  }
                  onDelete={() => deleteConfirm.open(template.id)}
                />
              ))}
            </div>
          )}
        </motion.div>

        <ConfirmationModal
          isOpen={deleteConfirm.isOpen}
          onClose={deleteConfirm.close}
          onConfirm={confirmDelete}
          title="Hapus Template"
        >
          <p className="text-neutral-700">
            Apakah Anda yakin ingin menghapus template ini?
          </p>
        </ConfirmationModal>

        <TemplateFormModal
          isOpen={isFormOpen.isOpen}
          editingTemplate={editingTemplate}
          formData={formData}
          isSubmitting={isSubmitting}
          onFormDataChange={setFormData}
          onClose={() => {
            isFormOpen.close();
            setEditingTemplate(null);
            resetForm();
          }}
          onSubmit={handleSubmit}
        />

        <SendTemplateModal
          isOpen={sendConfirm.isOpen}
          targetRole={sendConfirm.targetRole}
          isSending={isSending}
          onTargetRoleChange={(role) =>
            setSendConfirm({ ...sendConfirm, targetRole: role })
          }
          onClose={() =>
            setSendConfirm({ isOpen: false, id: "", targetRole: "user" })
          }
          onConfirm={confirmSend}
        />
      </div>
    </div>
  );
};

export default TemplateManagementPage;






