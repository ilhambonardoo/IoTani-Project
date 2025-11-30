"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, FormEvent } from "react";
import { signIn } from "next-auth/react";
import { login } from "@/lib/db/firebase/service";
import LoginSidebar from "./LoginSidebar";
import LoginForm from "./LoginForm";
import type { LoginUserData } from "@/types";

const Login = ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const { push } = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
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

      let userData: LoginUserData | null;
      try {
        userData = (await login({ email })) as LoginUserData | null;
      } catch {
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
          setError("Email atau password salah");
          setIsLoading(false);
        }
      }
    } catch {
      setError("Email atau password salah");
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
      <LoginSidebar slides={slides} mounted={mounted} />
      <LoginForm
        role={role}
        isLoading={isLoading}
        error={error}
        callbackUrl={callbackUrl}
        onRoleChange={setRole}
        onSubmit={handleLogin}
      />
    </div>
  );
};

export default Login;
