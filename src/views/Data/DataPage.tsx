"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";
import Image from "next/legacy/image";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { AnimatedChart } from "@/components/AnimatedChart";
import { generateData, generateNewDataPoint, type SensorDataPoint } from "@/lib/utils/sensorDataGenerator";

interface ZoneData {
  id: string;
  name: string;
  location: string;
  status: "online" | "offline";
  chartData: SensorDataPoint[];
}

// Image slider
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

const RealtimeChartsPage = () => {
  const MAX_DATA_POINTS = 30; // Maksimal 30 data point
  const [mounted, setMounted] = useState(false);
  const [isRealTime, setIsRealTime] = useState(true);
  
  // Data untuk setiap zona
  const [zones] = useState<ZoneData[]>([
    {
      id: "1",
      name: "Zona A",
      location: "Lahan Utara",
      status: "online",
      chartData: [],
    },
    {
      id: "2",
      name: "Zona B",
      location: "Lahan Selatan",
      status: "online",
      chartData: [],
    },
    {
      id: "3",
      name: "Zona C",
      location: "Lahan Timur",
      status: "online",
      chartData: [],
    },
    {
      id: "4",
      name: "Zona D",
      location: "Lahan Barat",
      status: "online",
      chartData: [],
    },
  ]);

  const [selectedZoneId, setSelectedZoneId] = useState<string>(zones[0].id);
  const [zonesData, setZonesData] = useState<Map<string, SensorDataPoint[]>>(new Map());

  const selectedZone = zones.find((z) => z.id === selectedZoneId) || zones[0];
  const chartData = zonesData.get(selectedZoneId) || [];

  // Initialize dengan data untuk semua zona
  useEffect(() => {
    setMounted(true);
    const initialData = new Map<string, SensorDataPoint[]>();
    zones.forEach((zone) => {
      initialData.set(zone.id, generateData(7));
    });
    setZonesData(initialData);
  }, [zones]);

  // Real-time data update untuk zona yang dipilih
  useEffect(() => {
    if (!mounted || !isRealTime) return;

    const interval = setInterval(() => {
      setZonesData((prevData) => {
        const newData = new Map(prevData);
        const currentData = newData.get(selectedZoneId) || [];
        const newDataPoint = generateNewDataPoint();
        const updatedData = [...currentData, newDataPoint];
        
        // Keep only the last MAX_DATA_POINTS data points
        const trimmedData = updatedData.length > MAX_DATA_POINTS 
          ? updatedData.slice(-MAX_DATA_POINTS) 
          : updatedData;
        
        newData.set(selectedZoneId, trimmedData);
        return newData;
      });
    }, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, [mounted, isRealTime, selectedZoneId]);

  // fiture slide
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
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 p-4 sm:p-6 lg:p-8 pt-16 md:pt-4">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <div className="w-full sm:w-auto">
              <h1 className="text-2xl sm:text-3xl font-bold text-neutral-800 lg:text-4xl text-center sm:text-left">
                Grafik Real-time
              </h1>
              <p className="mt-2 text-sm sm:text-base text-neutral-600 text-center sm:text-left">
                Visualisasi data historis sensor lahan Anda
              </p>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
              {isRealTime && (
                <div className="flex items-center gap-2 rounded-full bg-green-100 px-4 py-2">
                  <div className="h-2 w-2 animate-pulse rounded-full bg-green-500"></div>
                  <span className="text-sm font-medium text-green-700">
                    Live
                  </span>
                </div>
              )}
              <button
                onClick={() => setIsRealTime(!isRealTime)}
                className={`rounded-lg px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold transition-all ${
                  isRealTime
                    ? "bg-red-100 text-red-700 hover:bg-red-200"
                    : "bg-green-100 text-green-700 hover:bg-green-200"
                }`}
              >
                {isRealTime ? "Pause" : "Resume"}
              </button>
            </div>
          </div>
          
          {/* Zone Selector */}
          <div className="flex flex-wrap gap-2">
            {zones.map((zone) => (
              <button
                key={zone.id}
                onClick={() => setSelectedZoneId(zone.id)}
                className={`rounded-lg border-2 px-4 py-2 text-sm font-medium transition-all ${
                  selectedZoneId === zone.id
                    ? "border-green-500 bg-green-50 text-green-700"
                    : "border-neutral-200 bg-white text-neutral-700 hover:border-green-300"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>{zone.name}</span>
                  <div
                    className={`h-2 w-2 rounded-full ${
                      zone.status === "online" ? "bg-green-500" : "bg-red-500"
                    }`}
                  />
                </div>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Slide Image */}
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
                src={sliderImages[currentIndex].src}
                alt={sliderImages[currentIndex].alt}
                className="w-full h-full object-cover"
                priority
              />
            </motion.div>
          </AnimatePresence>
          <button
            onClick={prevSlide}
            className="absolute cursor-pointer top-1/2 left-4 z-10 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white transition-all hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-lime-400"
            aria-label="Previous slide"
          >
            <LuChevronLeft size={24} />
          </button>
          <button
            onClick={nextSlide}
            className="absolute cursor-pointer top-1/2 right-4 z-10 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white transition-all hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-lime-400"
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

        {/* Charts Grid */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl bg-white p-4 sm:p-6 shadow-lg"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-neutral-800">
                Sensor {selectedZone.name} - {selectedZone.location}
              </h2>
              <div className="flex items-center gap-2">
                <div
                  className={`h-2 w-2 rounded-full ${
                    selectedZone.status === "online" ? "bg-green-500" : "bg-red-500"
                  }`}
                />
                <span className="text-xs text-neutral-600">
                  {selectedZone.status === "online" ? "Online" : "Offline"}
                </span>
              </div>
            </div>
          </motion.div>

          <AnimatedChart
            title="📊 Suhu Tanah"
            data={mounted ? chartData : []}
            animationSpeed="slow"
            lines={[
              {
                key: "suhu",
                color: "#3b82f6",
                name: "Suhu (°C)",
              },
            ]}
          />

          <AnimatedChart
            title="💧 Kelembapan Tanah"
            data={mounted ? chartData : []}
            animationSpeed="slow"
            lines={[
              {
                key: "kelembapan",
                color: "#22c55e",
                name: "Kelembapan (%)",
              },
            ]}
          />

          <AnimatedChart
            title="🧪 pH Tanah"
            data={mounted ? chartData : []}
            animationSpeed="slow"
            lines={[
              {
                key: "pH",
                color: "#f97316",
                name: "pH",
              },
            ]}
          />

          <AnimatedChart
            title="📈 Semua Data"
            data={mounted ? chartData : []}
            animationSpeed="slow"
            lines={[
              {
                key: "suhu",
                color: "#3b82f6",
                name: "Suhu (°C)",
              },
              {
                key: "kelembapan",
                color: "#22c55e",
                name: "Kelembapan (%)",
              },
              {
                key: "pH",
                color: "#f97316",
                name: "pH",
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default RealtimeChartsPage;
