"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const ResetPasswordPage = () => {
  const search = useSearchParams();
  const router = useRouter();
  const token = search.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!token) return setError("Token tidak ditemukan.");
    if (password.length < 6) return setError("Password minimal 6 karakter.");
    if (password !== confirm) return setError("Konfirmasi password tidak cocok.");

    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data?.message || "Gagal memperbarui password.");
      }
      router.push("/login");
    } catch (e: any) {
      setError(e?.message || "Gagal memperbarui password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-gradient-to-b from-[#0D1117] to-[#0A0A0A] px-6 py-16">
      <div className="w-full max-w-md rounded-3xl border border-cyan-400/20 bg-white/5 p-8 ring-1 ring-white/5">
        <h1 className="text-center text-2xl font-bold text-white">Atur Ulang Password</h1>
        <p className="mt-2 text-center text-sm text-white/70">
          Masukkan password baru Anda.
        </p>
        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <label className="flex flex-col gap-2">
            <span className="text-sm text-white/70">Password Baru</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="rounded-xl border border-cyan-400/20 bg-white/5 px-3 py-2 text-white placeholder:text-white/40 outline-none ring-1 ring-white/5 focus:border-cyan-300 focus:ring-cyan-300"
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-sm text-white/70">Konfirmasi Password</span>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="••••••••"
              className="rounded-xl border border-cyan-400/20 bg-white/5 px-3 py-2 text-white placeholder:text-white/40 outline-none ring-1 ring-white/5 focus:border-cyan-300 focus:ring-cyan-300"
            />
          </label>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 px-4 py-2 font-semibold text-black transition-colors hover:bg-cyan-300 disabled:opacity-60"
          >
            {loading ? "Menyimpan..." : "Simpan Password"}
          </button>
        </form>
      </div>
    </main>
  );
};

export default ResetPasswordPage;


