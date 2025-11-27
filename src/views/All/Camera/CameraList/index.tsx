"use client";

import { motion } from "framer-motion";
import type { CameraFeed } from "@/types";

interface CameraListProps {
  cameras: CameraFeed[];
  selectedCamera: CameraFeed | null;
  onSelectCamera: (camera: CameraFeed) => void;
}

const CameraList = ({ cameras, selectedCamera, onSelectCamera }: CameraListProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-4 lg:col-span-1 order-2 lg:order-1"
    >
      <div className="rounded-2xl bg-white p-3 sm:p-4 shadow-lg">
        <h2 className="mb-4 text-lg font-semibold text-neutral-800">
          Kamera Robot
        </h2>
        <div className="space-y-2">
          {cameras.map((camera) => (
            <button
              key={camera.id}
              onClick={() => onSelectCamera(camera)}
              className={`w-full rounded-lg border-2 p-3 text-left transition-all ${
                selectedCamera?.id === camera.id
                  ? "border-green-500 bg-green-50"
                  : "border-neutral-200 bg-white hover:border-green-300"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <span className="text-sm font-medium text-neutral-700 block">
                    {camera.robotName}
                  </span>
                  <span className="text-xs text-neutral-500 mt-1 block">
                    {camera.location}
                  </span>
                  <span className="text-xs text-neutral-400 mt-0.5 block">
                    Kamera terpasang
                  </span>
                </div>
                <div className="flex flex-col items-end gap-1 ml-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      camera.status === "online"
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                  />
                  {camera.hasDetection && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 font-medium">
                      {camera.detectionType === "pest"
                        ? "Hama"
                        : camera.detectionType === "disease"
                        ? "Penyakit"
                        : "Gulma"}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default CameraList;

