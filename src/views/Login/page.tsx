"use client";
import { AnimatePresence, motion } from "framer-motion";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, FormEvent } from "react";
import { FcGoogle } from "react-icons/fc";
import { IoPlayBack } from "react-icons/io5";

const Login = () => {
  const { push } = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);
  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const formData = new FormData(e.currentTarget);
      const email = formData.get("email")?.toString() ?? "";
      const password = formData.get("password")?.toString() ?? "";

      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
        callbackUrl: "/dashboard",
      });

      if (!res?.error) {
        e.currentTarget.reset();
        push("/dashboard");
        setIsLoading(false);
      } else {
        if (res.status == 401) {
          setError("Email or password is incorrect");
          setIsLoading(false);
          e.currentTarget.reset();
        } else {
          setIsLoading(false);
        }
      }
    } catch (error) {
      console.log("Login failed:", error);
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
    <div className="flex min-h-screen w-full bg-gray-900">
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-gray-800 p-10 text-white md:flex">
        <div className="z-10 text-3xl font-bold">
          IoTani<span className="text-gray-400">.</span>
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
            <p className="text-xl text-gray-300">
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
                currentSlide === index ? "bg-white" : "bg-gray-500"
              }`}
            ></div>
          ))}
        </div>

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
        <div className="absolute inset-0 z-0 bg-black opacity-50"></div>
      </div>

      <div className="flex w-full items-center justify-center p-6 md:w-1/2 md:p-10">
        <motion.div
          className="relative w-full max-w-md flex flex-col"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <Link
            href="/"
            className="mb-6 flex items-center gap-2 text-gray-500 transition-colors hover:text-white"
            aria-label="Kembali ke beranda"
          >
            <IoPlayBack size={20} />
            <span>Kembali</span>
          </Link>

          <div className="flex justify-center mb-4 md:hidden">
            <Link
              href="/"
              className="text-4xl font-bold text-white transition-opacity hover:opacity-80"
            >
              IoTani<span className="text-gray-400">.</span>
            </Link>
          </div>

          <h2 className="mb-6 text-center text-2xl font-bold text-white md:text-left">
            Login Akun
          </h2>

          {error && (
            <div className="mb-4 rounded-lg bg-red-900/30 p-3 text-center text-red-300">
              {error}
            </div>
          )}

          <form method="POST" onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="mb-2 block font-medium text-gray-300">
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="Masukkan email"
                required
                className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-base text-white placeholder-gray-500 transition-colors focus:border-white focus:outline-none focus:ring-2 focus:ring-white/50"
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
                className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-base text-white placeholder-gray-500 transition-colors focus:border-white focus:outline-none focus:ring-2 focus:ring-white/50"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="mt-4 w-full rounded-lg bg-white py-3 text-base font-semibold text-black shadow-lg shadow-gray-100/20 transition-all duration-300 hover:bg-gray-200 hover:shadow-xl hover:shadow-gray-200/30 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? "Loading..." : "Login"}
            </button>
          </form>
          <button
            type="button"
            disabled={isLoading}
            className="mt-4 flex w-full items-center justify-center gap-3 rounded-lg border border-gray-700 py-3 text-base font-semibold text-white shadow transition-all hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:cursor-not-allowed disabled:opacity-60"
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
    </div>
  );
};

export default Login;
