"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  return (
    <div className="flex min-h-screen bg-transparent items-center justify-center">
      <motion.div
        className="w-full max-w-md flex flex-col rounded-2xl border border-gray-800 bg-gray-900 p-6 sm:p-8 md:p-10 shadow-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="flex justify-center mb-4">
          <Link
            href="/"
            className="text-4xl font-bold text-white transition-opacity hover:opacity-80"
          >
            IoTani<span className="text-gray-400">.</span>
          </Link>
        </div>
        <h2 className="mb-6 text-center text-2xl font-bold text-white">
          Login Akun
        </h2>

        <form method="POST">
          <div className="mb-4">
            <label className="mb-2 block font-medium text-gray-300">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="Masukkan email"
              required
              className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-3 text-base text-white placeholder-gray-500 transition-colors focus:border-white focus:outline-none focus:ring-2 focus:ring-white"
            />
          </div>
          <div className="mb-4">
            <label className="mb-2 block font-medium text-gray-300">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Masukkan password"
              required
              className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-3 text-base text-white placeholder-gray-500 transition-colors focus:border-white focus:outline-none focus:ring-2 focus:ring-white"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="mt-4 w-full rounded-lg bg-white py-3 text-base font-semibold text-black shadow-lg shadow-gray-100/20 transition-all duration-300 hover:bg-gray-200 hover:shadow-xl hover:shadow-gray-200/30 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Loading..." : "Login"}
          </button>
        </form>
        <button
          type="button"
          disabled={isLoading}
          className="mt-4 flex w-full items-center justify-center gap-3 rounded-lg border border-gray-700 py-3 text-base font-semibold text-white shadow transition-all hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-black disabled:cursor-not-allowed disabled:opacity-60"
        >
          <FcGoogle size={25} />
          <span>Login dengan Google</span>
        </button>
        <div className="mt-6 text-center text-base text-gray-400">
          Belum punya akun?{" "}
          <Link
            className="font-medium text-white transition-colors hover:text-gray-300 hover:underline"
            href={"/register"}
          >
            Daftar
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
