"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { LuSave, LuX, LuTrash2 } from "react-icons/lu";
import { BiEdit } from "react-icons/bi";
import { getInitials, getAvatarColor, hasCustomAvatar } from "@/lib/utils/profile-avatar";
import type { ExtendedSessionUser, ProfileData } from "@/types";

interface ProfileHeaderProps {
  user: ExtendedSessionUser | null;
  fullName: string;
  profileData: Pick<ProfileData, "avatarUrl">;
  formData: Pick<ProfileData, "avatarUrl">;
  uploadPreview: string | null;
  isEditing: boolean;
  isLoading: boolean;
  imageError: boolean;
  onEditClick: () => void;
  onSaveClick: () => void;
  onCancelClick: () => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDeletePhotoClick: () => void;
  setImageError: (error: boolean) => void;
}

export default function ProfileHeader({
  user,
  fullName,
  profileData,
  formData,
  uploadPreview,
  isEditing,
  isLoading,
  imageError,
  onEditClick,
  onSaveClick,
  onCancelClick,
  onFileChange,
  onDeletePhotoClick,
  setImageError,
}: ProfileHeaderProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const onPick = () => fileRef.current?.click();

  const avatarSrc = uploadPreview || profileData.avatarUrl || "";
  const displayName = isEditing
    ? fullName || user?.fullName || ""
    : user?.fullName || fullName || "";
  const initials = getInitials(displayName);
  const color = getAvatarColor(displayName);
  const hasCustom = hasCustomAvatar(avatarSrc) && !imageError;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="relative overflow-hidden rounded-3xl bg-linear-to-br from-green-500 via-green-600 to-emerald-600 p-6 sm:p-8 shadow-2xl md:p-12"
    >
      {/* Edit Button */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex gap-2">
        {isEditing ? (
          <>
            <motion.button
              onClick={onSaveClick}
              disabled={isLoading}
              className="inline-flex items-center cursor-pointer rounded-full bg-green-500 p-3 text-white transition-colors hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: isLoading ? 1 : 1.1 }}
              whileTap={{ scale: isLoading ? 1 : 0.9 }}
              aria-label="Simpan Profil"
            >
              <LuSave size={20} />
            </motion.button>

            <motion.button
              onClick={onCancelClick}
              className="inline-flex items-center cursor-pointer rounded-full bg-gray-200 p-3 text-gray-700 transition-colors hover:bg-gray-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Batal Edit"
            >
              <LuX size={20} />
            </motion.button>
          </>
        ) : (
          <motion.button
            onClick={onEditClick}
            className="inline-flex items-center cursor-pointer rounded-full bg-green-100 p-3 text-green-800 transition-colors hover:bg-green-200"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Edit Profil"
          >
            <BiEdit size={20} />
          </motion.button>
        )}
      </div>

      {/* Profile Content */}
      <div className="flex flex-col items-center text-center">
        <div className="relative mb-6">
          <motion.button
            onClick={onPick}
            disabled={!isEditing}
            className="relative"
          >
            <div className="relative h-32 w-32 sm:h-40 sm:w-40 overflow-hidden rounded-full ring-4 ring-white/50 ring-offset-4 ring-offset-green-600/20 shadow-2xl">
              {hasCustom ? (
                <>
                  {avatarSrc.startsWith("blob:") ? (
                    <Image
                      src={avatarSrc}
                      alt="Profile Preview"
                      width={160}
                      height={160}
                      className="h-full w-full object-cover"
                      unoptimized
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <>
                      <Image
                        src={avatarSrc}
                        alt="Profile"
                        width={160}
                        height={160}
                        className="h-full w-full object-cover"
                        unoptimized={avatarSrc.includes("supabase.co")}
                        onError={() => setImageError(true)}
                      />
                      {imageError && (
                        <div
                          className={`absolute inset-0 flex items-center justify-center bg-linear-to-br ${color} text-white text-5xl font-bold`}
                        >
                          {initials}
                        </div>
                      )}
                    </>
                  )}
                </>
              ) : (
                <div
                  className={`h-full w-full flex items-center justify-center bg-linear-to-br ${color} text-white text-5xl font-bold`}
                >
                  {initials}
                </div>
              )}
              {isEditing && (
                <div className="flex absolute inset-0 items-center justify-center bg-black/50 transition-opacity md:opacity-0 md:hover:opacity-100">
                  <span className="text-sm font-medium text-white">
                    Ubah Foto
                  </span>
                </div>
              )}
            </div>
          </motion.button>
          {isEditing &&
            (() => {
              const currentAvatar = uploadPreview || formData.avatarUrl;
              const hasUploadedPhoto = hasCustomAvatar(currentAvatar);
              return hasUploadedPhoto ? (
                <motion.button
                  onClick={onDeletePhotoClick}
                  disabled={isLoading}
                  className="absolute -bottom-2 -right-2 rounded-full bg-red-500 p-2.5 text-white shadow-xl transition-colors hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: isLoading ? 1 : 1.1 }}
                  whileTap={{ scale: isLoading ? 1 : 0.9 }}
                  aria-label="Hapus Foto"
                >
                  <LuTrash2 size={18} />
                </motion.button>
              ) : null;
            })()}
        </div>
        {isEditing && (
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onFileChange}
          />
        )}

        <h2 className="mb-2 text-2xl sm:text-3xl font-bold text-white md:text-4xl">
          {user?.fullName || fullName || "Pengguna"}
        </h2>

        <p className="text-lg font-medium text-green-100">
          {user?.role || "User"}
        </p>
      </div>
    </motion.div>
  );
}

