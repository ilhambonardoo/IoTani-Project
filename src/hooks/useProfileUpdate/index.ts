"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { hasCustomAvatar } from "@/lib/utils/profile-avatar";
import { ProfileFormData } from "@/types/profile";

export function useProfileUpdate() {
  const [isLoading, setIsLoading] = useState(false);

  const updateProfile = async (
    email: string,
    fullName: string,
    formData: ProfileFormData,
    selectedFile: File | null,
    oldAvatarUrl?: string
  ): Promise<{ success: boolean; avatarUrl?: string }> => {
    setIsLoading(true);
    try {
      let avatarUrl = formData.avatarUrl;

      // Upload image if new file selected
      if (selectedFile) {
        // Delete old image if exists
        if (oldAvatarUrl && hasCustomAvatar(oldAvatarUrl)) {
          try {
            await fetch(
              `/api/profile?avatarUrl=${encodeURIComponent(oldAvatarUrl)}`,
              { method: "DELETE" }
            );
          } catch {
            // Ignore deletion errors
          }
        }

        const uploadFormData = new FormData();
        uploadFormData.append("file", selectedFile);
        uploadFormData.append("email", email);

        const uploadRes = await fetch("/api/profile/upload", {
          method: "POST",
          body: uploadFormData,
        });

        const uploadData = await uploadRes.json();
        if (uploadRes.ok && uploadData.status && uploadData.data?.url) {
          avatarUrl = uploadData.data.url;
        } else {
          throw new Error(uploadData.message || "Gagal mengupload foto");
        }
      }

      // Update profile
      const updateRes = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          fullName,
          phone: formData.phone,
          location: formData.location,
          bio: formData.bio,
          instagram: formData.instagram,
          avatarUrl: avatarUrl,
        }),
      });

      const updateData = await updateRes.json();
      if (updateRes.ok && updateData.status) {
        toast.success("Profile berhasil diperbarui");
        return { success: true, avatarUrl };
      } else {
        throw new Error(updateData.message || "Gagal memperbarui profile");
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Gagal menyimpan profile";
      toast.error(message);
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  const deletePhoto = async (
    email: string,
    currentAvatar: string,
    formData: ProfileFormData
  ): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Delete image file
      const deleteRes = await fetch(
        `/api/profile?avatarUrl=${encodeURIComponent(currentAvatar)}`,
        {
          method: "DELETE",
        }
      );

      const deleteData = await deleteRes.json();
      if (!deleteRes.ok || !deleteData.status) {
        // Continue even if file deletion fails
      }

      // Update profile - remove avatarUrl to use default initials
      const updateRes = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          phone: formData.phone || "",
          location: formData.location || "",
          bio: formData.bio || "",
          instagram: formData.instagram || "",
          avatarUrl: "", // Empty string means use default initials
        }),
      });

      const updateData = await updateRes.json();
      if (updateRes.ok && updateData.status) {
        toast.success("Foto berhasil dihapus");
        return true;
      } else {
        throw new Error(updateData.message || "Gagal menghapus foto");
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Gagal menghapus foto";
      toast.error(message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    updateProfile,
    deletePhoto,
  };
}
