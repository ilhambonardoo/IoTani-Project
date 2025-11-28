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
      <section className="relative isolate py-16 sm:py-20 md:py-24 lg:py-28 overflow-hidden">
        {/* Background with better overlay */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <Image
            src="/cabai/cabai5.jpg"
            alt="Latar belakang"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/70" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.3)_100%)]" />
        </div>

        <div className="mb-12 sm:mb-16 flex flex-col items-center text-center px-4 relative z-10">
          <motion.span
            className="inline-block mb-4 text-sm font-semibold text-green-400 uppercase tracking-wider"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Edukasi
          </motion.span>
          <motion.h2
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Jelajahi Dunia Cabai
          </motion.h2>
          <motion.p
            className="max-w-3xl text-lg sm:text-xl text-white/90 leading-relaxed font-medium"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Kenali ragam cabai dari berbagai belahan dunia. Pelajari karakter dan
            kegunaannya untuk budidaya yang lebih optimal.
          </motion.p>
        </div>

        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="flex h-60 items-center justify-center">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-green-400 border-t-transparent" />
            </div>
          ) : chilies.length === 0 ? (
            <div className="text-center text-white/90 py-16">
              <p className="text-lg">Belum ada data cabai. Silakan hubungi admin untuk menambahkan.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {chilies.map((chili, idx) => (
                <motion.article
                  key={chili.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ 
                    duration: 0.5, 
                    delay: idx * 0.05,
                    ease: [0.16, 1, 0.3, 1]
                  }}
                  onClick={() => setSelectedChili(chili)}
                  className="group relative cursor-pointer overflow-hidden rounded-3xl border border-white/20 bg-white/10 backdrop-blur-md p-6 shadow-xl shadow-black/20 transition-all duration-500 hover:bg-white/20 hover:scale-[1.02] hover:shadow-2xl hover:shadow-black/30 hover:border-white/30"
                >
                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-transparent to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Image */}
                  <div className="relative mb-5 aspect-[4/3] w-full overflow-hidden rounded-2xl bg-white/5 ring-1 ring-white/10 group-hover:ring-white/20 transition-all duration-500">
                    {chili.imageUrl ? (
                      <Image
                        src={chili.imageUrl}
                        alt={chili.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        unoptimized={chili.imageUrl.includes('supabase.co')}
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="absolute inset-0 grid place-items-center">
                        <LuImage className="h-10 w-10 text-white/30" />
                      </div>
                    )}
                    {/* Image overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-green-300 transition-colors duration-300">
                    {chili.name}
                  </h3>
                  <p className="line-clamp-3 text-sm leading-relaxed text-white/80 group-hover:text-white/90 transition-colors duration-300">
                    {chili.description}
                  </p>

                  {/* Hover indicator */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 to-emerald-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
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
              className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedChili(null)}
                className="cursor-pointer absolute top-6 right-6 z-10 rounded-full bg-white/95 backdrop-blur-sm p-3 text-neutral-600 shadow-lg transition-all duration-200 hover:bg-white hover:text-neutral-900 hover:scale-110 border border-neutral-200"
              >
                <LuX size={20} />
              </button>

              {/* Image */}
              <div className="relative h-72 sm:h-80 md:h-96 w-full overflow-hidden bg-gradient-to-br from-neutral-100 to-neutral-200">
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
                {/* Gradient overlay untuk transisi ke content */}
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent pointer-events-none" />
              </div>

              {/* Content */}
              <div className="px-6 sm:px-8 md:px-10 pt-8 pb-8 sm:pb-10">
                <h2 className="mb-6 text-3xl sm:text-4xl font-extrabold text-neutral-900 leading-tight">
                  {selectedChili.name}
                </h2>

                <div className="space-y-6 sm:space-y-8">
                  <div>
                    <h3 className="mb-3 text-xl font-bold text-neutral-800 border-b border-neutral-200 pb-2">
                      Deskripsi
                    </h3>
                    <p className="text-base sm:text-lg text-neutral-700 leading-relaxed">
                      {selectedChili.description}
                    </p>
                  </div>

                  {selectedChili.characteristics && (
                    <div>
                      <h3 className="mb-3 text-xl font-bold text-neutral-800 border-b border-neutral-200 pb-2">
                        Karakteristik
                      </h3>
                      <p className="text-base sm:text-lg text-neutral-700 leading-relaxed whitespace-pre-line">
                        {selectedChili.characteristics}
                      </p>
                    </div>
                  )}

                  {selectedChili.uses && (
                    <div>
                      <h3 className="mb-3 text-xl font-bold text-neutral-800 border-b border-neutral-200 pb-2">
                        Kegunaan
                      </h3>
                      <p className="text-base sm:text-lg text-neutral-700 leading-relaxed whitespace-pre-line">
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







