"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import ResetPasswordSidebar from "./ResetPasswordSidebar";
import ResetPasswordForm from "./ResetPasswordForm";

const ResetPassword = () => {
  const { push } = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [mounted, setMounted] = useState(false);
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);

  useEffect(() => {
    setMounted(true);

    // Check if token exists in URL
    if (!token) {
      setTokenValid(false);
      setError("Token tidak ditemukan. Silakan request reset password lagi.");
    } else {
      setTokenValid(true);
    }
  }, [token]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const formData = new FormData(e.currentTarget);
      const password = formData.get("password")?.toString() ?? "";
      const confirmPassword = formData.get("confirmPassword")?.toString() ?? "";

      if (!password || !confirmPassword) {
        setError("Password dan konfirmasi password wajib diisi");
        setIsLoading(false);
        return;
      }

      if (password !== confirmPassword) {
        setError("Password dan konfirmasi password tidak cocok");
        setIsLoading(false);
        return;
      }

      if (password.length < 6) {
        setError("Password minimal 6 karakter");
        setIsLoading(false);
        return;
      }

      if (!token) {
        setError("Token tidak ditemukan");
        setIsLoading(false);
        return;
      }

      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          password,
          confirmPassword,
        }),
      });

      const data = await res.json();

      if (res.ok && data.status) {
        setSuccess(data.message || "Password berhasil direset");
        e.currentTarget.reset();
        // Redirect to login after 3 seconds
        setTimeout(() => {
          push("/login");
        }, 3000);
      } else {
        setError(data.message || "Terjadi kesalahan. Silakan coba lagi.");
        // If token invalid, mark token as invalid
        if (
          data.message?.includes("Token") ||
          data.message?.includes("token")
        ) {
          setTokenValid(false);
        }
      }
    } catch {
      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  const slides = [
    {
      src: "/logo/logo.jpeg",
      title: "Reset Password",
      description: "Masukkan password baru Anda untuk mengakses akun.",
    },
    {
      src: "/gambar_tambahan/iot.jpg",
      title: "Password Baru",
      description: "Pastikan password Anda kuat dan mudah diingat.",
    },
    {
      src: "/gambar_tambahan/robot.jpg",
      title: "Keamanan Akun",
      description: "Jangan bagikan password Anda kepada siapa pun.",
    },
  ];

  return (
    <div className="flex min-h-screen w-full bg-linear-to-br from-neutral-50 to-neutral-100">
      <ResetPasswordSidebar slides={slides} mounted={mounted} />
      <ResetPasswordForm
        isLoading={isLoading}
        error={error}
        success={success}
        tokenValid={tokenValid}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default ResetPassword;
