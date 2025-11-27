"use client";

import { motion } from "framer-motion";
import { FaUsers, FaLightbulb, FaRocket } from "react-icons/fa";

const values = [
  {
    icon: <FaLightbulb className="text-yellow-500" size={32} />,
    title: "Inovasi",
    description:
      "Terus berinovasi dengan teknologi terdepan untuk pertanian modern",
  },
  {
    icon: <FaUsers className="text-blue-500" size={32} />,
    title: "Kolaborasi",
    description:
      "Bekerja sama dengan petani untuk menciptakan solusi terbaik",
  },
  {
    icon: <FaRocket className="text-green-500" size={32} />,
    title: "Efisiensi",
    description: "Meningkatkan produktivitas dan efisiensi lahan pertanian",
  },
];

const ValuesSection = () => {
  return (
    <section className="py-12 sm:py-16 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8 sm:mb-12 text-center"
        >
          <h2 className="mb-4 text-2xl sm:text-3xl md:text-4xl font-bold text-neutral-800">
            Nilai-Nilai Kami
          </h2>
          <p className="text-base sm:text-lg text-neutral-600">
            Prinsip yang memandu setiap langkah kami
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-3">
          {values.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="rounded-2xl bg-linear-to-br from-neutral-50 to-neutral-100 p-8 text-center shadow-lg transition-all hover:shadow-xl"
            >
              <div className="mb-4 flex justify-center">{value.icon}</div>
              <h3 className="mb-3 text-xl font-semibold text-neutral-800">
                {value.title}
              </h3>
              <p className="text-neutral-600">{value.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValuesSection;

