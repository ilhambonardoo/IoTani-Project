"use client";

import { motion } from "framer-motion";
import { FiPlus, FiSearch } from "react-icons/fi";
import { MdAdminPanelSettings } from "react-icons/md";

interface UserManagementHeaderProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onAddClick: () => void;
}

const UserManagementHeader = ({
  searchTerm,
  onSearchChange,
  onAddClick,
}: UserManagementHeaderProps) => {
  return (
    <div className="mb-6 sm:mb-8 flex flex-col items-center justify-between gap-4 md:flex-row pt-16 md:pt-0">
      <div className="w-full md:w-auto">
        <h1 className="flex flex-col sm:flex-row items-center justify-center md:justify-start text-2xl sm:text-3xl font-bold text-neutral-800 lg:text-4xl">
          <span className="flex items-center">
            <MdAdminPanelSettings className="mr-3 text-green-600 w-8 h-8" />
            Manajemen Pengguna
          </span>
        </h1>
        <p className="mt-2 text-sm sm:text-base text-neutral-600 text-center md:text-left">
          Kelola pengguna dan peran akses sistem
        </p>
      </div>
      <div className="flex w-full flex-col sm:flex-row gap-2 md:w-auto">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Cari pengguna..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-2 sm:py-3 pl-10 text-sm sm:text-base text-neutral-800 placeholder-neutral-400 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/50"
          />
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
        </div>
        <motion.button
          onClick={onAddClick}
          className="flex items-center cursor-pointer justify-center gap-2 rounded-lg bg-green-500 px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-semibold text-white shadow-lg transition-all hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 whitespace-nowrap"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FiPlus size={18} />
          <span className="hidden sm:inline">Tambah Pengguna</span>
          <span className="sm:hidden">Tambah</span>
        </motion.button>
      </div>
    </div>
  );
};

export default UserManagementHeader;







