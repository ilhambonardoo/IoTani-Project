"use client";

import { motion } from "framer-motion";
import Webcam from "react-webcam";
import CameraView from "../CameraView";
import MLResultCard from "../MLResultCard";
import CameraControls from "../CameraControls";
import DetectionAlert from "../DetectionAlert";
import type { CameraFeed, MLAnalysisResult } from "@/types";

interface CameraCardProps {
  camera: CameraFeed;
  isWebcamActive: boolean;
  webcamRef: React.RefObject<Webcam | null>;
  fileRef: React.RefObject<HTMLInputElement | null>;
  uploadPreview: string | null;
  mlResult: MLAnalysisResult | null;
  loading: boolean;
  isRealtime: boolean;
  onCapture: () => void;
  onToggleWebcam: () => void;
  onToggleRealtime: () => void;
  onFilePick: () => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CameraCard = ({
  camera,
  isWebcamActive,
  webcamRef,
  fileRef,
  uploadPreview,
  mlResult,
  loading,
  isRealtime,
  onCapture,
  onToggleWebcam,
  onToggleRealtime,
  onFilePick,
  onFileChange,
}: CameraCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="lg:col-span-3 order-1 lg:order-2"
    >
      <div className="rounded-2xl bg-white p-4 sm:p-6 shadow-lg">
        {/* Header Kartu Kamera */}
        <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-neutral-800">
              {camera.robotName}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600">
              {isWebcamActive
                ? "Live Camera Feed"
                : `Kamera di ${camera.location}`}
            </p>
            <p className="text-xs text-neutral-500 mt-1">
              Kamera terpasang di robot
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium ${
                camera.status === "online"
                  ? "bg-green-100 text-green-800 border border-green-300"
                  : "bg-red-100 text-red-800 border border-red-300"
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  camera.status === "online" ? "bg-green-500" : "bg-red-500"
                }`}
              />
              <span>
                {camera.status === "online" ? "Online" : "Offline"}
              </span>
            </div>
          </div>
        </div>

        {/* Area Tampilan Gambar / Webcam */}
        <div className="relative">
          <CameraView
            selectedCamera={camera}
            isWebcamActive={isWebcamActive}
            webcamRef={webcamRef}
            uploadPreview={uploadPreview}
            mlResult={mlResult}
            onCapture={onCapture}
          />

          {/* Overlay Hasil Deteksi - Desktop Only */}
          {(camera.hasDetection || mlResult) && (
            <MLResultCard camera={camera} mlResult={mlResult} isMobile={false} />
          )}
        </div>

        {/* Hasil Analisis AI - Mobile Only */}
        {(camera.hasDetection || mlResult) && (
          <MLResultCard camera={camera} mlResult={mlResult} isMobile={true} />
        )}

        {/* Control Buttons */}
        <CameraControls
          isWebcamActive={isWebcamActive}
          isRealtime={isRealtime}
          loading={loading}
          mlResult={mlResult}
          fileRef={fileRef}
          onToggleWebcam={onToggleWebcam}
          onToggleRealtime={onToggleRealtime}
          onFilePick={onFilePick}
          onFileChange={onFileChange}
        />

        {/* Alert Box / Detection Info */}
        <DetectionAlert camera={camera} />
      </div>
    </motion.div>
  );
};

export default CameraCard;

