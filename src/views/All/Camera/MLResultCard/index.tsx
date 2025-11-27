"use client";

import { motion } from "framer-motion";
import type { CameraFeed, MLAnalysisResult } from "@/types";

interface MLResultCardProps {
  camera: CameraFeed;
  mlResult: MLAnalysisResult | null;
  isMobile?: boolean;
}

const MLResultCard = ({ camera, mlResult, isMobile = false }: MLResultCardProps) => {
  if (!camera.hasDetection && !mlResult) return null;

  const content = (
    <>
      <h3
        className={`mb-2 ${
          isMobile ? "text-base" : "text-sm"
        } font-semibold ${isMobile ? "text-cyan-800" : "text-cyan-300"}`}
      >
        Hasil Analisis AI
      </h3>
      <div className={`space-y-2 ${isMobile ? "text-sm" : "text-sm"}`}>
        {mlResult ? (
          mlResult.error ? (
            <p className={isMobile ? "text-red-600 font-medium" : "text-red-300"}>
              {mlResult.error}
            </p>
          ) : (
            <>
              <div
                className={`flex justify-between ${
                  isMobile
                    ? "items-center border-b border-cyan-200 pb-2"
                    : "border-b border-white/10 pb-1"
                }`}
              >
                <span className={isMobile ? "text-neutral-600" : "text-white/70"}>
                  Objek
                </span>
                <span
                  className={`font-medium ${
                    isMobile ? "text-neutral-800" : ""
                  }`}
                >
                  {mlResult.objek}
                </span>
              </div>
              <div
                className={`flex justify-between ${
                  isMobile
                    ? "items-center border-b border-cyan-200 pb-2"
                    : "border-b border-white/10 pb-1"
                }`}
              >
                <span className={isMobile ? "text-neutral-600" : "text-white/70"}>
                  Diagnosa
                </span>
                <span
                  className={`font-medium ${
                    isMobile ? "text-yellow-600" : "text-yellow-300"
                  }`}
                >
                  {mlResult.penyakit}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className={isMobile ? "text-neutral-600" : "text-white/70"}>
                  Akurasi
                </span>
                <span
                  className={`font-medium ${
                    isMobile ? "text-green-600" : "text-green-300"
                  }`}
                >
                  {mlResult.confidence}
                </span>
              </div>
            </>
          )
        ) : camera.hasDetection ? (
          <p
            className={
              isMobile ? "text-orange-600 font-medium" : "text-orange-300"
            }
          >
            Deteksi simulasi pada kamera CCTV.
          </p>
        ) : (
          <p className={isMobile ? "text-neutral-500 italic" : "text-white/50 italic"}>
            Menunggu input...
          </p>
        )}
      </div>
    </>
  );

  if (isMobile) {
    return (
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sm:hidden mt-4 w-full rounded-xl border border-cyan-400/30 bg-gradient-to-br from-cyan-50 to-blue-50 p-4 shadow-lg"
      >
        {content}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ x: 16, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="hidden sm:block absolute right-2 sm:right-4 top-4 w-64 rounded-xl border border-cyan-400/30 bg-black/60 p-4 text-white backdrop-blur-md"
    >
      {content}
    </motion.div>
  );
};

export default MLResultCard;

