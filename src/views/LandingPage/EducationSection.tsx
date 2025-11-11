"use client";

import { motion } from "framer-motion";
import { LuImage } from "react-icons/lu";

const chiliVarieties = [
	"Aji",
	"Anaheim",
	"Carolina Reaper",
	"Cayenne",
	"Ghost Pepper",
	"Jalapeno",
	"Habanero",
	"Pimento",
	"Sweet Bell",
];

const EducationSection = () => {
	return (
		<section className="relative isolate py-20 md:py-24">
			<div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-[#0D1117] to-[#0A0A0A]" />
			<div className="container mx-auto px-6 lg:px-20">
				<div className="mb-10 flex flex-col items-center text-center">
					<h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
						Jelajahi Dunia Cabai
					</h2>
					<p className="mt-3 max-w-2xl text-sm md:text-base text-white/70">
						Kenali ragam cabai dari berbagai belahan dunia. Pelajari karakter
						dan kegunaannya untuk budidaya yang lebih optimal.
					</p>
				</div>

				<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
					{chiliVarieties.map((name, idx) => (
						<motion.article
							key={name}
							initial={{ opacity: 0, y: 16 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, amount: 0.2 }}
							transition={{ duration: 0.4, delay: idx * 0.04 }}
							className="group relative overflow-hidden rounded-2xl border border-cyan-400/20 bg-white/5 p-4 shadow-[0_0_0_1px_rgba(0,240,255,0.08)] ring-1 ring-white/5 backdrop-blur supports-[backdrop-filter]:bg-[#0E1218]/60"
						>
							{/* Image placeholder */}
							<div className="relative mb-4 aspect-[4/3] w-full overflow-hidden rounded-xl bg-white/5 ring-1 ring-white/10">
								<div className="absolute inset-0 grid place-items-center">
									<LuImage className="h-8 w-8 text-cyan-300/40" />
								</div>
								<div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-cyan-300/0 via-cyan-300/0 to-cyan-300/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
							</div>

							<h3 className="text-lg font-semibold text-white">{name}</h3>
							<p className="mt-2 line-clamp-3 text-sm leading-relaxed text-white/70">
								Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
								tempor, sapien vel posuere interdum, elit nunc fermentum arcu.
							</p>

							<div className="pointer-events-none absolute inset-px rounded-[calc(theme(borderRadius.2xl)-1px)] ring-1 ring-cyan-400/10 transition duration-300 group-hover:ring-cyan-300/40" />
							<div className="pointer-events-none absolute inset-0 rounded-2xl bg-cyan-400/0 blur-2xl transition duration-300 group-hover:bg-cyan-400/5" />
						</motion.article>
					))}
				</div>
			</div>
		</section>
	);
};

export default EducationSection;


