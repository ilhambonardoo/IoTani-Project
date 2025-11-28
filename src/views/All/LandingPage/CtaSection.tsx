import { motion } from "framer-motion";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { LuArrowRight, LuSparkles } from "react-icons/lu";

const CtaSection = () => {
  return (
    <section className="relative py-20 md:py-28 bg-gradient-to-b from-neutral-50 via-green-50/50 to-neutral-50 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-green-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        className="container relative mx-auto px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-600 via-emerald-600 to-green-700 p-8 shadow-2xl md:p-12 lg:p-16 lg:flex lg:items-center lg:justify-between lg:gap-16">
          {/* Background pattern */}
          <div className="absolute inset-0 z-0 opacity-10">
            <Image
              src="/gambar_tambahan/robot.jpg"
              alt="Background pattern"
              fill
              className="object-cover grayscale"
            />
          </div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.2)_100%)]" />

          {/* Content */}
          <div className="relative z-10 text-white lg:w-[52%]">
            <motion.div
              className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <LuSparkles className="text-yellow-300" size={18} />
              <span className="text-sm font-semibold">Mulai Sekarang</span>
            </motion.div>

            <motion.h2
              className="mb-6 text-4xl font-extrabold leading-tight md:text-5xl lg:text-6xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              Tingkatkan Hasil Panen Cabai Anda{" "}
              <span className="bg-gradient-to-r from-yellow-300 to-yellow-100 bg-clip-text text-transparent">
                Sekarang!
              </span>
            </motion.h2>
            
            <motion.p
              className="mb-10 text-lg md:text-xl leading-relaxed text-white/95 max-w-2xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              Sistem IoTani kami dengan AI dan Robotik siap membantu Anda
              mengoptimalkan pertumbuhan cabai, memantau kondisi tanah secara
              real-time, dan mengambil keputusan cerdas untuk pertanian yang
              lebih produktif.
            </motion.p>
            
            <motion.button
              onClick={() => signIn()}
              className="group relative inline-flex items-center gap-3 overflow-hidden rounded-2xl bg-white px-8 py-4 text-lg font-bold text-green-700 shadow-2xl shadow-green-900/30 transition-all duration-300 hover:shadow-green-900/40 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-white/50 cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.6 }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="relative z-10 flex items-center gap-2">
                Mulai Petualangan Bertani Cerdas
                <LuArrowRight className="transition-transform group-hover:translate-x-1" size={24} />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-green-50 to-emerald-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.button>
          </div>

          {/* Image */}
          <motion.div
            className="relative z-10 mt-12 flex justify-center lg:mt-0 lg:w-[48%]"
            initial={{ opacity: 0, x: 50, scale: 0.95 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          >
            <div className="relative w-full max-w-lg">
              <div className="absolute -inset-4 bg-gradient-to-r from-green-400 to-emerald-400 rounded-3xl blur-2xl opacity-30 animate-pulse" />
              <div className="relative rounded-3xl overflow-hidden shadow-2xl ring-4 ring-white/20">
                <Image
                  src="/gambar_tambahan/tanah.jpg"
                  alt="Sistem IoTani untuk Cabai"
                  width={600}
                  height={400}
                  className="w-full h-auto object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default CtaSection;
