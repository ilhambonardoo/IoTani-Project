"use client";

import { motion, AnimatePresence } from "framer-motion";
import { LuImage, LuX } from "react-icons/lu";
import Image from "next/image";
import { useState } from "react";
import { useChilies } from "@/hooks";

import type { Chili } from "@/types";

const EducationSection = () => {
  const { chilies, isLoading } = useChilies();
  const [selectedChili, setSelectedChili] = useState<Chili | null>(null);

  return (
    <>
      <section className="relative isolate py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="mb-8 sm:mb-10 flex flex-col items-center text-center px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white">
            Jelajahi Dunia Cabai
          </h2>
          <p className="mt-3 max-w-2xl text-sm sm:text-base text-white/70">
            Kenali ragam cabai dari berbagai belahan dunia. Pelajari karakter dan
            kegunaannya untuk budidaya yang lebih optimal.
          </p>
        </div>
        <div className="pointer-events-none absolute inset-0 -z-10">
          <Image
            src="/cabai/cabai5.jpg"
            alt="Latar belakang"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="container mx-auto px-6 lg:px-20">
          {isLoading ? (
            <div className="flex h-60 items-center justify-center">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-cyan-400 border-t-transparent" />
            </div>
          ) : chilies.length === 0 ? (
            <div className="text-center text-white/70 py-12">
              <p>Belum ada data cabai. Silakan hubungi admin untuk menambahkan.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {chilies.map((chili, idx) => (
                <motion.article
                  key={chili.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.4, delay: idx * 0.04 }}
                  onClick={() => setSelectedChili(chili)}
                  className="group relative cursor-pointer overflow-hidden rounded-2xl border border-cyan-400/20 bg-white/10 p-4 shadow-[0_0_0_1px_rgba(0,240,255,0.08)] ring-1 ring-white/5 backdrop-blur supports-[backdrop-filter]:bg-[#0E1218]/60 transition-all hover:bg-white/20 hover:scale-105"
                >
                  {/* Image */}
                  <div className="relative mb-4 aspect-[4/3] w-full overflow-hidden rounded-xl bg-white/10 ring-1 ring-white/10">
                    {chili.imageUrl ? (
                      <Image
                        src={chili.imageUrl}
                        alt={chili.name}
                        fill
                        className="object-cover"
                        unoptimized={chili.imageUrl.includes('supabase.co')}
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="absolute inset-0 grid place-items-center">
                        <LuImage className="h-8 w-8 text-cyan-300/40" />
                      </div>
                    )}
                  </div>

                  <h3 className="text-lg font-semibold text-white">{chili.name}</h3>
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-white/70">
                    {chili.description}
                  </p>

                  <div className="pointer-events-none absolute inset-px rounded-[calc(theme(borderRadius.2xl)-1px)] ring-1 ring-cyan-400/10 transition duration-300 group-hover:ring-cyan-300/40" />
                  <div className="pointer-events-none absolute inset-0 rounded-2xl bg-cyan-400/0 blur-2xl transition duration-300 group-hover:bg-cyan-400/5" />
                </motion.article>
              ))}
            </div>
          )}
        </div>
        
      </section>

      {/* Modal Detail Cabai */}
      <AnimatePresence>
        {selectedChili && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
            onClick={() => setSelectedChili(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedChili(null)}
                className="cursor-pointer absolute top-4 right-4 z-10 rounded-full bg-white/90 p-2 text-neutral-600 shadow-lg transition-colors hover:bg-white hover:text-neutral-900"
              >
                <LuX size={24} />
              </button>

              {/* Image */}
              <div className="relative h-64 w-full overflow-hidden bg-neutral-100">
                {selectedChili.imageUrl ? (
                  <Image
                    src={selectedChili.imageUrl}
                    alt={selectedChili.name}
                    fill
                    className="object-cover"
                    unoptimized={selectedChili.imageUrl.includes('supabase.co')}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <LuImage className="text-neutral-400" size={64} />
                  </div>

                )}
              </div>

              {/* Content */}
              <div className="p-6">
                <h2 className="mb-4 text-3xl font-bold text-neutral-800">
                  {selectedChili.name}
                </h2>

                <div className="space-y-4">
                  <div>
                    <h3 className="mb-2 text-lg font-semibold text-neutral-800">
                      Deskripsi
                    </h3>
                    <p className="text-neutral-600 leading-relaxed">
                      {selectedChili.description}
                    </p>
                  </div>

                  {selectedChili.characteristics && (
                    <div>
                      <h3 className="mb-2 text-lg font-semibold text-neutral-800">
                        Karakteristik
                      </h3>
                      <p className="text-neutral-600 leading-relaxed whitespace-pre-line">
                        {selectedChili.characteristics}
                      </p>
                    </div>
                  )}

                  {selectedChili.uses && (
                    <div>
                      <h3 className="mb-2 text-lg font-semibold text-neutral-800">
                        Kegunaan
                      </h3>
                      <p className="text-neutral-600 leading-relaxed whitespace-pre-line">
                        {selectedChili.uses}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default EducationSection;







