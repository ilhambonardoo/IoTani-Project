"use client";

import { signIn } from "next-auth/react";
import { useState, FormEvent } from "react";
import RegisterSidebar from "./RegisterSidebar";
import RegisterForm from "./RegisterForm";

const Register = ({
  searchParams,
}: {
  searchParams?: { [key: string]: string | undefined };
}) => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const callbackUrl = searchParams?.callbackUrl || "/dashboard";

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

  return (
    <div className="flex min-h-screen w-full bg-gradient-to-br from-neutral-50 to-neutral-100">
      <RegisterSidebar slides={slides} />
      <RegisterForm
        isLoading={isLoading}
        error={error}
        success={success}
        callbackUrl={callbackUrl}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default Register;
