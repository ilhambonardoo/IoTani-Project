"use client";

import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-linear-to-br from-green-600 to-green-700 py-12 sm:py-16 lg:py-20 text-white">
      <div className="absolute inset-0 bg-[url('/gambar_tambahan/iot.jpg')] bg-cover bg-center opacity-10" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="mb-4 sm:mb-6 text-3xl sm:text-4xl md:text-5xl font-bold lg:text-6xl">
            Tentang IoTani
          </h1>
          <p className="mx-auto max-w-3xl text-base sm:text-lg lg:text-xl text-green-50 px-4">
            Platform IoT cerdas yang menghubungkan teknologi modern dengan
            pertanian tradisional untuk menciptakan masa depan pertanian yang
            berkelanjutan.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;

