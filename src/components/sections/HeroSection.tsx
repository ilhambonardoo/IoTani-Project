import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { LuArrowLeft, LuArrowRight } from "react-icons/lu";

const galleryImages = [
  {
    id: "cabai1",
    src: "/cabai1.jpg",
    alt: "Gambar Tanaman Cabai 1",
  },
  {
    id: "cabai2",
    src: "/cabai2.jpg",
    alt: "Gambar Tanaman Cabai 2",
  },
  {
    id: "cabai3",
    src: "/cabai3.jpg",
    alt: "Gambar Tanaman Cabai 3",
  },
];

const HeroSection = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const prevImage = () => {
    setCurrentImageIndex(
      (prevIndex) =>
        (prevIndex - 1 + galleryImages.length) % galleryImages.length
    );
  };
  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % galleryImages.length);
  };
  return (
    <section className="container  mx-auto flex min-h-screen flex-col items-center justify-center gap-12 py-20 px-6 lg:flex-row lg:justify-between lg:gap-20 lg:px-20">
      <motion.div
        className="flex w-full flex-col items-center text-center lg:w-1/2 lg:items-start lg:text-left "
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      >
        <span className="mb-4 rounded-full bg-stone-100/10 px-4 py-1 text-sm font-medium text-stone-300 ring-1 ring-stone-400/30">
          Sistem Pengukuran pH dan Kelembapan Tanah
        </span>

        <h1 className="text-5xl font-bold leading-tight text-white md:text-7xl">
          IoTani
          <span className="text-stone-400 animate-pulse">.</span>
        </h1>

        <p className="mt-6 text-lg text-gray-300 md:text-xl max-w-lg">
          Solusi berbasis web untuk kontrol pompa otomatis dan deteksi tanaman
          menggunakan AI.
        </p>

        <motion.button
          className="mt-10 rounded-lg bg-white px-8 py-3 text-lg font-semibold text-black shadow-lg shadow-stone-400/20 transition-all duration-300 hover:bg-stone-200 hover:shadow-xl hover:shadow-stone-300/30 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-black"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Mulai Sekarang
        </motion.button>
      </motion.div>

      <div className="flex w-full max-w-md flex-col items-center lg:w-1/2 ">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImageIndex}
            className="w-full"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <Image
              src={galleryImages[currentImageIndex].src}
              alt={galleryImages[currentImageIndex].alt}
              width={700}
              height={700}
              className="rounded-3xl  shadow-gray-950/60"
              priority
            />
          </motion.div>
        </AnimatePresence>

        <div className="mt-8 flex w-full justify-center gap-4">
          <motion.button
            onClick={prevImage}
            className="rounded-full bg-gray-800 p-4 text-white transition-colors hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Gambar sebelumnya"
          >
            <LuArrowLeft size={20} />
          </motion.button>
          <motion.button
            onClick={nextImage}
            className="rounded-full bg-gray-800 p-4 text-white transition-colors hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Gambar berikutnya"
          >
            <LuArrowRight size={20} />
          </motion.button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
