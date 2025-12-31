"use client";

import { motion } from "framer-motion";
import { LuCamera, LuBrain, LuZap } from "react-icons/lu";

const features = [
  {
    icon: LuCamera,
    label: "4K Vision",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: LuBrain,
    label: "AI Powered",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: LuZap,
    label: "Fast Charging",
    color: "from-yellow-500 to-orange-500",
  },
];

const AnimationRobot = () => {
  return (
    <section className="relative w-full py-16 sm:py-20 md:py-24 bg-gradient-to-b from-neutral-50 via-white to-neutral-50 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-green-400/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-blue-400/5 rounded-full blur-3xl" />
      </div>

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-12 sm:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.span
            className="inline-block mb-4 text-sm font-semibold text-green-600 uppercase tracking-wider"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            Demo Video
          </motion.span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-neutral-900 tracking-tight mb-4">
            <span className="bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 bg-clip-text text-transparent">
              Robot dalam Aksi
            </span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg sm:text-xl text-neutral-600 leading-relaxed font-medium">
            Lihat bagaimana robot IoTani bekerja secara real-time di lapangan
          </p>
        </motion.div>

        {/* Video Container */}
        <motion.div
          className="relative w-full max-w-6xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        >
          <div className="relative group rounded-3xl overflow-hidden shadow-2xl ring-1 ring-neutral-200/50 bg-neutral-900">
            {/* Glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-green-500/20 via-blue-500/20 to-purple-500/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />

            {/* Video */}
            <div className="relative aspect-video overflow-hidden">
              <video
                src="/video/robot.mp4"
                className="w-full h-full object-cover"
                autoPlay
                muted
                loop
                playsInline
              />
            </div>

            {/* Content Below Video - All devices */}
            <div className="p-6 sm:p-8 md:p-10 space-y-6 sm:space-y-8 bg-gradient-to-b from-neutral-900 via-black to-neutral-900">
              {/* Title */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <h3 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
                  Mini Bot
                  <span className="block text-2xl sm:text-3xl md:text-4xl bg-gradient-to-r from-green-400 via-emerald-400 to-green-300 bg-clip-text text-transparent">
                    IoTani
                  </span>
                </h3>
              </motion.div>

              {/* Description */}
              <motion.p
                className="text-base sm:text-lg md:text-xl text-white/90 leading-relaxed max-w-3xl font-medium"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                Dilengkapi dengan kamera ESP32, pompa air otomatis, dan
                pemrosesan AI real-time untuk monitoring dan kontrol pertanian
                yang cerdas.
              </motion.p>

              {/* Features */}
              <motion.div
                className="flex flex-wrap gap-3 sm:gap-4 pt-2"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <motion.div
                      key={index}
                      className="group/feature relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur-md px-4 py-3 border border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer"
                      whileHover={{ scale: 1.05, y: -2 }}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                    >
                      <div className="relative z-10 flex items-center gap-3">
                        <div
                          className={`p-2 rounded-xl bg-gradient-to-br ${feature.color} shadow-lg`}
                        >
                          <Icon className="text-white" size={20} />
                        </div>
                        <span className="text-sm sm:text-base font-semibold text-white">
                          {feature.label}
                        </span>
                      </div>
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover/feature:opacity-20 transition-opacity duration-300`}
                      />
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AnimationRobot;
