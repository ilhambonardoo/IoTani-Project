"use client";

import { motion } from "framer-motion";

const AnimationRobot = () => {
  return (
    <section className="w-full bg-gradient-to-b from-white to-neutral-50 h-fit flex flex-col items-center justify-center gap-6 sm:gap-8 py-12 sm:py-16 px-4 sm:px-6">
      <motion.h2
        className="text-3xl sm:text-4xl md:text-5xl font-bold text-neutral-800 text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        Animasi Robot
      </motion.h2>

      <motion.div
        className="relative w-full max-w-4xl shadow-2xl rounded-xl sm:rounded-2xl overflow-hidden group"
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <video
          src="/video/robot.mp4"
          className="w-full h-auto object-cover"
          autoPlay
          muted
          loop
          playsInline
        />

        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent opacity-90 sm:opacity-80" />

        <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-auto text-white space-y-2 sm:space-y-3 max-w-[calc(100%-2rem)] sm:max-w-md">
          <motion.h3
            className="text-xl sm:text-2xl md:text-3xl font-bold"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Mini Bot
          </motion.h3>
          <motion.p
            className="text-neutral-200 sm:text-neutral-300 text-xs sm:text-sm md:text-base leading-relaxed"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Dilengkapi dengan kamera esp32, pompa air otomatis, dan pemrosesan
            AI real-time.
          </motion.p>

          <motion.div
            className="flex flex-wrap gap-2 sm:gap-3 mt-3 sm:mt-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <span className="bg-white/20 backdrop-blur-md px-2.5 sm:px-3 py-1.5 sm:py-1 rounded-full text-[10px] sm:text-xs flex items-center gap-1.5 sm:gap-2 border border-white/20 hover:bg-white/30 transition-all">
              <span className="text-sm sm:text-base">📷</span>
              <span className="font-medium">4K Vision</span>
            </span>
            <span className="bg-white/20 backdrop-blur-md px-2.5 sm:px-3 py-1.5 sm:py-1 rounded-full text-[10px] sm:text-xs flex items-center gap-1.5 sm:gap-2 border border-white/20 hover:bg-white/30 transition-all">
              <span className="text-sm sm:text-base">🤖</span>
              <span className="font-medium">AI Powered</span>
            </span>
            <span className="bg-white/20 backdrop-blur-md px-2.5 sm:px-3 py-1.5 sm:py-1 rounded-full text-[10px] sm:text-xs flex items-center gap-1.5 sm:gap-2 border border-white/20 hover:bg-white/30 transition-all">
              <span className="text-sm sm:text-base">⚡</span>
              <span className="font-medium">Fast Charging</span>
            </span>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default AnimationRobot;
