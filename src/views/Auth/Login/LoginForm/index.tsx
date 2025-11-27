"use client";

import { motion } from "framer-motion";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { FormEvent } from "react";
import { FcGoogle } from "react-icons/fc";
import { IoPlayBack } from "react-icons/io5";

interface LoginFormProps {
  role: string;
  isLoading: boolean;
  error: string;
  callbackUrl: string;
  onRoleChange: (role: string) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void>;
}

const LoginForm = ({
  role,
  isLoading,
  error,
  callbackUrl,
  onRoleChange,
  onSubmit,
}: LoginFormProps) => {
  return (
    <div className="flex w-full items-center justify-center p-4 sm:p-6 lg:w-1/2 lg:p-10">
      <motion.div
        className="relative w-full max-w-md flex flex-col"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <Link
          href="/"
          className="cursor-pointer mb-6 flex items-center gap-2 text-neutral-600 transition-colors hover:text-green-600"
          aria-label="Kembali ke beranda"
        >
          <IoPlayBack size={20} />
          <span>Kembali</span>
        </Link>

        <div className="flex justify-center mb-4 md:hidden">
          <Link
            href="/"
            className="cursor-pointer text-4xl font-bold text-green-600 transition-opacity hover:opacity-80"
          >
            IoTani<span className="text-green-400">.</span>
          </Link>
        </div>

        <h2 className="mb-6 text-center text-3xl font-bold text-neutral-800 md:text-left">
          Login Akun
        </h2>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 rounded-lg bg-red-50 border border-red-200 p-3 text-center text-red-700"
          >
            {error}
          </motion.div>
        )}

        <div className="mb-4 flex rounded-lg bg-neutral-200 p-1">
          <button
            type="button"
            onClick={() => onRoleChange("user")}
            suppressHydrationWarning
            className={`w-1/3 cursor-pointer hover:bg-neutral-300 rounded-md px-3 py-2 text-sm font-medium transition-all ${
              role === "user"
                ? "bg-white text-green-600 shadow"
                : "text-neutral-600"
            }`}
          >
            User
          </button>
          <button
            type="button"
            onClick={() => onRoleChange("admin")}
            suppressHydrationWarning
            className={`w-1/3 hover:bg-neutral-300 rounded-md cursor-pointer px-3 py-2 text-sm font-medium transition-all ${
              role === "admin"
                ? "bg-white text-green-600 shadow"
                : "text-neutral-600"
            }`}
          >
            Admin
          </button>
          <button
            type="button"
            onClick={() => onRoleChange("owner")}
            suppressHydrationWarning
            className={`w-1/3 rounded-md hover:bg-neutral-300 cursor-pointer px-3 py-2 text-sm font-medium transition-all ${
              role === "owner"
                ? "bg-white text-green-600 shadow"
                : "text-neutral-600"
            }`}
          >
            Owner
          </button>
        </div>

        <form method="POST" onSubmit={onSubmit}>
          <div className="mb-4">
            <label className="mb-2 block font-medium text-neutral-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="Masukkan email"
              required
              suppressHydrationWarning
              className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-3 text-base text-neutral-800 placeholder-neutral-400 transition-colors focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/50"
            />
          </div>
          <div className="mb-4">
            <label className="mb-2 block font-medium text-neutral-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Masukkan password"
              required
              suppressHydrationWarning
              className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-3 text-base text-neutral-800 placeholder-neutral-400 transition-colors focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/50"
            />
          </div>
          <div className="mb-2 text-right">
            <Link
              href="/forgot-password"
              className="cursor-pointer text-sm text-green-600 hover:text-green-700 hover:underline"
            >
              Lupa Password?
            </Link>
          </div>
          <motion.button
            type="submit"
            disabled={isLoading}
            suppressHydrationWarning
            className="mt-4 w-full rounded-lg bg-gradient-to-r from-green-500 to-green-600 py-3 text-base font-semibold text-white shadow-lg shadow-green-500/30 transition-all duration-300 hover:from-green-600 hover:to-green-700 hover:shadow-xl hover:shadow-green-500/40 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
            whileHover={{ scale: isLoading ? 1 : 1.02 }}
            whileTap={{ scale: isLoading ? 1 : 0.98 }}
          >
            {isLoading ? "Loading..." : "Login"}
          </motion.button>
        </form>
        <motion.button
          type="button"
          onClick={() => {
            signIn("google", { callbackUrl: callbackUrl, redirect: false });
          }}
          disabled={isLoading}
          suppressHydrationWarning
          className="mt-4 flex w-full items-center cursor-pointer justify-center gap-3 rounded-lg border border-neutral-300 bg-white py-3 text-base font-semibold text-neutral-700 shadow transition-all hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          whileHover={{ scale: isLoading ? 1 : 1.02 }}
          whileTap={{ scale: isLoading ? 1 : 0.98 }}
        >
          <FcGoogle size={25} />
          <span>Login dengan Google</span>
        </motion.button>
        <div className="mt-6 text-center text-base text-neutral-600">
          Belum punya akun?{" "}
          <Link
            className="cursor-pointer font-medium text-green-600 transition-colors hover:text-green-700 hover:underline"
            href={"/register"}
          >
            Daftar
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginForm;

