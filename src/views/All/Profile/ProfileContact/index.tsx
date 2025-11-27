"use client";

import { motion } from "framer-motion";
import { LuMail, LuPhone, LuMapPin } from "react-icons/lu";
import { FaInstagram } from "react-icons/fa";

interface ProfileContactProps {
  email: string | null | undefined;
  phone: string;
  location: string;
  instagram: string;
  isEditing: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ProfileContact({
  email,
  phone,
  location,
  instagram,
  isEditing,
  onInputChange,
}: ProfileContactProps) {
  return (
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
            <span className="text-sm font-medium text-neutral-600">Email</span>
          </div>
          {isEditing ? (
            <input
              type="email"
              name="email"
              value={email || ""}
              onChange={onInputChange}
              className="w-full bg-transparent text-base font-medium text-neutral-800 focus:outline-none"
              readOnly
            />
          ) : (
            <p className="text-base font-medium text-neutral-800 break-all">
              {email || "-"}
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
              value={phone}
              onChange={onInputChange}
              className="w-full bg-transparent text-base font-medium text-neutral-800 focus:outline-none focus:ring-2 focus:ring-green-500 rounded px-2 py-1"
              placeholder="+62 812 3456 7890"
            />
          ) : (
            <p className="text-base font-medium text-neutral-800">
              {phone || "-"}
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
              value={location}
              onChange={onInputChange}
              className="w-full bg-transparent text-base font-medium text-neutral-800 focus:outline-none focus:ring-2 focus:ring-green-500 rounded px-2 py-1"
              placeholder="Kota, Provinsi"
            />
          ) : (
            <p className="text-base font-medium text-neutral-800">
              {location || "-"}
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
              value={instagram}
              onChange={onInputChange}
              className="w-full bg-transparent text-base font-medium text-neutral-800 focus:outline-none focus:ring-2 focus:ring-green-500 rounded px-2 py-1"
              placeholder="@username"
            />
          ) : (
            <p className="text-base font-medium text-neutral-800">
              {instagram ? (
                <a
                  href={`https://instagram.com/${instagram.replace("@", "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600 hover:text-green-700 hover:underline"
                >
                  {instagram}
                </a>
              ) : (
                "-"
              )}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

