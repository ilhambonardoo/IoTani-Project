"use client";
import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { LuCamera, LuCrown, LuLock, LuSave } from "react-icons/lu";
import Image from "next/legacy/image";
import { uploadProfileImage, saveUserProfileImageUrl } from "@/lib/firebase/service";

const OwnerProfile = () => {
	const fileRef = useRef<HTMLInputElement>(null);
	const [avatar, setAvatar] = useState<string | null>(null);
	const [name, setName] = useState<string>("");
	const [email] = useState<string>("owner@example.com");
	const [phone, setPhone] = useState<string>("");
	const [uploading, setUploading] = useState<boolean>(false);

	const onPick = () => fileRef.current?.click();
	const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const f = e.target.files?.[0];
		if (!f) return;
		setUploading(true);
		try {
			// Replace with actual authenticated user ID
			const userId = "demo-owner-id";
			const remoteUrl = await uploadProfileImage(userId, f);
			await saveUserProfileImageUrl(userId, remoteUrl);
			setAvatar(remoteUrl);
		} finally {
			setUploading(false);
		}
	};

	return (
		<section className="min-h-screen bg-gradient-to-b from-[#0D1117] to-[#0A0A0A] py-16 px-6">
			<div className="mx-auto w-full max-w-3xl rounded-3xl border border-cyan-400/30 bg-white/5 p-8 shadow-[0_0_0_1px_rgba(0,240,255,0.08)] ring-1 ring-white/5">
				<div className="flex flex-col items-center">
					<div className="relative">
						<div
							className="group relative h-32 w-32 overflow-hidden rounded-full ring-2 ring-cyan-400/60"
							onClick={onPick}
						>
							{avatar ? (
								<Image
									src={avatar}
									alt="Avatar"
									width={128}
									height={128}
									className="object-cover"
								/>
							) : (
								<div className="grid h-full w-full place-items-center bg-white/5 text-white/60">
									<LuCamera className="h-7 w-7" />
								</div>
							)}
							<div className="pointer-events-none absolute inset-0 grid place-items-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
								<LuCamera className="h-7 w-7 text-white" />
							</div>
						</div>
						<input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFile} />
						<div className="absolute -bottom-1 -right-1 inline-flex items-center gap-1 rounded-full border border-amber-300/30 bg-amber-400/10 px-3 py-1 text-amber-300 backdrop-blur">
							<LuCrown className="h-4 w-4" />
							<span className="text-xs font-semibold">Owner</span>
						</div>
					</div>
					<div className="mt-6 grid w-full gap-4 md:grid-cols-2">
						<label className="flex flex-col gap-2">
							<span className="text-sm text-white/70">Nama Lengkap</span>
							<input
								value={name}
								onChange={(e) => setName(e.target.value)}
								placeholder="Isi nama lengkap"
								className="rounded-xl border border-cyan-400/30 bg-white/5 px-3 py-2 text-white placeholder:text-white/40 outline-none ring-1 ring-white/5 focus:border-cyan-300 focus:ring-cyan-300"
							/>
						</label>
						<label className="flex flex-col gap-2">
							<span className="text-sm text-white/70">Email</span>
							<input
								value={email}
								disabled
								className="rounded-xl border border-transparent bg-white/10 px-3 py-2 text-white/80 outline-none"
							/>
						</label>
						<label className="md:col-span-2 flex flex-col gap-2">
							<span className="text-sm text-white/70">Nomor Telepon</span>
							<input
								value={phone}
								onChange={(e) => setPhone(e.target.value)}
								placeholder="+62 ..."
								className="rounded-xl border border-cyan-400/30 bg-white/5 px-3 py-2 text-white placeholder:text-white/40 outline-none ring-1 ring-white/5 focus:border-cyan-300 focus:ring-cyan-300"
							/>
						</label>
					</div>
					<div className="mt-8 flex w-full flex-col gap-3 sm:flex-row">
						<motion.button disabled={uploading} whileTap={{ scale: 0.98 }} className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-400 px-4 py-2 font-semibold text-black transition-colors hover:bg-cyan-300 disabled:opacity-60">
							<LuSave className="h-5 w-5" />
							{uploading ? "Menyimpan..." : "Simpan Perubahan"}
						</motion.button>
						<button className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-4 py-2 font-medium text-white hover:bg-white/10">
							<LuLock className="h-5 w-5" />
							Ubah Password
						</button>
					</div>
				</div>
			</div>
		</section>
	);
};

export default OwnerProfile;


