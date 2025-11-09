"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Image from "next/image";
import { FaVideo, FaExclamationTriangle } from "react-icons/fa";
import { IoMdRefresh } from "react-icons/io";

interface CameraFeed {
  id: string;
  name: string;
  location: string;
  status: "online" | "offline";
  hasDetection: boolean;
  detectionType?: "pest" | "disease" | "weed";
  imageUrl: string;
}

const CameraPage = () => {
  const [cameras] = useState<CameraFeed[]>([
    {
      id: "1",
      name: "Kamera Zona A",
      location: "Lahan Utara",
      status: "online",
      hasDetection: true,
      detectionType: "pest",
      imageUrl: "/cabai/cabai1.jpg",
    },
    {
      id: "2",
      name: "Kamera Zona B",
      location: "Lahan Selatan",
      status: "online",
      hasDetection: false,
      imageUrl: "/cabai/cabai2.jpg",
    },
    {
      id: "3",
      name: "Kamera Zona C",
      location: "Lahan Timur",
      status: "online",
      hasDetection: true,
      detectionType: "disease",
      imageUrl: "/cabai/cabai3.jpg",
    },
    {
      id: "4",
      name: "Kamera Zona D",
      location: "Lahan Barat",
      status: "offline",
      hasDetection: false,
      imageUrl: "/cabai/cabai4.jpg",
    },
  ]);

  const [selectedCamera, setSelectedCamera] = useState<CameraFeed | null>(
    cameras[0]
  );

  const getDetectionColor = (type?: string) => {
    switch (type) {
      case "pest":
        return "bg-red-500";
      case "disease":
        return "bg-orange-500";
      case "weed":
        return "bg-yellow-500";
      default:
        return "bg-green-500";
    }
  };

  const getDetectionText = (type?: string) => {
    switch (type) {
      case "pest":
        return "Hama Terdeteksi";
      case "disease":
        return "Penyakit Terdeteksi";
      case "weed":
        return "Gulma Terdeteksi";
      default:
        return "Normal";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-neutral-800 lg:text-4xl">
            Kamera Pendeteksi
          </h1>
          <p className="mt-2 text-neutral-600">
            Pantau lahan Anda secara real-time dengan AI detection
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          {/* Camera List */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4 lg:col-span-1"
          >
            <div className="rounded-2xl bg-white p-4 shadow-lg">
              <h2 className="mb-4 text-lg font-semibold text-neutral-800">
                Daftar Kamera
              </h2>
              <div className="space-y-2">
                {cameras.map((camera) => (
                  <button
                    key={camera.id}
                    onClick={() => setSelectedCamera(camera)}
                    className={`w-full rounded-lg border-2 p-3 text-left transition-all ${
                      selectedCamera?.id === camera.id
                        ? "border-green-500 bg-green-50"
                        : "border-neutral-200 bg-white hover:border-green-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className={`h-2 w-2 rounded-full ${
                            camera.status === "online"
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                        />
                        <span className="text-sm font-medium text-neutral-700">
                          {camera.name}
                        </span>
                      </div>
                      {camera.hasDetection && (
                        <FaExclamationTriangle className="text-orange-500" size={16} />
                      )}
                    </div>
                    <p className="mt-1 text-xs text-neutral-500">
                      {camera.location}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Main Camera View */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-3"
          >
            {selectedCamera && (
              <div className="rounded-2xl bg-white p-6 shadow-lg">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-neutral-800">
                      {selectedCamera.name}
                    </h2>
                    <p className="text-sm text-neutral-600">
                      {selectedCamera.location}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className={`rounded-full px-3 py-1 text-xs font-medium text-white ${
                        selectedCamera.status === "online"
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    >
                      {selectedCamera.status === "online" ? "Online" : "Offline"}
                    </div>
                    <button className="rounded-lg bg-blue-500 p-2 text-white transition-all hover:bg-blue-600">
                      <IoMdRefresh size={20} />
                    </button>
                  </div>
                </div>

                {/* Camera Feed */}
                <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-neutral-900">
                  <Image
                    src={selectedCamera.imageUrl}
                    alt={selectedCamera.name}
                    fill
                    className="object-cover"
                  />
                  
                  {/* AI Detection Overlay */}
                  {selectedCamera.hasDetection && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <div className="absolute inset-0 bg-red-500/20" />
                      <div
                        className={`relative rounded-lg ${getDetectionColor(
                          selectedCamera.detectionType
                        )} px-6 py-3 text-white shadow-xl`}
                      >
                        <div className="flex items-center gap-2">
                          <FaExclamationTriangle size={20} />
                          <span className="font-semibold">
                            {getDetectionText(selectedCamera.detectionType)}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Live Indicator */}
                  {selectedCamera.status === "online" && (
                    <div className="absolute top-4 right-4 flex items-center gap-2 rounded-full bg-black/50 px-3 py-1.5 text-white">
                      <div className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
                      <span className="text-xs font-medium">LIVE</span>
                    </div>
                  )}
                </div>

                {/* Detection Info */}
                {selectedCamera.hasDetection && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 rounded-lg bg-orange-50 border border-orange-200 p-4"
                  >
                    <div className="flex items-start gap-3">
                      <FaExclamationTriangle className="text-orange-500 mt-0.5" size={20} />
                      <div>
                        <h3 className="font-semibold text-orange-800">
                          Peringatan Deteksi
                        </h3>
                        <p className="mt-1 text-sm text-orange-700">
                          AI telah mendeteksi{" "}
                          {selectedCamera.detectionType === "pest"
                            ? "hama"
                            : selectedCamera.detectionType === "disease"
                            ? "penyakit"
                            : "gulma"}{" "}
                          pada area ini. Disarankan untuk melakukan pengecekan
                          lebih lanjut.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CameraPage;

