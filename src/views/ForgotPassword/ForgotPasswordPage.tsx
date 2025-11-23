"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState, useRef } from "react";
import { IoPlayBack } from "react-icons/io5";

const ForgotPassword = () => {
  const { push } = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const formData = new FormData(e.currentTarget);
      const email = formData.get("email")?.toString() ?? "";

      if (!email) {
        setError("Email wajib diisi");
        setIsLoading(false);
        return;
      }

      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok && data.status) {
        setSuccess(data.message || "Link reset password telah dikirim ke email Anda");
        // Reset form using ref instead of currentTarget
        if (formRef.current) {
          formRef.current.reset();
        }
        // Optionally redirect to login after 3 seconds
        setTimeout(() => {
          push("/login");
        }, 3000);
      } else {
        setError(data.message || "Terjadi kesalahan. Silakan coba lagi.");
      }
    } catch (err) {
      console.error("Forgot password error:", err);
      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  const slides = [
    {
      src: "/logo/logo.jpeg",
      title: "Lupa Password?",
      description: "Jangan khawatir, kami akan membantu Anda mereset password Anda.",
    },
    {
      src: "/gambar_tambahan/iot.jpg",
      title: "Reset Password",
      description: "Masukkan email Anda dan kami akan mengirim link reset password.",
    },
    {
      src: "/gambar_tambahan/robot.jpg",
      title: "Keamanan Akun",
      description: "Link reset password akan expired dalam 1 jam untuk keamanan.",
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (!mounted) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 4000);

    return () => clearInterval(timer);
  }, [mounted, slides.length]);

  return (
    <div className="flex min-h-screen w-full bg-gradient-to-br from-neutral-50 to-neutral-100">
      <div className="relative hidden lg:flex w-1/2 flex-col justify-between overflow-hidden bg-gradient-to-br from-green-600 to-green-700 p-10 text-white">
        <div className="z-10 text-3xl font-bold">
          IoTani<span className="text-green-200">.</span>
        </div>

        {mounted && (
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
        )}
        {!mounted && (
          <div className="relative z-10">
            <h1 className="mb-4 text-4xl font-bold leading-tight">
              {slides[0].title}
            </h1>
            <p className="text-xl text-green-50">{slides[0].description}</p>
          </div>
        )}

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

        {mounted ? (
          <AnimatePresence mode="wait">
            <motion.img
              key={currentSlide}
              src={slides[currentSlide].src}
              alt={slides[currentSlide].title}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="absolute inset-0 z-0 h-full w-full object-cover"
            />
          </AnimatePresence>
        ) : (
          <Image
            src={slides[0].src}
            alt={slides[0].title}
            fill
            className="object-cover"
            priority
          />
        )}
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-green-900/40 to-green-800/60"></div>
      </div>

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
            Masukkan email Anda dan kami akan mengirim link untuk mereset password Anda.
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

          <form ref={formRef} method="POST" onSubmit={handleSubmit}>
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
              {isLoading ? "Mengirim..." : success ? "Email Terkirim!" : "Kirim Link Reset Password"}
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
    </div>
  );
};

export default ForgotPassword;

