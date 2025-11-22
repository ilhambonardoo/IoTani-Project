"use client";
import { AnimatePresence, motion } from "framer-motion";
import { signIn } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState, FormEvent } from "react";
import { FcGoogle } from "react-icons/fc";
import { IoPlayBack } from "react-icons/io5";
import { login } from "@/lib/firebase/service";

interface LoginUserData {
  id: string;
  email: string;
  password: string;
  role?: string;
  fullName?: string;
  [key: string]: unknown;
}

const Login = ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const { push } = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [role, setRole] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  const defaultDashboardUrl =
    role === "admin"
      ? "/dashboard_admin"
      : role === "owner"
      ? "/dashboard_owner"
      : "/dashboard";

  const callbackUrl = searchParams.url ?? defaultDashboardUrl;

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Validasi role dipilih
    if (!role) {
      setError(
        "Silakan pilih tipe akun terlebih dahulu (User, Admin, atau Owner)"
      );
      setIsLoading(false);
      return;
    }

    try {
      const formData = new FormData(e.currentTarget);
      const email = formData.get("email")?.toString() ?? "";
      const password = formData.get("password")?.toString() ?? "";

      // Fetch user data untuk mendapatkan role sebenarnya
      let userData: LoginUserData | null;
      try {
        userData = await login({ email }) as LoginUserData | null;
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError(
          "Terjadi kesalahan saat memverifikasi akun. Silakan coba lagi."
        );
        setIsLoading(false);
        return;
      }

      if (!userData) {
        setError("Email atau password salah");
        setIsLoading(false);
        e.currentTarget.reset();
        return;
      }

      // Validasi role yang dipilih dengan role user sebenarnya
      const userRole = (userData.role || "").toLowerCase().trim();
      const selectedRole = role.toLowerCase().trim();

      if (userRole !== selectedRole) {
        let errorMessage = "";
        if (selectedRole === "admin" && userRole !== "admin") {
          if (userRole === "user") {
            errorMessage =
              "Akun ini adalah akun User. Silakan login sebagai User.";
          } else if (userRole === "owner") {
            errorMessage =
              "Akun ini adalah akun Owner. Silakan login sebagai Owner.";
          } else {
            errorMessage =
              "Akun ini bukan akun Admin. Silakan pilih role yang sesuai.";
          }
        } else if (selectedRole === "owner" && userRole !== "owner") {
          if (userRole === "user") {
            errorMessage =
              "Akun ini adalah akun User. Silakan login sebagai User.";
          } else if (userRole === "admin") {
            errorMessage =
              "Akun ini adalah akun Admin. Silakan login sebagai Admin.";
          } else {
            errorMessage =
              "Akun ini bukan akun Owner. Silakan pilih role yang sesuai.";
          }
        } else if (selectedRole === "user" && userRole !== "user") {
          if (userRole === "admin") {
            errorMessage =
              "Akun ini adalah akun Admin. Silakan login sebagai Admin.";
          } else if (userRole === "owner") {
            errorMessage =
              "Akun ini adalah akun Owner. Silakan login sebagai Owner.";
          } else {
            errorMessage =
              "Role akun tidak sesuai. Silakan pilih role yang benar.";
          }
        } else {
          errorMessage = "Role akun tidak sesuai dengan yang dipilih.";
        }

        setError(errorMessage);
        setIsLoading(false);
        return;
      }

      // Jika role sesuai, lanjutkan login

      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
        role,
        callbackUrl: callbackUrl,
      });

      if (!res?.error) {
        push(callbackUrl);
        setIsLoading(false);
      } else {
        if (res?.status === 401) {
          setError("Email atau password salah");
          setIsLoading(false);
          e.currentTarget.reset();
        } else {
          setError("Terjadi kesalahan saat login. Silakan coba lagi.");
          setIsLoading(false);
        }
      }
    } catch (error) {
      console.log("Login failed:", error);
      setError("Terjadi kesalahan saat login. Silakan coba lagi.");
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
              onClick={() => setRole("user")}
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
              onClick={() => setRole("admin")}
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
              onClick={() => setRole("owner")}
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

          <form method="POST" onSubmit={handleLogin}>
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
    </div>
  );
};

export default Login;
