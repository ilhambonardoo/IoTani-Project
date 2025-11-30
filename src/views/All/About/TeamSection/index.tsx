"use client";

import { motion } from "framer-motion";
import Image from "next/legacy/image";

const teamMembers = [
  {
    name: "Malik Raihan Oli`i",
    role: "Robotic and Project Manager",
    image: "/anggota/malik.jpg",
  },
  {
    name: "Ilham Bonardo Marpaung",
    role: "Fullstack Web Developer and Data Analyst",
    image: "/anggota/ilham.jpg",
  },
  {
    name: "Dandi Novian Pratama",
    role: "Publish Specialist",
    image: "/anggota/dandi.jpg",
  },
  {
    name: "Benediktus Aprilian Abimanyu",
    role: "Documentation Specialist",
    image: "/anggota/benediktus.jpg",
  },
];

const TeamSection = () => {
  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8 sm:mb-12 text-center"
        >
          <h2 className="mb-4 text-2xl sm:text-3xl md:text-4xl font-bold text-neutral-800">
            Tim Kami
          </h2>
          <p className="text-base sm:text-lg text-neutral-600">
            Orang-orang di balik IoTani
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2">
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="rounded-2xl bg-white p-6 text-center shadow-lg transition-all hover:shadow-xl"
            >
              <div className="relative mx-auto mb-4 h-62 w-72 overflow-hidden rounded-2xl">
                <Image
                  src={member.image}
                  alt={member.name}
                  layout="fill"
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
  );
};

export default TeamSection;
