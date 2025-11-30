"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ConfirmationModal from "@/components/ui/ConfirmationModal/page";
import { useAuth, useProfile, useProfileUpdate, useFileUpload } from "@/hooks";
import ProfileHeader from "./ProfileHeader";
import ProfileAbout from "./ProfileAbout";
import ProfileContact from "./ProfileContact";
import { hasCustomAvatar } from "../../../lib/utils/profile-avatar";

const defaultProfile = {
  phone: "",
  location: "",
  bio: "",
  avatarUrl: "",
  instagram: "",
};

const ProfilePage = () => {
  const { user, fullName: authFullName } = useAuth();
  const { profile, isLoading: isFetching, refetch } = useProfile();
  const {
    isLoading: isUpdating,
    updateProfile,
    deletePhoto,
  } = useProfileUpdate();

  const { uploadPreview, selectedFile, handleFileChange, clearFile } =
    useFileUpload({
      maxSize: 5 * 1024 * 1024,
      allowedTypes: ["image/"],
    });

  const [profileData, setProfileData] = useState(defaultProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(defaultProfile);
  const [fullName, setFullName] = useState<string>("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (profile) {
      let avatarUrl = profile.avatarUrl || "/icon/people.png";
      if (avatarUrl === "/icons/people.png") {
        avatarUrl = "/icon/people.png";
      }

      const profileDataWithDefaults = {
        ...defaultProfile,
        ...profile,
        avatarUrl: avatarUrl,
      };
      setProfileData(profileDataWithDefaults);
      setFormData(profileDataWithDefaults);
      setFullName(profile.fullName || authFullName || "");
      setImageError(false);
    } else if (!isFetching) {
      setFullName(authFullName || "");
    }
  }, [profile, isFetching, authFullName]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditClick = () => {
    setFormData(profileData);
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setFormData(profileData);
    clearFile();
    setImageError(false);
    setIsEditing(false);
  };

  const handleDeletePhotoClick = () => {
    if (!user?.email) {
      toast.error("Session tidak valid");
      return;
    }

    const currentAvatar = uploadPreview || formData.avatarUrl;
    if (!currentAvatar || !hasCustomAvatar(currentAvatar)) {
      toast.info("Tidak ada foto untuk dihapus");
      return;
    }

    setShowDeleteConfirm(true);
  };

  const handleDeletePhoto = async () => {
    if (!user?.email) return;

    const currentAvatar = uploadPreview || formData.avatarUrl;
    setShowDeleteConfirm(false);

    const success = await deletePhoto(user.email, currentAvatar, formData);

    if (success) {
      const updatedProfile = {
        ...formData,
        avatarUrl: "",
      };
      setProfileData(updatedProfile);
      setFormData(updatedProfile);
      clearFile();
      refetch();
    }
  };

  const handleSaveClick = async () => {
    if (!user?.email) {
      toast.error("Session tidak valid");
      return;
    }

    const result = await updateProfile(
      user.email,
      fullName,
      formData,
      selectedFile || null,
      profileData.avatarUrl
    );

    if (result.success) {
      const updatedProfile = {
        ...formData,
        avatarUrl: result.avatarUrl || formData.avatarUrl,
      };
      setProfileData(updatedProfile);
      clearFile();
      setImageError(false);
      setIsEditing(false);
      refetch();
    }
  };

  if (isFetching) {
    return (
      <section className="min-h-screen bg-linear-to-r from-neutral-50 to-neutral-100 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="flex h-96 items-center justify-center">
            <p className="text-neutral-600">Memuat data profil...</p>
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
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 sm:mb-8"
          >
            <h1 className="text-3xl sm:text-4xl font-bold text-neutral-800 md:text-5xl text-center md:text-left">
              Profil Saya
            </h1>
            <p className="mt-2 text-sm sm:text-base text-neutral-600 text-center md:text-left">
              Kelola informasi dan data diri Anda
            </p>
          </motion.div>

          <div className="mx-auto max-w-5xl space-y-6">
            {/* Profile Header Card */}
            <ProfileHeader
              user={user || null}
              fullName={fullName}
              profileData={profileData}
              formData={formData}
              uploadPreview={uploadPreview}
              isEditing={isEditing}
              isLoading={isUpdating}
              imageError={imageError}
              onEditClick={handleEditClick}
              onSaveClick={handleSaveClick}
              onCancelClick={handleCancelClick}
              onFileChange={handleFileChange}
              onDeletePhotoClick={handleDeletePhotoClick}
              setImageError={setImageError}
            />

            {/* About Me Card */}
            <ProfileAbout
              bio={isEditing ? formData.bio : profileData.bio}
              isEditing={isEditing}
              onInputChange={handleInputChange}
            />

            {/* Contact Information Card */}
            <ProfileContact
              email={user?.email}
              phone={isEditing ? formData.phone : profileData.phone}
              location={isEditing ? formData.location : profileData.location}
              instagram={isEditing ? formData.instagram : profileData.instagram}
              isEditing={isEditing}
              onInputChange={handleInputChange}
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default ProfilePage;
