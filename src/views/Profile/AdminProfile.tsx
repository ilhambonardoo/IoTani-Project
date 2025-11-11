"use client";
import { LuShield } from "react-icons/lu";

const AdminProfile = () => {
	return (
		<section className="min-h-screen bg-gradient-to-b from-[#0D1117] to-[#0A0A0A] py-16 px-6">
			<div className="mx-auto w-full max-w-3xl rounded-3xl border border-cyan-400/20 bg-white/5 p-8 shadow-[0_0_0_1px_rgba(0,240,255,0.08)] ring-1 ring-white/5">
				<div className="flex flex-col items-center">
					<div className="relative grid h-28 w-28 place-items-center overflow-hidden rounded-full bg-neutral-800 ring-2 ring-white/10">
						<span className="text-4xl font-extrabold text-white/80">A</span>
					</div>
					<h1 className="mt-6 text-2xl font-semibold text-white">Admin Utama</h1>
					<div className="mt-1 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-white/5 px-3 py-1 text-xs font-semibold text-cyan-300">
						<LuShield className="h-4 w-4" />
						Administrator
					</div>

					<div className="mt-8 grid w-full gap-4 md:grid-cols-2">
						<div className="rounded-xl border border-white/10 bg-white/5 p-4">
							<p className="text-xs text-white/50">Nama</p>
							<p className="mt-1 font-medium text-white">Admin Utama</p>
						</div>
						<div className="rounded-xl border border-white/10 bg-white/5 p-4">
							<p className="text-xs text-white/50">Email</p>
							<p className="mt-1 font-medium text-white">admin@project.com</p>
						</div>
						<div className="md:col-span-2 rounded-xl border border-white/10 bg-white/5 p-4">
							<p className="text-xs text-white/50">Role</p>
							<p className="mt-1 font-medium text-white">Administrator</p>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default AdminProfile;


