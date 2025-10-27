import { motion } from "framer-motion";

const CtaSection = () => {
  return (
    <section className="py-24">
      <motion.div
        className="container mx-auto flex flex-col items-center rounded-3xl bg-gradient-to-r from-lime-400 to-lime-500 py-16 px-6 text-center shadow-2xl shadow-lime-400/30"
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <h2 className="text-4xl font-bold text-black md:text-5xl">
          Siap Mengubah Lahan Anda?
        </h2>
        <p className="mt-4 max-w-xl text-lg text-neutral-900">
          Bergabunglah dengan revolusi pertanian cerdas hari ini dan tingkatkan
          panen Anda ke level berikutnya.
        </p>
        <motion.button
          className="mt-10 rounded-lg bg-white px-8 py-3 text-lg font-semibold text-black shadow-lg transition-all duration-300 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-lime-400"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Coba Gratis Sekarang
        </motion.button>
      </motion.div>
    </section>
  );
};

export default CtaSection;
