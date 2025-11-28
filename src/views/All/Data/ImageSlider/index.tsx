"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/legacy/image";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";

interface SliderImage {
  src: string;
  alt: string;
}

interface ImageSliderProps {
  images: SliderImage[];
  currentIndex: number;
  onPrev: () => void;
  onNext: () => void;
  onDotClick: (index: number) => void;
}

const ImageSlider = ({
  images,
  currentIndex,
  onPrev,
  onNext,
  onDotClick,
}: ImageSliderProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
      className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[550px] overflow-hidden rounded-2xl mb-6 sm:mb-10"
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
            src={images[currentIndex].src}
            alt={images[currentIndex].alt}
            className="w-full h-full object-cover"
            priority
          />
        </motion.div>
      </AnimatePresence>
      <button
        onClick={onPrev}
        className="absolute cursor-pointer top-1/2 left-4 z-10 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white transition-all hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-lime-400"
        aria-label="Previous slide"
      >
        <LuChevronLeft size={24} />
      </button>
      <button
        onClick={onNext}
        className="absolute cursor-pointer top-1/2 right-4 z-10 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white transition-all hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-lime-400"
        aria-label="Next slide"
      >
        <LuChevronRight size={24} />
      </button>

      <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => onDotClick(index)}
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
};

export default ImageSlider;

