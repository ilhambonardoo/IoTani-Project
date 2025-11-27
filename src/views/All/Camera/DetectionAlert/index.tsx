"use client";

import { motion } from "framer-motion";
import { FaExclamationTriangle } from "react-icons/fa";
import type { CameraFeed } from "@/types";

interface DetectionAlertProps {
  camera: CameraFeed;
}

const DetectionAlert = ({ camera }: DetectionAlertProps) => {
  if (!camera.hasDetection) return null;

  const detectionTypeText =
    camera.detectionType === "pest"
      ? "hama"
      : camera.detectionType === "disease"
      ? "penyakit"
      : "gulma";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-4 rounded-lg bg-orange-50 border border-orange-200 p-4"
    >
      <div className="flex items-start gap-3">
        <FaExclamationTriangle
          className="text-orange-500 mt-0.5"
          size={20}
        />
        <div>
          <h3 className="font-semibold text-orange-800">
            Peringatan Deteksi
          </h3>
          <p className="mt-1 text-sm text-orange-700">
            AI telah mendeteksi {detectionTypeText} pada area ini. Disarankan
            untuk melakukan pengecekan lebih lanjut.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default DetectionAlert;

