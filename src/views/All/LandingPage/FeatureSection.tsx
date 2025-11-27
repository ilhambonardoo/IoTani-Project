import { motion, Variants } from "framer-motion";
import { LuBrainCircuit, LuDroplets, LuLayoutDashboard } from "react-icons/lu";

const FeatureSection = () => {
  const featureContainerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const featureItemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };
  return (
    <section className="py-12 sm:py-16 bg-gradient-to-b from-green-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-12">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-neutral-800">
            Fitur Unggulan Kami
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base sm:text-lg md:text-xl font-semibold text-neutral-600 px-4">
            Dibangun dengan teknologi terkini untuk memberikan hasil presisi dan
            efisiensi maksimal di lahan Anda.
          </p>
        </motion.div>

        <motion.div
          className="mt-12 sm:mt-16 grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-3"
          variants={featureContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div
            className="flex flex-col gap-4 rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            variants={featureItemVariants}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
              <LuLayoutDashboard size={24} />
            </div>
            <h3 className="text-2xl font-semibold text-neutral-800">
              Dashboard Real-time
            </h3>
            <p className="text-neutral-600">
              Pantau data pH, kelembapan, dan suhu tanah secara langsung
              kapanpun dan dimanapun.
            </p>
          </motion.div>

          <motion.div
            className="flex flex-col gap-4 rounded-2xl border border-neutral-200 bg-white p-8 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            variants={featureItemVariants}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
              <LuDroplets size={24} />
            </div>
            <h3 className="text-2xl font-semibold text-neutral-800">
              Kontrol Pompa Otomatis
            </h3>
            <p className="text-neutral-600">
              Sistem irigasi cerdas yang menyiram tanaman secara otomatis
              berdasarkan kondisi kelembapan.
            </p>
          </motion.div>

          <motion.div
            className="flex flex-col gap-4 rounded-2xl border border-neutral-200 bg-white p-8 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            variants={featureItemVariants}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-orange-600">
              <LuBrainCircuit size={24} />
            </div>
            <h3 className="text-2xl font-semibold text-neutral-800">
              Deteksi Tanaman (AI)
            </h3>
            <p className="text-neutral-600">
              Manfaatkan Machine Learning dan Robotik untuk identifikasi kondisi
              tanaman secara presisi.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeatureSection;
