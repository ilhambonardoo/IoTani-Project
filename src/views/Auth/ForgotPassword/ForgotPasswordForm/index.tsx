"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FormEvent, useRef } from "react";
import { IoPlayBack } from "react-icons/io5";

interface ForgotPasswordFormProps {
  isLoading: boolean;
  error: string;
  success: string;
  onSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void>;
}

const ForgotPasswordForm = ({
  isLoading,
  error,
  success,
  onSubmit,
}: ForgotPasswordFormProps) => {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <div className="flex w-full items-center justify-center p-4 sm:p-6 lg:w-1/2 lg:p-10">
      <motion.div
        className="relative w-full max-w-md flex flex-col"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <Link
          href="/login"
          className="cursor-pointer mb-6 flex items-center gap-2 text-neutral-600 transition-colors hover:text-green-600"
          aria-label="Kembali ke login"
        >
          <IoPlayBack size={20} />
          <span>Kembali ke Login</span>
        </Link>

        <div className="flex justify-center mb-4 md:hidden">
          <Link
            href="/"
            className="cursor-pointer text-4xl font-bold text-green-600 transition-opacity hover:opacity-80"
          >
            IoTani<span className="text-green-400">.</span>
          </Link>
        </div>

        <h2 className="mb-2 text-center text-3xl font-bold text-neutral-800 md:text-left">
          Lupa Password?
        </h2>
        <p className="mb-6 text-sm text-neutral-600 md:text-base">
          Masukkan email Anda dan kami akan mengirim link untuk mereset password
          Anda.
        </p>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 rounded-lg bg-red-50 border border-red-200 p-3 text-center text-red-700"
          >
            {error}
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 rounded-lg bg-green-50 border border-green-200 p-3 text-center text-green-700"
          >
            {success}
          </motion.div>
        )}

        <form ref={formRef} method="POST" onSubmit={onSubmit}>
          <div className="mb-4">
            <label className="mb-2 block font-medium text-neutral-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="Masukkan email Anda"
              required
              disabled={isLoading || !!success}
              className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-3 text-base text-neutral-800 placeholder-neutral-400 transition-colors focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 disabled:bg-neutral-100 disabled:cursor-not-allowed"
            />
          </div>

          <motion.button
            type="submit"
            disabled={isLoading || !!success}
            className="mt-4 w-full rounded-lg bg-gradient-to-r from-green-500 to-green-600 py-3 text-base font-semibold text-white shadow-lg shadow-green-500/30 transition-all duration-300 hover:from-green-600 hover:to-green-700 hover:shadow-xl hover:shadow-green-500/40 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
            whileHover={{ scale: isLoading || !!success ? 1 : 1.02 }}
            whileTap={{ scale: isLoading || !!success ? 1 : 0.98 }}
          >
            {isLoading
              ? "Mengirim..."
              : success
              ? "Email Terkirim!"
              : "Kirim Link Reset Password"}
          </motion.button>
        </form>

        <div className="mt-6 text-center text-base text-neutral-600">
          Ingat password Anda?{" "}
          <Link
            className="cursor-pointer font-medium text-green-600 transition-colors hover:text-green-700 hover:underline"
            href="/login"
          >
            Kembali ke Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordForm;

