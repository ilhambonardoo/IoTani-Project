"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { LuSend } from "react-icons/lu";
import { useState } from "react";
import { useRouter } from "next/navigation";

const ForgotPassword = () => {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [sent, setSent] = useState<boolean>(false);

	const submit = (e: React.FormEvent) => {
		e.preventDefault();
		(async () => {
			setLoading(true);
			setError(null);
			try {
				const res = await fetch("/api/auth/reset-request", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ email }),
				});
				if (!res.ok) throw new Error("Failed to request reset link");
				setSent(true);
				router.push("/check-email");
			} catch (err: any) {
				setError(err?.message || "Gagal mengirim email reset.");
			} finally {
				setLoading(false);
			}
		})();
	};

	return (
		<main className="grid min-h-screen place-items-center bg-gradient-to-b from-[#0D1117] to-[#0A0A0A] px-6 py-16">
			<div className="w-full max-w-md rounded-3xl border border-cyan-400/20 bg-white/5 p-8 shadow-[0_0_0_1px_rgba(0,240,255,0.08)] ring-1 ring-white/5">
				<h1 className="text-center text-2xl font-bold text-white">Reset Password Anda</h1>
				<p className="mt-2 text-center text-sm text-white/70">
					Masukkan email yang terdaftar. Kami akan mengirimkan link untuk mereset password Anda.
				</p>
				<form onSubmit={submit} className="mt-8 space-y-4">
					<label className="flex flex-col gap-2">
						<span className="text-sm text-white/70">Email</span>
						<input
							type="email"
							required
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="nama@domain.com"
							className="rounded-xl border border-cyan-400/20 bg-white/5 px-3 py-2 text-white placeholder:text-white/40 outline-none ring-1 ring-white/5 focus:border-cyan-300 focus:ring-cyan-300"
						/>
					</label>
					{error && <p className="text-sm text-red-400">{error}</p>}
					<motion.button
						whileTap={{ scale: 0.98 }}
						type="submit"
						disabled={loading}
						className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 px-4 py-2 font-semibold text-black transition-colors hover:bg-cyan-300 disabled:opacity-60"
					>
						<LuSend className="h-5 w-5" />
						{loading ? "Mengirim..." : "Kirim Link Reset"}
					</motion.button>
				</form>

				<div className="mt-6 text-center">
					<Link href="/login" className="text-sm font-medium text-cyan-300 hover:underline">
						Kembali ke Login
					</Link>
				</div>
			</div>
		</main>
	);
};

export default ForgotPassword;


