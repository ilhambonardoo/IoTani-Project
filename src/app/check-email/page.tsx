"use client";
import Link from "next/link";
import { LuMailCheck } from "react-icons/lu";

const CheckEmail = () => {
	return (
		<main className="grid min-h-screen place-items-center bg-gradient-to-b from-[#0D1117] to-[#0A0A0A] px-6 py-16">
			<div className="w-full max-w-md rounded-3xl border border-cyan-400/20 bg-white/5 p-10 text-center shadow-[0_0_0_1px_rgba(0,240,255,0.08)] ring-1 ring-white/5">
				<div className="mx-auto grid h-20 w-20 place-items-center rounded-full border border-cyan-400/30 bg-white/5 text-cyan-300">
					<LuMailCheck className="h-10 w-10" />
				</div>
				<h1 className="mt-6 text-2xl font-bold text-white">Link Terkirim!</h1>
				<p className="mt-2 text-sm text-white/70">
					Silakan cek kotak masuk (dan folder spam) email Anda untuk instruksi reset password.
				</p>
				<div className="mt-6">
					<Link
						href="/login"
						className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/5 px-4 py-2 font-medium text-white hover:bg-white/10"
					>
						Kembali ke Login
					</Link>
				</div>
			</div>
		</main>
	);
};

export default CheckEmail;


