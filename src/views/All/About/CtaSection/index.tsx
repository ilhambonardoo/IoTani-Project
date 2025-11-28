"use client";

import { motion } from "framer-motion";
import { signIn } from "next-auth/react";

const CtaSection = () => {
  return (
    <section className="py-12 sm:py-16 bg-linear-to-r from-green-600 to-green-700">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center text-white lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="mb-4 text-2xl sm:text-3xl md:text-4xl font-bold">
            Bergabunglah dengan Kami
          </h2>
          <p className="mb-6 sm:mb-8 text-base sm:text-lg lg:text-xl text-green-50">
            Mari bersama-sama membangun masa depan pertanian yang lebih baik
            dengan teknologi.
          </p>
          <motion.button
            onClick={() => signIn()}
            className="inline-block rounded-lg cursor-pointer bg-white px-8 py-3 text-lg font-semibold text-green-600 shadow-lg transition-all hover:bg-green-50 hover:shadow-xl"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Mulai Sekarang
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default CtaSection;

