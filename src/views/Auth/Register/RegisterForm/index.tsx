"use client";

import { motion } from "framer-motion";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { FormEvent } from "react";
import { FcGoogle } from "react-icons/fc";
import { IoPlayBack } from "react-icons/io5";

interface RegisterFormProps {
  isLoading: boolean;
  error: string;
  success: string;
  callbackUrl: string;
  onSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void>;
}

const RegisterForm = ({
  isLoading,
  error,
  success,
  callbackUrl,
  onSubmit,
}: RegisterFormProps) => {
  return (
    <div className="flex w-full items-center justify-center p-4 sm:p-6 lg:w-1/2 lg:p-10">
      <motion.div
        className="relative w-full max-w-md flex flex-col"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <button
          onClick={() => signIn()}
          className="mb-6 flex items-center cursor-pointer gap-2 text-neutral-600 transition-colors hover:text-green-600"
          aria-label="Kembali ke login"
        >
          <IoPlayBack size={20} />
          <span>Kembali</span>
        </button>

        <div className="flex justify-center mb-4 md:hidden">
          <Link
            href="/"
            className="cursor-pointer text-4xl font-bold text-green-600 transition-opacity hover:opacity-80"
          >
            IoTani<span className="text-green-400">.</span>
          </Link>
        </div>

        <h2 className="mb-6 text-center text-3xl font-bold text-neutral-800 md:text-left">
          Daftar Akun Baru
        </h2>

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 rounded-lg bg-green-50 border border-green-200 p-3 text-center text-green-700"
          >
            {success}
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 rounded-lg bg-red-50 border border-red-200 p-3 text-center text-red-700"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={onSubmit} method="POST">
          <div className="mb-4">
            <label className="mb-2 block font-medium text-neutral-700">
              Nama Lengkap
            </label>
            <input
              id="name"
              type="text"
              name="name"
              placeholder="Masukkan nama lengkap"
              required
              className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-3 text-base text-neutral-800 placeholder-neutral-400 transition-colors focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/50"
            />
          </div>
          <div className="mb-4">
            <label className="mb-2 block font-medium text-neutral-700">
              Username
            </label>
            <input
              id="username"
              type="text"
              name="username"
              placeholder="Masukkan username unik"
              required
              className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-3 text-base text-neutral-800 placeholder-neutral-400 transition-colors focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/50"
            />
          </div>
          <div className="mb-4">
            <label className="mb-2 block font-medium text-neutral-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="Masukkan email"
              required
              className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-3 text-base text-neutral-800 placeholder-neutral-400 transition-colors focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/50"
            />
          </div>
          <div className="mb-4">
            <label className="mb-2 block font-medium text-neutral-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="Minimal 6 karakter"
              required
              minLength={6}
              className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-3 text-base text-neutral-800 placeholder-neutral-400 transition-colors focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/50"
            />
          </div>
          <motion.button
            type="submit"
            disabled={isLoading}
            className="mt-4 w-full rounded-lg bg-gradient-to-r from-green-500 to-green-600 py-3 text-base font-semibold text-white shadow-lg shadow-green-500/30 transition-all duration-300 hover:from-green-600 hover:to-green-700 hover:shadow-xl hover:shadow-green-500/40 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
            whileHover={{ scale: isLoading ? 1 : 1.02 }}
            whileTap={{ scale: isLoading ? 1 : 0.98 }}
          >
            {isLoading ? "Mendaftarkan..." : "Daftar"}
          </motion.button>
        </form>
        <motion.button
          type="button"
          onClick={() => {
            signIn("google", { callbackUrl: callbackUrl });
          }}
          disabled={isLoading}
          className="mt-4 flex w-full items-center justify-center gap-3 rounded-lg border border-neutral-300 bg-white py-3 text-base font-semibold text-neutral-700 shadow transition-all hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
          whileHover={{ scale: isLoading ? 1 : 1.02 }}
          whileTap={{ scale: isLoading ? 1 : 0.98 }}
        >
          <FcGoogle size={25} />
          <span>Daftar dengan Google</span>
        </motion.button>
        <div className="mt-6 text-center text-base text-neutral-600">
          Sudah punya akun?{" "}
          <button
            onClick={() => signIn()}
            className="cursor-pointer font-medium text-green-600 transition-colors hover:text-green-700 hover:underline"
          >
            Login
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterForm;

