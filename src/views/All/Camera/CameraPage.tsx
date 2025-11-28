"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import Webcam from "react-webcam";
import CameraHeader from "./CameraHeader";
import CameraList from "./CameraList";
import CameraCard from "./CameraCard";
import {
  dataURLtoFile,
  testServerConnection,
  analyzeImage,
} from "@/lib/utils/machine-learning";
import type { MLAnalysisResult, CameraFeed } from "@/types";


const CameraPage = () => {
  const [cameras] = useState<CameraFeed[]>([
    {
      id: "1",
      name: "Kamera Robot Semprot A",
      robotName: "Robot Semprot A",
      robotId: "1",
      location: "Zona A",
      status: "online",
      hasDetection: true,
      detectionType: "pest",
      imageUrl: "/cabai/cabai1.jpg",
    },
    {
      id: "2",
      name: "Kamera Robot Siram B",
      robotName: "Robot Siram B",
      robotId: "2",
      location: "Zona B",
      status: "online",
      hasDetection: false,
      imageUrl: "/cabai/cabai1.jpg",
    },
    {
      id: "3",
      name: "Kamera Robot Semprot C",
      robotName: "Robot Semprot C",
      robotId: "3",
      location: "Stasiun Pengisian",
      status: "online",
      hasDetection: true,
      detectionType: "disease",
      imageUrl: "/cabai/cabai1.jpg",
    },
  ]);

  const [selectedCamera, setSelectedCamera] = useState<CameraFeed | null>(
    cameras[0]
  );
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [mlResult, setMlResult] = useState<MLAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [serverStatus, setServerStatus] = useState<{
    connected: boolean;
    message: string;
  } | null>(null);

  // State untuk Webcam
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const webcamRef = useRef<Webcam>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [isRealtime, setIsRealtime] = useState(false);
  const isProcessingRef = useRef(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Check server connection on mount
  useEffect(() => {
    const checkServer = async () => {
      const status = await testServerConnection();
      setServerStatus(status);
    };
    checkServer();
    // Check every 10 seconds
    const interval = setInterval(checkServer, 10000);
    return () => clearInterval(interval);
  }, []);

  const onPick = () => fileRef.current?.click();

  const handleSelectCamera = (camera: CameraFeed) => {
    setSelectedCamera(camera);
    setUploadPreview(null);
    setMlResult(null);
    setIsWebcamActive(false);
  };

  const handleToggleWebcam = () => {
    if (isWebcamActive) {
      setIsWebcamActive(false);
      setIsRealtime(false);
    } else {
      setIsWebcamActive(true);
      setUploadPreview(null);
      setMlResult(null);
    }
  };

  const handleAnalysis = async (file: File) => {
    setLoading(true);
    setMlResult(null);
    try {
      // Check server connection first
      const serverCheck = await testServerConnection();
      if (!serverCheck.connected) {
        setMlResult({
          error: serverCheck.message,
        });
        setLoading(false);
        return;
      }

      const result = await analyzeImage(file);
      setMlResult(result);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Gagal menganalisis gambar. Pastikan server backend berjalan.";
      setMlResult({
        error: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setUploadPreview(URL.createObjectURL(f));
    setIsWebcamActive(false); 
    handleAnalysis(f);
  };

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      if (!isRealtime) {
        setUploadPreview(imageSrc);
        setIsWebcamActive(false);
      }

      const file = dataURLtoFile(imageSrc, "webcam-capture.jpg");

      handleAnalysis(file);
    }
  }, [isRealtime]); 

  useEffect(() => {
    if (isRealtime && isWebcamActive) {
      intervalRef.current = setInterval(() => {
        if (!loading && !isProcessingRef.current && webcamRef.current) {
          isProcessingRef.current = true;
          capture();
          setTimeout(() => {
            isProcessingRef.current = false;
          }, 1000);
        }
      }, 1500);
    } else {
      // Jika dimatikan, hapus interval
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRealtime, isWebcamActive, capture, loading]);

  return (
    <div className="min-h-screen bg-linear-to-br from-neutral-50 to-neutral-100 p-4 sm:p-6 lg:p-8 pt-16 md:pt-4">
      <div className="mx-auto max-w-7xl">
        <CameraHeader serverStatus={serverStatus} />

        <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-4">
          <CameraList
            cameras={cameras}
            selectedCamera={selectedCamera}
            onSelectCamera={handleSelectCamera}
          />

          {selectedCamera && (
            <CameraCard
              camera={selectedCamera}
              isWebcamActive={isWebcamActive}
              webcamRef={webcamRef as React.RefObject<Webcam | null>}
              fileRef={fileRef}
              uploadPreview={uploadPreview}
              mlResult={mlResult}
              loading={loading}
              isRealtime={isRealtime}
              onCapture={capture}
              onToggleWebcam={handleToggleWebcam}
              onToggleRealtime={() => setIsRealtime(!isRealtime)}
              onFilePick={onPick}
              onFileChange={onFile}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CameraPage;
