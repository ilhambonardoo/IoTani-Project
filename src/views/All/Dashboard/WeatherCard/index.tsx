"use client";

import { motion } from "framer-motion";
import { WiDaySunny, WiRain, WiCloudy } from "react-icons/wi";
import type { WeatherData } from "@/types";

interface WeatherCardProps {
  weather: WeatherData;
}

const getWeatherIcon = (condition: string) => {
  switch (condition) {
    case "sunny":
      return <WiDaySunny size={48} className="text-yellow-500" />;
    case "rainy":
      return <WiRain size={48} className="text-blue-500" />;
    case "cloudy":
      return <WiCloudy size={48} className="text-gray-500" />;
    default:
      return <WiDaySunny size={48} className="text-yellow-500" />;
  }
};

const WeatherCard = ({ weather }: WeatherCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-white p-4 sm:p-6 shadow-lg transition-all hover:shadow-xl lg:h-full"
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-neutral-800">Cuaca</h2>
        {getWeatherIcon(weather.condition)}
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-neutral-600">Suhu</span>
          <span className="text-xl font-bold text-neutral-800">
            {weather.temperature}°C
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-neutral-600">Kelembapan</span>
          <span className="text-xl font-bold text-neutral-800">
            {weather.humidity}%
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-neutral-600">Angin</span>
          <span className="text-xl font-bold text-neutral-800">
            {weather.windSpeed} km/h
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default WeatherCard;
