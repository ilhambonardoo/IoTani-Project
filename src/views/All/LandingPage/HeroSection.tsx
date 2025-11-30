import { AnimatePresence, motion } from "framer-motion";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LuArrowLeft, LuArrowRight } from "react-icons/lu";

const galleryImages = [
  {
    id: "cabai1",
    src: "/cabai/cabai1.jpg",
    alt: "Gambar Tanaman Cabai 1",
  },
  {
    id: "cabai2",
    src: "/cabai/cabai2.jpg",
    alt: "Gambar Tanaman Cabai 2",
  },
  {
    id: "cabai3",
    src: "/cabai/cabai3.jpg",
    alt: "Gambar Tanaman Cabai 3",
  },
];

const HeroSection = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { push } = useRouter();

  // Auto-rotate images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(
        (prevIndex) => (prevIndex + 1) % galleryImages.length
      );
    }, 5000);
    return () => clearInterval(interval);
  }, []);

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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-neutral-50 via-green-50/30 to-neutral-50">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-400/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-green-500/10 rounded-full blur-3xl" />
      </div>

      <div className="container relative mx-auto flex flex-col items-center justify-center gap-12 sm:gap-16 py-16 sm:py-20 px-4 sm:px-6 lg:flex-row lg:justify-between lg:gap-16 lg:px-8 xl:px-20">
        <motion.div
          className="flex w-full flex-col items-center text-center lg:w-[48%] lg:items-start lg:text-left"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.h1
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold leading-[1.1] text-neutral-900 tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <span className="bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 bg-clip-text text-transparent">
              IoTani
            </span>
            <span className="text-green-500 animate-pulse">.</span>
          </motion.h1>

          <motion.p
            className="mt-6 text-lg sm:text-xl md:text-2xl text-neutral-600 leading-relaxed max-w-2xl font-medium"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Sistem Pengukuran pH dan Kelembapan Tanah dengan Kontrol Pompa
            Otomatis Berbasis Web dan Machine Learning pada Tanaman Cabai
          </motion.p>

          <motion.div
            className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-4 w-full sm:w-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <motion.button
              className="group relative w-full sm:w-auto rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-green-500/30 transition-all duration-300 hover:from-green-700 hover:to-emerald-700 hover:shadow-xl hover:shadow-green-500/40 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 cursor-pointer overflow-hidden"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => signIn()}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Login
                <LuArrowRight
                  className="transition-transform group-hover:translate-x-1"
                  size={18}
                />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-green-700 to-emerald-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.button>
            <motion.button
              className="group w-full sm:w-auto rounded-xl border-2 border-green-600 bg-white/80 backdrop-blur-sm px-8 py-4 text-base font-semibold text-green-700 shadow-md transition-all duration-300 hover:bg-green-50 hover:border-green-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 cursor-pointer"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => push("/about")}
            >
              Tentang Kami
            </motion.button>
          </motion.div>
        </motion.div>

        <motion.div
          className="relative flex w-full max-w-lg flex-col items-center lg:w-[48%]"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl ring-1 ring-neutral-200/50">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentImageIndex}
                className="absolute inset-0"
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                <Image
                  src={galleryImages[currentImageIndex].src}
                  alt={galleryImages[currentImageIndex].alt}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </motion.div>
            </AnimatePresence>

            {/* Gradient overlay for better text contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
          </div>

          {/* Navigation controls */}
          <div className="mt-6 flex items-center justify-center gap-4">
            <motion.button
              onClick={prevImage}
              className="rounded-full bg-white p-3 text-green-600 shadow-lg ring-1 ring-neutral-200 transition-all duration-200 hover:bg-green-50 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 cursor-pointer"
              whileHover={{ scale: 1.1, x: -2 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Gambar sebelumnya"
            >
              <LuArrowLeft size={20} />
            </motion.button>

            {/* Image indicators */}
            <div className="flex items-center gap-2">
              {galleryImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    index === currentImageIndex
                      ? "w-8 bg-green-600"
                      : "w-2 bg-neutral-300 hover:bg-neutral-400"
                  }`}
                  aria-label={`Gambar ${index + 1}`}
                />
              ))}
            </div>

            <motion.button
              onClick={nextImage}
              className="rounded-full bg-white p-3 text-green-600 shadow-lg ring-1 ring-neutral-200 transition-all duration-200 hover:bg-green-50 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 cursor-pointer"
              whileHover={{ scale: 1.1, x: 2 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Gambar berikutnya"
            >
              <LuArrowRight size={20} />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
