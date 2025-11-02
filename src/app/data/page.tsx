// app/data/page.tsx
"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";

const sliderImages = [
  {
    src: "/cabai/petani.jpg",
    alt: "Petani",
  },
  {
    src: "/gambar_tambahan/robot.jpg",
    alt: "Robotik",
  },
  {
    src: "/gambar_tambahan/tanah.jpg",
    alt: "tanah",
  },
];

export default function DataHomePage() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + sliderImages.length) % sliderImages.length
    );
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % sliderImages.length);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
      className="relative w-full h-[550px] overflow-hidden rounded-2xl"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          className="absolute inset-0 w-full h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
        >
          <Image
            width={2000}
            height={800}
            src={sliderImages[currentIndex].src}
            alt={sliderImages[currentIndex].alt}
            className="w-full h-full object-cover"
            priority
          />
        </motion.div>
      </AnimatePresence>
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-4 z-10 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white transition-all hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-lime-400"
        aria-label="Previous slide"
      >
        <LuChevronLeft size={24} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-4 z-10 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white transition-all hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-lime-400"
        aria-label="Next slide"
      >
        <LuChevronRight size={24} />
      </button>

      <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {sliderImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2 w-2 rounded-full transition-all
              ${
                index === currentIndex
                  ? "w-4 bg-lime-400"
                  : "bg-white/50 hover:bg-white/80"
              }
            `}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </motion.div>
  );
}
