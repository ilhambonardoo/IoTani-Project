"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { IoPlayBack } from "react-icons/io5";

const Register = () => {
  const [error, setError] = useState("");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: e.target.name.value,
          username: e.target.username.value,
          email: e.target.email.value,
          password: e.target.password.value,
        }),
      });

      if (res.status == 200) {
        e.target.reset();
        router.push("/");
      } else {
        const data = await res.json().catch(() => null);
        setError((data && data.message) || "Email already exists!");
        e.target.reset();
        console.log(res, data);
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-4">
      <motion.div
        className="w-full relative max-w-md rounded-2xl border border-gray-800 bg-gray-900 p-8 shadow-2xl md:p-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <Link
          href="/login"
          className="absolute top-6 left-6 text-gray-500 transition-colors hover:text-white"
          aria-label="Kembali ke beranda"
        >
          <IoPlayBack size={24} />
        </Link>
        <div className="flex justify-center mb-4">
          <Link
            href="/"
            className="text-4xl font-bold text-white transition-opacity hover:opacity-80"
          >
            IoTani<span className="text-gray-400">.</span>
          </Link>
        </div>
        <h2 className="mb-6 text-center text-2xl font-bold text-white">
          Daftar Akun Baru
        </h2>

        {error && (
          <div className="mb-4 rounded-lg border border-red-400/30 bg-red-500/10 p-3 text-center text-sm text-red-400">
            {error}
          </div>
        )}

        <form
          onSubmit={(e) => {
            handleSubmit(e);
          }}
          method="POST"
        >
          <div className="mb-4">
            <label className="mb-2 block font-medium text-gray-300">
              Nama Lengkap
            </label>
            <input
              id="name"
              type="text"
              name="name"
              placeholder="Masukkan nama lengkap"
              required
              className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-3 text-base text-white placeholder-gray-500 transition-colors focus:border-white focus:outline-none focus:ring-2 focus:ring-white"
            />
          </div>
          <div className="mb-4">
            <label className="mb-2 block font-medium text-gray-300">
              Username
            </label>
            <input
              id="username"
              type="text"
              name="username"
              placeholder="Masukkan username unik"
              required
              className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-3 text-base text-white placeholder-gray-500 transition-colors focus:border-white focus:outline-none focus:ring-2 focus:ring-white"
            />
          </div>
          <div className="mb-4">
            <label className="mb-2 block font-medium text-gray-300">
              Email
            </label>
            <input
              id="email"
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
              id="password"
              type="password"
              name="password"
              placeholder="Minimal 6 karakter"
              required
              minLength={6}
              className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-3 text-base text-white placeholder-gray-500 transition-colors focus:border-white focus:outline-none focus:ring-2 focus:ring-white"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="mt-4 w-full rounded-lg bg-white py-3 text-base font-semibold text-black shadow-lg shadow-gray-100/20 transition-all duration-300 hover:bg-gray-200 hover:shadow-xl hover:shadow-gray-200/30 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Mendaftarkan..." : "Daftar"}
          </button>
        </form>
        <button
          type="button"
          disabled={isLoading}
          className="mt-4 flex w-full items-center justify-center gap-3 rounded-lg border border-gray-700 py-3 text-base font-semibold text-white shadow transition-all hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-black disabled:cursor-not-allowed disabled:opacity-60"
        >
          <FcGoogle size={25} />
          <span>Daftar dengan Google</span>
        </button>
        <div className="mt-6 text-center text-base text-gray-400">
          Sudah punya akun?{" "}
          <Link
            className="font-medium text-white transition-colors hover:text-gray-300 hover:underline"
            href={"/login"}
          >
            Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
