"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import ForgotPasswordSidebar from "./ForgotPasswordSidebar";
import ForgotPasswordForm from "./ForgotPasswordForm";

const ForgotPassword = () => {
  const { push } = useRouter();
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
        setSuccess(
          data.message ||
            "Link reset password telah dikirim ke email Anda"
        );
        // Reset form
        e.currentTarget.reset();
        // Optionally redirect to login after 3 seconds
        setTimeout(() => {
          push("/login");
        }, 3000);
      } else {
        setError(data.message || "Terjadi kesalahan. Silakan coba lagi.");
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
      title: "Lupa Password?",
      description:
        "Jangan khawatir, kami akan membantu Anda mereset password Anda.",
    },
    {
      src: "/gambar_tambahan/iot.jpg",
      title: "Reset Password",
      description:
        "Masukkan email Anda dan kami akan mengirim link reset password.",
    },
    {
      src: "/gambar_tambahan/robot.jpg",
      title: "Keamanan Akun",
      description:
        "Link reset password akan expired dalam 1 jam untuk keamanan.",
    },
  ];

  return (
    <div className="flex min-h-screen w-full bg-gradient-to-br from-neutral-50 to-neutral-100">
      <ForgotPasswordSidebar slides={slides} mounted={mounted} />
      <ForgotPasswordForm
        isLoading={isLoading}
        error={error}
        success={success}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default ForgotPassword;

