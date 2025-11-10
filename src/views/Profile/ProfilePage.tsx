"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/legacy/image";
import {
  LuMail,
  LuPhone,
  LuMapPin,
  LuBadge,
  LuSave,
  LuX,
} from "react-icons/lu";

const userProfile = {
  name: "Budi Santoso",
  role: "Petani Cerdas",
  email: "budi.santoso@iotani.com",
  phone: "+62 812 3456 7890",
  location: "Bogor, Jawa Barat",
  bio: "Petani cabai dengan pengalaman 10 tahun, kini beralih ke pertanian cerdas dengan iOTani untuk meningkatkan hasil dan efisiensi lahan saya.",
  avatarUrl: "/gambar_tambahan/petani.jpg",
  stats: {
    lands: 5,
    sensors: 32,
    yieldIncrease: "12%",
  },
};

const inputStyle =
  "w-full p-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all bg-white text-neutral-800";
const inlineInputStyle =
  "w-full text-base text-neutral-800 border-b-2 border-green-300 focus:outline-none focus:border-green-500";

const ProfilePage = () => {
  const [profileData, setProfileData] = useState(userProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(userProfile);

  const handleInputChange = (e: any) => {
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
    setIsEditing(false);
  };

  const handleSaveClick = () => {
    setProfileData(formData);
    setIsEditing(false);
  };

  return (
    <section className="min-h-screen bg-linear-to-r from-neutral-50 to-neutral-100 py-16 md:py-24">
      <motion.div
        className="container mx-auto px-4"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl bg-white p-8 shadow-2xl md:p-12">
          {/* --- Tombol Edit / Simpan / Batal --- */}
          <div className="absolute top-6 right-6 flex gap-2">
            {isEditing ? (
              <>
                <motion.button
                  onClick={handleSaveClick}
                  className="inline-flex items-center rounded-full bg-green-500 p-3 text-white transition-colors hover:bg-green-600"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Simpan Profil"
                >
                  <LuSave size={20} />
                </motion.button>
                <motion.button
                  onClick={handleCancelClick}
                  className="inline-flex items-center rounded-full bg-gray-200 p-3 text-gray-700 transition-colors hover:bg-gray-300"
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
                className="inline-flex items-center rounded-full bg-green-100 p-3 text-green-800 transition-colors hover:bg-green-200"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Edit Profil"
              >
                <LuBadge size={20} />
              </motion.button>
            )}
          </div>

          <div className="flex flex-col items-center text-center">
            <motion.div>
              <Image
                src={profileData.avatarUrl}
                alt={profileData.name}
                width={128}
                height={128}
                className="rounded-full ring-4 ring-green-500 ring-offset-4 ring-offset-white"
                objectFit="cover"
              />
            </motion.div>

            {isEditing ? (
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="mt-6 text-center text-3xl font-extrabold text-neutral-800 focus:outline-none md:text-4xl"
              />
            ) : (
              <h1 className="mt-6 text-3xl font-extrabold text-neutral-800 md:text-4xl">
                {profileData.name}
              </h1>
            )}

            {isEditing ? (
              <input
                type="text"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="mt-2 text-center text-xl font-medium text-green-700 focus:outline-none"
              />
            ) : (
              <p className="mt-2 text-xl font-medium text-green-700">
                {profileData.role}
              </p>
            )}
          </div>

          <hr className="my-8 border-gray-200" />

          <div className="grid grid-cols-1 gap-8 md:grid-cols-5">
            <div className="md:col-span-3">
              <h2 className="mb-4 text-2xl font-bold text-neutral-800">
                Tentang Saya
              </h2>
              {isEditing ? (
                <textarea
                  name="bio"
                  rows={5}
                  value={formData.bio}
                  onChange={handleInputChange}
                  className={inputStyle}
                />
              ) : (
                <p className="text-base leading-relaxed text-gray-700">
                  {profileData.bio}
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <h2 className="mb-4 text-2xl font-bold text-neutral-800">
                Informasi
              </h2>
              <ul className="space-y-4">
                <li className="flex items-center">
                  <LuMail className="mr-3 h-5 w-5 shrink-0 text-green-600" />
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={inlineInputStyle}
                    />
                  ) : (
                    <span className="text-gray-700">{profileData.email}</span>
                  )}
                </li>
                <li className="flex items-center">
                  <LuPhone className="mr-3 h-5 w-5 shrink-0 text-green-600" />
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={inlineInputStyle}
                    />
                  ) : (
                    <span className="text-gray-700">{profileData.phone}</span>
                  )}
                </li>
                {/* Lokasi */}
                <li className="flex items-center">
                  <LuMapPin className="mr-3 h-5 w-5 shrink-0 text-green-600" />
                  {isEditing ? (
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className={inlineInputStyle}
                    />
                  ) : (
                    <span className="text-gray-700">
                      {profileData.location}
                    </span>
                  )}
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-10">
            <h2 className="mb-4 text-center text-2xl font-bold text-lime-800">
              Statistik IoTani
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-xl bg-green-50 p-4 text-center shadow-md">
                <span className="block text-3xl font-bold text-green-700">
                  {profileData.stats.lands}
                </span>
                <span className="text-sm font-medium text-gray-600">
                  Lahan Terdaftar
                </span>
              </div>
              <div className="rounded-xl bg-green-50 p-4 text-center shadow-md">
                <span className="block text-3xl font-bold text-green-700">
                  {profileData.stats.sensors}
                </span>
                <span className="text-sm font-medium text-gray-600">
                  Sensor Aktif
                </span>
              </div>
              <div className="rounded-xl bg-green-50 p-4 text-center shadow-md">
                <span className="block text-3xl font-bold text-green-700">
                  {profileData.stats.yieldIncrease}
                </span>
                <span className="text-sm font-medium text-gray-600">
                  Peningkatan Hasil
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default ProfilePage;
