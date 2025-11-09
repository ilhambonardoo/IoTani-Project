import { motion } from "framer-motion";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { LuArrowRight } from "react-icons/lu";

const CtaSection = () => {
  return (
    <section className="bg-gradient-to-b from-neutral-50 to-green-50 py-16 md:py-24">
      <motion.div
        className="container mx-auto px-4"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-600 to-green-700 p-8 shadow-2xl md:p-12 lg:flex lg:items-center lg:justify-between lg:gap-12">
          <div className="absolute inset-0 z-0 opacity-10">
            <Image
              src="/gambar_tambahan/robot.jpg"
              alt="Background pattern"
              layout="fill"
              objectFit="cover"
              className="grayscale"
            />
          </div>

          <div className="relative z-10 text-white lg:w-1/2">
            <h2 className="mb-4 text-3xl font-extrabold leading-tight md:text-5xl">
              Tingkatkan Hasil Panen Cabai Anda Sekarang!
            </h2>
            <p className="mb-8 text-lg opacity-90 md:text-xl">
              Sistem iOTani kami dengan AI dan Robotik siap membantu Anda
              mengoptimalkan pertumbuhan cabai, memantau kondisi tanah secara
              real-time, dan mengambil keputusan cerdas untuk pertanian yang
              lebih produktif.
            </p>
            <motion.a
              onClick={() => signIn()}
              className="inline-flex items-center rounded-full bg-white px-8 py-3 text-lg font-bold text-green-700 shadow-lg transition-all duration-300 hover:bg-green-50 hover:scale-105"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Mulai Petualangan Bertani Cerdas{" "}
              <LuArrowRight className="ml-2" size={24} />
            </motion.a>
          </div>

          <motion.div
            className="relative z-10 mt-10 flex justify-center lg:mt-0 lg:w-1/2"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          >
            <Image
              src="/gambar_tambahan/tanah.jpg"
              alt="Sistem iOTani untuk Cabai"
              width={500}
              height={350}
              objectFit="cover"
              className="rounded-2xl shadow-xl ring-4 ring-white ring-opacity-30 md:w-[500px] md:h-[350px] lg:w-[600px] lg:h-[400px]"
            />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default CtaSection;
