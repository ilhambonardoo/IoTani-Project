"use client";

import { motion } from "framer-motion";
import { HiOutlineSparkles } from "react-icons/hi2";
import { FaRocket } from "react-icons/fa";

const VisionMissionSection = () => {
  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl bg-white p-6 sm:p-8 shadow-lg"
          >
            <div className="mb-4 flex items-center gap-3">
              <HiOutlineSparkles className="text-green-500" size={32} />
              <h2 className="text-2xl font-bold text-neutral-800">Visi</h2>
            </div>
            <p className="text-lg text-neutral-600">
              Menjadi platform smart farming terdepan di Indonesia yang
              memberdayakan petani dengan teknologi IoT, AI, dan robotik untuk
              meningkatkan produktivitas dan keberlanjutan pertanian.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl bg-white p-6 sm:p-8 shadow-lg"
          >
            <div className="mb-4 flex items-center gap-3">
              <FaRocket className="text-blue-500" size={32} />
              <h2 className="text-2xl font-bold text-neutral-800">Misi</h2>
            </div>
            <ul className="space-y-3 text-lg text-neutral-600">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-2 w-2 rounded-full bg-green-500" />
                Menyediakan solusi monitoring real-time untuk kondisi lahan
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-2 w-2 rounded-full bg-green-500" />
                Mengotomatisasi proses irigasi dan perawatan tanaman
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-2 w-2 rounded-full bg-green-500" />
                Menerapkan AI untuk deteksi dini hama dan penyakit
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-2 w-2 rounded-full bg-green-500" />
                Memberikan edukasi dan dukungan kepada petani
              </li>
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default VisionMissionSection;

