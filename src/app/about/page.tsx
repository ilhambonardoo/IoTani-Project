"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { FaUsers, FaLightbulb, FaRocket } from "react-icons/fa";
import { HiOutlineSparkles } from "react-icons/hi2";

const AboutPage = () => {
  const teamMembers = [
    {
      name: "Tim IoTani",
      role: "Development Team",
      image: "/cabai/petani.jpg",
    },
  ];

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

  return (
    <div className="min-h-screen bg-linear-to-br from-neutral-50 to-neutral-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-linear-to-br from-green-600 to-green-700 py-20 text-white">
        <div className="absolute inset-0 bg-[url('/gambar_tambahan/iot.jpg')] bg-cover bg-center opacity-10" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="mb-6 text-5xl font-bold lg:text-6xl">
              Tentang IoTani
            </h1>
            <p className="mx-auto max-w-3xl text-xl text-green-50">
              Platform IoT cerdas yang menghubungkan teknologi modern dengan
              pertanian tradisional untuk menciptakan masa depan pertanian yang
              berkelanjutan.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl bg-white p-8 shadow-lg"
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
              className="rounded-2xl bg-white p-8 shadow-lg"
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

      {/* Values */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="mb-4 text-4xl font-bold text-neutral-800">
              Nilai-Nilai Kami
            </h2>
            <p className="text-lg text-neutral-600">
              Prinsip yang memandu setiap langkah kami
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
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

      {/* Team */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="mb-4 text-4xl font-bold text-neutral-800">
              Tim Kami
            </h2>
            <p className="text-lg text-neutral-600">
              Orang-orang di balik IoTani
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="rounded-2xl bg-white p-6 text-center shadow-lg transition-all hover:shadow-xl"
              >
                <div className="relative mx-auto mb-4 h-32 w-32 overflow-hidden rounded-full">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="mb-1 text-xl font-semibold text-neutral-800">
                  {member.name}
                </h3>
                <p className="text-neutral-600">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-linear-to-r from-green-600 to-green-700">
        <div className="mx-auto max-w-4xl px-6 text-center text-white lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-4 text-4xl font-bold">
              Bergabunglah dengan Kami
            </h2>
            <p className="mb-8 text-xl text-green-50">
              Mari bersama-sama membangun masa depan pertanian yang lebih baik
              dengan teknologi.
            </p>
            <motion.a
              href="/login"
              className="inline-block rounded-lg bg-white px-8 py-3 text-lg font-semibold text-green-600 shadow-lg transition-all hover:bg-green-50 hover:shadow-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Mulai Sekarang
            </motion.a>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
