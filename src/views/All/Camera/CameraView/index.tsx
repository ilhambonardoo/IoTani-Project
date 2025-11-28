"use client";

import Image from "next/legacy/image";
import Webcam from "react-webcam";
import { FaCamera } from "react-icons/fa";
import type { CameraFeed, MLAnalysisResult } from "@/types";

interface CameraViewProps {
  selectedCamera: CameraFeed;
  isWebcamActive: boolean;
  webcamRef: React.RefObject<Webcam | null>;
  uploadPreview: string | null;
  mlResult: MLAnalysisResult | null;
  onCapture: () => void;
}

const CameraView = ({
  selectedCamera,
  isWebcamActive,
  webcamRef,
  uploadPreview,
  onCapture,
}: CameraViewProps) => {
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-neutral-900 flex items-center justify-center">
      {isWebcamActive ? (
        /* Mode Webcam Aktif */
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          className="h-full w-full object-cover"
          videoConstraints={{ facingMode: "environment" }} // Menggunakan kamera belakang jika di HP
        />
      ) : (
        /* Mode Tampilan Gambar (Upload atau Statis) */
        <Image
          src={uploadPreview || selectedCamera.imageUrl}
          alt={selectedCamera.name}
          layout="fill"
          className="object-cover"
        />
      )}

      {/* Tombol Capture saat Webcam Aktif */}
      {isWebcamActive && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20">
          <button
            onClick={onCapture}
            className="bg-white rounded-full p-4 shadow-lg hover:bg-gray-100 transition-colors ring-4 ring-cyan-500/50"
          >
            <FaCamera className="text-cyan-600 text-2xl" />
          </button>
        </div>
      )}
    </div>
  );
};

export default CameraView;
