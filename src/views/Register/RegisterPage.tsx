"use client";

import { AnimatePresence, motion } from "framer-motion";
import { signIn } from "next-auth/react";
import Image from "next/legacy/image";
import Link from "next/link";
import { useEffect, useState, FormEvent } from "react";
import { FcGoogle } from "react-icons/fc";
import { IoPlayBack } from "react-icons/io5";

const Register = () => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const form = e.currentTarget;
      const formData = new FormData(form);

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: String(formData.get("name") || ""),
          username: String(formData.get("username") || ""),
          email: String(formData.get("email") || ""),
          password: String(formData.get("password") || ""),
        }),
      });

      if (res.status == 200) {
        form.reset();
        setSuccess("Registrasi berhasil! Mengarahkan ke halaman login...");
        setTimeout(() => {
          signIn();
        }, 2000);
      } else {
        const data = await res.json().catch(() => null);
        setError((data && data.message) || "Email sudah terdaftar!");
        form.reset();
        console.log(res, data);
      }
    } catch (err) {
      console.error(err);
      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  const slides = [
    {
      src: "/logo/logo.jpeg",
      title: "Selamat Datang di IoTani",
      description: "Solusi cerdas untuk pertanian modern Anda.",
    },
    {
      src: "/gambar_tambahan/iot.jpg",
      title: "Monitor Lahan Anda",
      description: "Pantau kondisi tanah dan tanaman secara real-time.",
    },
    {
      src: "/gambar_tambahan/robot.jpg",
      title: "Otomatisasi & Efisiensi",
      description: "Tingkatkan hasil panen dengan teknologi pintar.",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 4000);

    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="flex min-h-screen w-full bg-gradient-to-br from-neutral-50 to-neutral-100">
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-gradient-to-br from-green-600 to-green-700 p-10 text-white md:flex">
        <div className="z-10 text-3xl font-bold">
          IoTani<span className="text-green-200">.</span>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
            className="relative z-10"
          >
            <h1 className="mb-4 text-4xl font-bold leading-tight">
              {slides[currentSlide].title}
            </h1>
            <p className="text-xl text-green-50">
              {slides[currentSlide].description}
            </p>
          </motion.div>
        </AnimatePresence>
        <div className="relative z-10 flex space-x-2">
          {slides.map((_, index) => (
            <div
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 w-10 cursor-pointer rounded-full transition-all ${
                currentSlide === index ? "bg-white" : "bg-green-300/50"
              }`}
            ></div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div //
            key={currentSlide}
            className="absolute inset-0 z-0 h-full w-full"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            <Image //
              src={slides[currentSlide].src}
              alt={slides[currentSlide].title}
              fill //
              style={{ objectFit: "cover" }}
              priority
            />
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-green-900/40 to-green-800/60"></div>
      </div>
      <div className="flex w-full items-center justify-center p-6 md:w-1/2 md:p-10">
        <motion.div
          className="relative w-full max-w-md flex flex-col"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <button
            onClick={() => signIn()}
            className="mb-6 flex items-center gap-2 text-neutral-600 transition-colors hover:text-green-600"
            aria-label="Kembali ke login"
          >
            <IoPlayBack size={20} />
            <span>Kembali</span>
          </button>

          <div className="flex justify-center mb-4 md:hidden">
            <Link
              href="/"
              className="text-4xl font-bold text-green-600 transition-opacity hover:opacity-80"
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

          <form onSubmit={handleSubmit} method="POST">
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
            disabled={isLoading}
            className="mt-4 flex w-full items-center justify-center gap-3 rounded-lg border border-neutral-300 bg-white py-3 text-base font-semibold text-neutral-700 shadow transition-all hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
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
              className="font-medium text-green-600 transition-colors hover:text-green-700 hover:underline"
            >
              Login
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
