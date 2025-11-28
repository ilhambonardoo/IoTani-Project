"use client";

import { FaVideo, FaCamera } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import type { MLAnalysisResult } from "@/types";

interface CameraControlsProps {
  isWebcamActive: boolean;
  isRealtime: boolean;
  loading: boolean;
  mlResult: MLAnalysisResult | null;
  fileRef: React.RefObject<HTMLInputElement | null>;
  onToggleWebcam: () => void;
  onToggleRealtime: () => void;
  onFilePick: () => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CameraControls = ({
  isWebcamActive,
  isRealtime,
  loading,
  mlResult,
  fileRef,
  onToggleWebcam,
  onToggleRealtime,
  onFilePick,
  onFileChange,
}: CameraControlsProps) => {
  return (
    <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        {/* Tombol Buka/Tutup Kamera */}
        {!isWebcamActive ? (
          <button
            onClick={onToggleWebcam}
            className="flex items-center gap-2 rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-600"
          >
            <FaVideo /> Buka Kamera
          </button>
        ) : (
          <button
            onClick={onToggleWebcam}
            className="flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600"
          >
            <IoMdClose /> Tutup Kamera
          </button>
        )}

        {/* TOMBOL BARU: Toggle Realtime (Hanya muncul jika kamera aktif) */}
        {isWebcamActive && (
          <button
            onClick={onToggleRealtime}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
              isRealtime
                ? "bg-green-500 text-white hover:bg-green-600 animate-pulse"
                : "bg-neutral-200 text-neutral-700 hover:bg-neutral-300"
            }`}
          >
            {isRealtime ? (
              <>
                <span className="h-2 w-2 rounded-full bg-white animate-ping" />
                Stop Auto-Detect
              </>
            ) : (
              <>
                <FaCamera /> Auto-Detect
              </>
            )}
          </button>
        )}

        {/* Tombol Upload (Sembunyikan jika sedang mode Webcam biar rapi) */}
        {!isWebcamActive && (
          <>
            <button
              onClick={onFilePick}
              disabled={loading}
              className="rounded-lg bg-neutral-200 px-4 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-300 disabled:opacity-50"
            >
              Upload File
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onFileChange}
            />
          </>
        )}
      </div>

      <div className="text-sm font-medium text-cyan-600">
        {loading ? (
          <span className="animate-pulse">
            {isRealtime ? "Menganalisis Stream..." : "Sedang Menganalisis..."}
          </span>
        ) : mlResult ? (
          <span className="text-green-600">Update Terkini ✓</span>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default CameraControls;

