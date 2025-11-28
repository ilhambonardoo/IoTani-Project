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
      className="relative w-full h-[250px] min-[375px]:h-[300px] sm:h-[400px] md:h-[500px] lg:h-[550px] xl:h-[600px] overflow-hidden rounded-lg sm:rounded-2xl mb-4 sm:mb-6 md:mb-10"
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
            className="w-full h-full object-cover rounded-lg sm:rounded-2xl "
            priority
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1280px"
          />
        </motion.div>
      </AnimatePresence>
      <div className="absolute bottom-30 left-20 right-20">
      <button
        onClick={onPrev}
        className="absolute cursor-pointer top-1/2 left-2 sm:left-4 z-10 -translate-y-1/2 rounded-full bg-black/40 hover:bg-black/60 active:bg-black/70 p-1.5 sm:p-2 text-white transition-all focus:outline-none focus:ring-2 focus:ring-lime-400 touch-manipulation"
        aria-label="Previous slide"
      >
        <LuChevronLeft className="w-4 h-4 sm:w-6 sm:h-6" />
      </button>
      <button
        onClick={onNext}
        className="absolute cursor-pointer top-1/2 right-2 sm:right-4 z-10 -translate-y-1/2 rounded-full bg-black/40 hover:bg-black/60 active:bg-black/70 p-1.5 sm:p-2 text-white transition-all focus:outline-none focus:ring-2 focus:ring-lime-400 touch-manipulation"
        aria-label="Next slide"
      >
        <LuChevronRight className="w-4 h-4 sm:w-6 sm:h-6" />
      </button>
      </div>

      <div className="absolute bottom-30 sm:bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-1.5 sm:gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => onDotClick(index)}
            className={`h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full transition-all touch-manipulation
              ${
                index === currentIndex
                  ? "w-3 sm:w-4 bg-lime-400"
                  : "bg-white/50 hover:bg-white/80 active:bg-white"
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

