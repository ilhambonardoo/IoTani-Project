"use client";

import React, { useRef, useState, useEffect } from "react";

import { motion } from "framer-motion";

import Image from "next/legacy/image";

import {
  LuMail,
  LuPhone,
  LuMapPin,
  LuSave,
  LuX,
  LuTrash2,
  LuUser,
} from "react-icons/lu";
import { FaInstagram } from "react-icons/fa";

import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import ConfirmationModal from "@/components/ConfirmationModal/page";
import { BiEdit } from "react-icons/bi";

const defaultProfile = {
  phone: "",
  location: "",
  bio: "",
  avatarUrl: "", // Empty means use default initials
  instagram: "",
};

const inputStyle =
  "w-full p-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all bg-white text-neutral-800";

// Generate initials from name
const getInitials = (name: string | null | undefined): string => {
  if (!name) return "U";
  const words = name.trim().split(/\s+/);
  if (words.length === 0) return "U";

  // Get first letter of first word
  const firstInitial = words[0][0]?.toUpperCase() || "U";

  // If only one word, return first letter
  if (words.length === 1) {
    return firstInitial;
  }

  // Get first letter of second word
  const secondInitial = words[1][0]?.toUpperCase() || "";
  return firstInitial + secondInitial;
};

// Generate color based on name (consistent color for same name)
const getAvatarColor = (name: string | null | undefined): string => {
  if (!name) return "from-green-500 to-emerald-600";

  const colors = [
    "from-green-500 to-emerald-600",
    "from-blue-500 to-cyan-600",
    "from-purple-500 to-pink-600",
    "from-orange-500 to-red-600",
    "from-indigo-500 to-blue-600",
    "from-teal-500 to-green-600",
    "from-rose-500 to-pink-600",
    "from-amber-500 to-orange-600",
  ];

  // Simple hash function to get consistent color
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

interface ExtendedSession {
  user: {
    fullName?: string;
    email?: string;
    role?: string;
    status?: string | null;
  };
}

const ProfilePage = () => {
  const [profileData, setProfileData] = useState(defaultProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(defaultProfile);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [imageError, setImageError] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const onPick = () => fileRef.current?.click();
  const { data: session } = useSession();
  const sessionUser = session?.user as ExtendedSession | undefined;

  // Fetch profile data on mount
  useEffect(() => {
    const fetchProfile = async () => {
      if (!session?.user?.email) {
        setIsFetching(false);
        return;
      }

      try {
        const res = await fetch(
          `/api/profile?email=${encodeURIComponent(session.user.email)}`
        );
        const data = await res.json();

        if (res.ok && data.status && data.data) {
          // Normalize avatarUrl - fix old path to new path
          let avatarUrl = data.data.avatarUrl || "/icon/people.png";
          if (avatarUrl === "/icons/people.png") {
            avatarUrl = "/icon/people.png";
          }

          const profile = {
            ...defaultProfile,
            ...data.data,
            avatarUrl: avatarUrl,
          };
          setProfileData(profile);
          setFormData(profile);
          setImageError(false); // Reset error state
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Gagal memuat data profile");
      } finally {
        setIsFetching(false);
      }
    };

    fetchProfile();
  }, [session?.user?.email]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("File harus berupa gambar");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Ukuran file maksimal 5MB");
      return;
    }

    setSelectedFile(file);
    setUploadPreview(URL.createObjectURL(file));
    setImageError(false); // Reset error state when new file selected
  };

  const handleEditClick = () => {
    setFormData(profileData);
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setFormData(profileData);
    setUploadPreview(null);
    setSelectedFile(null);
    setImageError(false);
    setIsEditing(false);
  };

  const handleDeletePhotoClick = () => {
    if (!session?.user?.email) {
      toast.error("Session tidak valid");
      return;
    }

    // Check if there's a photo to delete
    const currentAvatar = uploadPreview || formData.avatarUrl;
    if (!currentAvatar || !currentAvatar.startsWith("/profiles/")) {
      toast.info("Tidak ada foto untuk dihapus");
      return;
    }

    setShowDeleteConfirm(true);
  };

  const handleDeletePhoto = async () => {
    if (!session?.user?.email) {
      toast.error("Session tidak valid");
      return;
    }

    const currentAvatar = uploadPreview || formData.avatarUrl;
    setIsLoading(true);
    setShowDeleteConfirm(false);
    try {
      // Delete image file
      const deleteRes = await fetch(
        `/api/profile/delete-image?avatarUrl=${encodeURIComponent(
          currentAvatar
        )}`,
        {
          method: "DELETE",
        }
      );

      const deleteData = await deleteRes.json();
      if (!deleteRes.ok || !deleteData.status) {
        console.warn("Warning deleting image:", deleteData.message);
        // Continue even if file deletion fails
      }

      // Update profile - remove avatarUrl to use default initials
      const updateRes = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: session.user.email || "",
          phone: formData.phone || "",
          location: formData.location || "",
          bio: formData.bio || "",
          instagram: formData.instagram || "",
          avatarUrl: "", // Empty string means use default initials
        }),
      });

      const updateData = await updateRes.json();
      if (updateRes.ok && updateData.status) {
        const updatedProfile = {
          ...formData,
          avatarUrl: "", // Empty means use default initials
        };
        setProfileData(updatedProfile);
        setFormData(updatedProfile);
        setUploadPreview(null);
        setSelectedFile(null);
        toast.success("Foto berhasil dihapus");
      } else {
        throw new Error(updateData.message || "Gagal menghapus foto");
      }
    } catch (error) {
      console.error("Error deleting photo:", error);
      toast.error(
        error instanceof Error ? error.message : "Gagal menghapus foto"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveClick = async () => {
    if (!session?.user?.email) {
      toast.error("Session tidak valid");
      return;
    }

    setIsLoading(true);
    try {
      let avatarUrl = formData.avatarUrl;

      // Upload image if new file selected
      if (selectedFile) {
        // Delete old image if exists
        const oldAvatar = profileData.avatarUrl;
        if (oldAvatar && oldAvatar.startsWith("/profiles/")) {
          try {
            await fetch(
              `/api/profile/delete-image?avatarUrl=${encodeURIComponent(
                oldAvatar
              )}`,
              { method: "DELETE" }
            );
          } catch (error) {
            // Ignore deletion errors
            console.warn("Error deleting old image:", error);
          }
        }

        const uploadFormData = new FormData();
        uploadFormData.append("file", selectedFile);
        uploadFormData.append("userId", session.user.email);

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
          email: session.user.email,
          phone: formData.phone,
          location: formData.location,
          bio: formData.bio,
          instagram: formData.instagram,
          avatarUrl: avatarUrl,
        }),
      });

      const updateData = await updateRes.json();
      if (updateRes.ok && updateData.status) {
        const updatedProfile = {
          ...formData,
          avatarUrl: avatarUrl,
        };
        setProfileData(updatedProfile);
        setUploadPreview(null);
        setSelectedFile(null);
        setImageError(false);
        setIsEditing(false);
        toast.success("Profile berhasil diperbarui");
      } else {
        throw new Error(updateData.message || "Gagal memperbarui profile");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error(
        error instanceof Error ? error.message : "Gagal menyimpan profile"
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <section className="min-h-screen bg-linear-to-r from-neutral-50 to-neutral-100 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="flex h-96 items-center justify-center">
            <p className="text-neutral-600">Memuat data profile...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <ConfirmationModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeletePhoto}
        title="Hapus Foto Profile"
      >
        <div className="space-y-2">
          <p className="text-neutral-700">
            Apakah Anda yakin ingin menghapus foto profile ini?
          </p>
          <p className="text-sm text-neutral-500">
            Foto akan dihapus secara permanen dan tidak dapat dikembalikan.
            Profile akan kembali menggunakan foto default.
          </p>
        </div>
      </ConfirmationModal>

      <section className="min-h-screen bg-linear-to-br from-green-50 via-neutral-50 to-green-50 py-6 sm:py-8 md:py-12 pt-20 md:pt-6">
        <div className="container mx-auto px-4 sm:px-6">
          {/* Header Section with Gradient */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 sm:mb-8"
          >
            <h1 className="text-3xl sm:text-4xl font-bold text-neutral-800 md:text-5xl text-center md:text-left">
              Profile Saya
            </h1>
            <p className="mt-2 text-sm sm:text-base text-neutral-600 text-center md:text-left">
              Kelola informasi dan data diri Anda
            </p>
          </motion.div>

          <div className="mx-auto max-w-5xl space-y-6">
            {/* Profile Header Card */}
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
                      onClick={handleSaveClick}
                      disabled={isLoading}
                      className="inline-flex items-center cursor-pointer rounded-full bg-green-500 p-3 text-white transition-colors hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      whileHover={{ scale: isLoading ? 1 : 1.1 }}
                      whileTap={{ scale: isLoading ? 1 : 0.9 }}
                      aria-label="Simpan Profil"
                    >
                      <LuSave size={20} />
                    </motion.button>

                    <motion.button
                      onClick={handleCancelClick}
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
                    onClick={handleEditClick}
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
                      {(() => {
                        const avatarSrc =
                          uploadPreview || profileData.avatarUrl;
                        const hasCustomAvatar =
                          avatarSrc &&
                          avatarSrc.startsWith("/profiles/") &&
                          !imageError;
                        const fullName = sessionUser?.user.fullName || "";
                        const initials = getInitials(fullName);
                        const color = getAvatarColor(fullName);

                        if (hasCustomAvatar) {
                          // Use Next.js Image for uploaded photos
                          return (
                            <>
                              <Image
                                src={avatarSrc}
                                alt="Profile"
                                width={160}
                                height={160}
                                className="h-full w-full object-cover"
                                objectFit="cover"
                                onError={() => {
                                  // If image fails, show initials instead
                                  setImageError(true);
                                }}
                              />
                              {imageError && (
                                <div
                                  className={`absolute inset-0 flex items-center justify-center bg-linear-to-br ${color} text-white text-5xl font-bold`}
                                >
                                  {initials}
                                </div>
                              )}
                            </>
                          );
                        } else {
                          // Show initials for default avatar
                          return (
                            <div
                              className={`h-full w-full flex items-center justify-center bg-linear-to-br ${color} text-white text-5xl font-bold`}
                            >
                              {initials}
                            </div>
                          );
                        }
                      })()}
                      {isEditing && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity hover:opacity-100">
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
                      const hasUploadedPhoto =
                        currentAvatar && currentAvatar.startsWith("/profiles/");
                      return hasUploadedPhoto ? (
                        <motion.button
                          onClick={handleDeletePhotoClick}
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
                    onChange={handleFileChange}
                  />
                )}

                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={sessionUser?.user.fullName || ""}
                    onChange={handleInputChange}
                    className="mb-2 text-center text-2xl sm:text-3xl font-bold text-white focus:outline-none focus:ring-2 focus:ring-white/50 rounded-lg px-4 py-2 bg-white/20 backdrop-blur-sm md:text-4xl"
                    placeholder="Nama Lengkap"
                  />
                ) : (
                  <h2 className="mb-2 text-2xl sm:text-3xl font-bold text-white md:text-4xl">
                    {sessionUser?.user.fullName || "Pengguna"}
                  </h2>
                )}

                {isEditing ? (
                  <input
                    type="text"
                    name="role"
                    value={sessionUser?.user.role || ""}
                    onChange={handleInputChange}
                    className="text-center text-lg font-medium text-green-100 focus:outline-none focus:ring-2 focus:ring-white/50 rounded-lg px-3 py-1 bg-white/20 backdrop-blur-sm"
                    placeholder="Role"
                  />
                ) : (
                  <p className="text-lg font-medium text-green-100">
                    {sessionUser?.user.role || "User"}
                  </p>
                )}
              </div>
            </motion.div>

            {/* About Me Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl bg-white p-4 sm:p-6 shadow-xl md:p-8"
            >
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-lg bg-green-100 p-2">
                  <LuUser className="text-green-600" size={24} />
                </div>
                <h2 className="text-2xl font-bold text-neutral-800">
                  Tentang Saya
                </h2>
              </div>

              {isEditing ? (
                <textarea
                  name="bio"
                  rows={6}
                  value={formData.bio}
                  onChange={handleInputChange}
                  className={inputStyle}
                  placeholder="Ceritakan tentang diri Anda..."
                />
              ) : (
                <p className="text-base leading-relaxed text-neutral-700 whitespace-pre-wrap">
                  {profileData.bio ||
                    "Belum ada informasi tentang diri Anda. Klik tombol Edit untuk menambahkan."}
                </p>
              )}
            </motion.div>

            {/* Contact Information Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-2xl bg-white p-4 sm:p-6 shadow-xl md:p-8"
            >
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-lg bg-green-100 p-2">
                  <LuMail className="text-green-600" size={24} />
                </div>
                <h2 className="text-2xl font-bold text-neutral-800">
                  Informasi Kontak
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* Email */}
                <div className="group rounded-xl border border-neutral-200 bg-neutral-50 p-4 transition-all hover:border-green-300 hover:bg-green-50/50">
                  <div className="mb-2 flex items-center gap-2">
                    <LuMail className="h-5 w-5 text-green-600" />
                    <span className="text-sm font-medium text-neutral-600">
                      Email
                    </span>
                  </div>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={session?.user?.email || ""}
                      onChange={handleInputChange}
                      className="w-full bg-transparent text-base font-medium text-neutral-800 focus:outline-none"
                      readOnly
                    />
                  ) : (
                    <p className="text-base font-medium text-neutral-800 break-all">
                      {session?.user?.email || "-"}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div className="group rounded-xl border border-neutral-200 bg-neutral-50 p-4 transition-all hover:border-green-300 hover:bg-green-50/50">
                  <div className="mb-2 flex items-center gap-2">
                    <LuPhone className="h-5 w-5 text-green-600" />
                    <span className="text-sm font-medium text-neutral-600">
                      Telepon
                    </span>
                  </div>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full bg-transparent text-base font-medium text-neutral-800 focus:outline-none focus:ring-2 focus:ring-green-500 rounded px-2 py-1"
                      placeholder="+62 812 3456 7890"
                    />
                  ) : (
                    <p className="text-base font-medium text-neutral-800">
                      {profileData.phone || "-"}
                    </p>
                  )}
                </div>

                {/* Location */}
                <div className="group rounded-xl border border-neutral-200 bg-neutral-50 p-4 transition-all hover:border-green-300 hover:bg-green-50/50">
                  <div className="mb-2 flex items-center gap-2">
                    <LuMapPin className="h-5 w-5 text-green-600" />
                    <span className="text-sm font-medium text-neutral-600">
                      Lokasi
                    </span>
                  </div>
                  {isEditing ? (
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full bg-transparent text-base font-medium text-neutral-800 focus:outline-none focus:ring-2 focus:ring-green-500 rounded px-2 py-1"
                      placeholder="Kota, Provinsi"
                    />
                  ) : (
                    <p className="text-base font-medium text-neutral-800">
                      {profileData.location || "-"}
                    </p>
                  )}
                </div>

                {/* Instagram */}
                <div className="group rounded-xl border border-neutral-200 bg-neutral-50 p-4 transition-all hover:border-green-300 hover:bg-green-50/50">
                  <div className="mb-2 flex items-center gap-2">
                    <FaInstagram className="h-5 w-5 text-green-600" />
                    <span className="text-sm font-medium text-neutral-600">
                      Instagram
                    </span>
                  </div>
                  {isEditing ? (
                    <input
                      type="text"
                      name="instagram"
                      value={formData.instagram}
                      onChange={handleInputChange}
                      className="w-full bg-transparent text-base font-medium text-neutral-800 focus:outline-none focus:ring-2 focus:ring-green-500 rounded px-2 py-1"
                      placeholder="@username"
                    />
                  ) : (
                    <p className="text-base font-medium text-neutral-800">
                      {profileData.instagram ? (
                        <a
                          href={`https://instagram.com/${profileData.instagram.replace(
                            "@",
                            ""
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-600 hover:text-green-700 hover:underline"
                        >
                          {profileData.instagram}
                        </a>
                      ) : (
                        "-"
                      )}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ProfilePage;
