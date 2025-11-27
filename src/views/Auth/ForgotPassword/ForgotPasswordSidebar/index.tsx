"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useState, useEffect } from "react";

interface Slide {
  src: string;
  title: string;
  description: string;
}

interface ForgotPasswordSidebarProps {
  slides: Slide[];
  mounted: boolean;
}

const ForgotPasswordSidebar = ({
  slides,
  mounted,
}: ForgotPasswordSidebarProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (!mounted) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 4000);

    return () => clearInterval(timer);
  }, [mounted, slides.length]);

  return (
    <div className="relative hidden lg:flex w-1/2 flex-col justify-between overflow-hidden bg-gradient-to-br from-green-600 to-green-700 p-10 text-white">
      <div className="z-10 text-3xl font-bold">
        IoTani<span className="text-green-200">.</span>
      </div>

      {mounted && (
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
            className="relative z-10"
          >
            <h1 className="mb-4 text-4xl font-bold leading-tight">
              {slides[currentSlide].title}
            </h1>
            <p className="text-xl text-green-50">
              {slides[currentSlide].description}
            </p>
          </motion.div>
        </AnimatePresence>
      )}
      {!mounted && (
        <div className="relative z-10">
          <h1 className="mb-4 text-4xl font-bold leading-tight">
            {slides[0].title}
          </h1>
          <p className="text-xl text-green-50">{slides[0].description}</p>
        </div>
      )}

      <div className="relative z-10 flex space-x-2">
        {slides.map((_, index) => (
          <div
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 w-10 cursor-pointer rounded-full transition-all ${
              currentSlide === index ? "bg-white" : "bg-green-300/50"
            }`}
          ></div>
        ))}
      </div>

      {mounted ? (
        <AnimatePresence mode="wait">
          <motion.img
            key={currentSlide}
            src={slides[currentSlide].src}
            alt={slides[currentSlide].title}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0 z-0 h-full w-full object-cover"
          />
        </AnimatePresence>
      ) : (
        <Image
          src={slides[0].src}
          alt={slides[0].title}
          fill
          className="object-cover"
          priority
        />
      )}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-green-900/40 to-green-800/60"></div>
    </div>
  );
};

export default ForgotPasswordSidebar;

