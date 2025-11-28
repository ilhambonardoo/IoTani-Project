"use client";

import { useState, useEffect } from "react";
import {
  generateData,
  generateNewDataPoint,
  type SensorDataPoint,
} from "@/lib/utils/sensorDataGenerator";
import DataHeader from "./DataHeader";
import ImageSlider from "./ImageSlider";
import ZoneInfoCard from "./ZoneInfoCard";
import ChartSection from "./ChartSection";
import type { ZoneData } from "@/types";

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
  const MAX_DATA_POINTS = 30;
  const [mounted, setMounted] = useState(false);
  const [isRealTime, setIsRealTime] = useState(true);

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
  const [zonesData, setZonesData] = useState<Map<string, SensorDataPoint[]>>(
    new Map()
  );

  const selectedZone = zones.find((z) => z.id === selectedZoneId) || zones[0];
  const chartData = zonesData.get(selectedZoneId) || [];

  useEffect(() => {
    setMounted(true);
    const initialData = new Map<string, SensorDataPoint[]>();
    zones.forEach((zone) => {
      initialData.set(zone.id, generateData(7));
    });
    setZonesData(initialData);
  }, [zones]);

  useEffect(() => {
    if (!mounted || !isRealTime) return;

    const interval = setInterval(() => {
      setZonesData((prevData) => {
        const newData = new Map(prevData);
        const currentData = newData.get(selectedZoneId) || [];
        const newDataPoint = generateNewDataPoint();
        const updatedData = [...currentData, newDataPoint];

        const trimmedData =
          updatedData.length > MAX_DATA_POINTS
            ? updatedData.slice(-MAX_DATA_POINTS)
            : updatedData;

        newData.set(selectedZoneId, trimmedData);
        return newData;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [mounted, isRealTime, selectedZoneId]);

  // Image slider
  const [currentIndex, setCurrentIndex] = useState(0);
  const prevSlide = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + sliderImages.length) % sliderImages.length
    );
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % sliderImages.length);
  };

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
  };
  return (
    <div className="min-h-screen bg-linear-to-br from-neutral-50 to-neutral-100 p-4 sm:p-6 lg:p-8 pt-16 md:pt-4">
      <div className="mx-auto max-w-7xl">
        <DataHeader
          zones={zones}
          selectedZoneId={selectedZoneId}
          isRealTime={isRealTime}
          onZoneSelect={setSelectedZoneId}
          onToggleRealTime={() => setIsRealTime(!isRealTime)}
        />

        <div className="space-y-6 my-5">
          <ZoneInfoCard zone={selectedZone} />
          <ChartSection chartData={chartData} mounted={mounted} />
        </div>

        <ImageSlider
          images={sliderImages}
          currentIndex={currentIndex}
          onPrev={prevSlide}
          onNext={nextSlide}
          onDotClick={handleDotClick}
        />
      </div>
    </div>
  );
};

export default RealtimeChartsPage;
