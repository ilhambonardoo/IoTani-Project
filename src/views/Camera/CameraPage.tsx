"use client";

import { motion } from "framer-motion";
import { useRef, useState, useCallback, useEffect } from "react";
import Image from "next/legacy/image";
import Webcam from "react-webcam"; // Import Webcam
import { FaVideo, FaCamera, FaExclamationTriangle } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";

// Fungsi helper untuk convert Base64 dari webcam ke File object
const dataURLtoFile = (dataurl: string, filename: string) => {
  const arr = dataurl.split(",");
  // @ts-expect-error - match() can return null, but we know the pattern exists in dataURL
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
};

// Base URL untuk ML API
const getMLBaseURL = () => {
  return process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
};

// Interface untuk response analisis ML
interface MLAnalysisResult {
  objek?: string;
  penyakit?: string;
  confidence?: string;
  error?: string;
}

// Fungsi untuk test koneksi ke server
async function testServerConnection(): Promise<{
  connected: boolean;
  message: string;
}> {
  const base = getMLBaseURL();
  try {
    const res = await fetch(`${base}/health`, {
      method: "GET",
    });
    if (res.ok) {
      const data = await res.json();
      return {
        connected: true,
        message: data.message || "Server terhubung",
      };
    }
    return {
      connected: false,
      message: `Server merespons dengan status ${res.status}`,
    };
  } catch {
    return {
      connected: false,
      message: `Tidak dapat terhubung ke server di ${base}`,
    };
  }
}

async function analyzeImage(file: File): Promise<MLAnalysisResult> {
  const base = getMLBaseURL();
  const form = new FormData();
  form.append("file", file);

  try {

    const res = await fetch(`${base}/analyze`, {
      method: "POST",
      body: form,
      // Jangan set Content-Type header - browser akan otomatis set boundary untuk FormData
    });


    if (!res.ok) {
      const errorData = await res
        .json()
        .catch(() => ({ detail: res.statusText }));
      throw new Error(
        errorData.detail ||
          `Gagal terhubung ke server ML (Status: ${res.status})`
      );
    }

    const data = await res.json();
    return data as MLAnalysisResult;
  } catch (error) {

    // Handle network errors lebih spesifik
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (
      errorMessage.includes("fetch") ||
      errorMessage.includes("Failed to fetch") ||
      error instanceof TypeError ||
      errorMessage.includes("NetworkError")
    ) {
      throw new Error(
        `Tidak dapat terhubung ke server ML di ${base}. Pastikan server berjalan dengan perintah: uvicorn main:app --reload --host 127.0.0.1 --port 8000`
      );
    }
    throw error;
  }
}

interface CameraFeed {
  id: string;
  name: string;
  robotName: string;
  robotId: string;
  location: string;
  status: "online" | "offline";
  hasDetection: boolean;
  detectionType?: "pest" | "disease" | "weed";
  imageUrl: string;
}

const CameraPage = () => {
  // ... (State cameras Anda sama seperti sebelumnya)
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

  // State baru untuk Webcam
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const webcamRef = useRef<Webcam>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [isRealtime, setIsRealtime] = useState(false); // Mode Realtime
  const isProcessingRef = useRef(false); // Mencegah request bertumpuk
  const intervalRef = useRef<NodeJS.Timeout | null>(null); // Simpan ID interval

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
    setIsWebcamActive(false); // Matikan webcam jika upload file
    handleAnalysis(f);
  };

  // Fungsi Capture Webcam
  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      // Jika BUKAN realtime, kita update preview biar user lihat hasil jepretan
      if (!isRealtime) {
        setUploadPreview(imageSrc);
        setIsWebcamActive(false);
      }

      const file = dataURLtoFile(imageSrc, "webcam-capture.jpg");

      // Panggil fungsi analisis
      handleAnalysis(file);
    }
  }, [webcamRef, isRealtime]); // Dependency ditambah isRealtime

  // Effect untuk Realtime Detection
  useEffect(() => {
    if (isRealtime && isWebcamActive) {
      intervalRef.current = setInterval(() => {
        if (!loading && !isProcessingRef.current && webcamRef.current) {
          isProcessingRef.current = true; // Tandai sedang proses
          capture();
          // Reset flag proses akan dilakukan di 'finally' handleAnalysis
          // TAPI karena kita tidak bisa ubah handleAnalysis dengan mudah,
          // kita mainkan logic sederhana:
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
        {/* Header ... (Sama seperti kode Anda) */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-neutral-800 lg:text-4xl text-center md:text-left">
                Kamera Robot
              </h1>
              <p className="mt-2 text-sm sm:text-base text-neutral-600 text-center md:text-left">
                Pantau lahan melalui kamera yang terpasang di robot dengan AI
                detection
              </p>
            </div>
            {serverStatus && (
              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${
                  serverStatus.connected
                    ? "bg-green-100 text-green-800 border border-green-300"
                    : "bg-red-100 text-red-800 border border-red-300"
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    serverStatus.connected ? "bg-green-500" : "bg-red-500"
                  }`}
                />
                <span>
                  {serverStatus.connected
                    ? "Server ML Terhubung"
                    : "Server ML Tidak Terhubung"}
                </span>
              </div>
            )}
          </div>
          {serverStatus && !serverStatus.connected && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg"
            >
              <p className="text-sm text-yellow-800">
                <strong>Peringatan:</strong> {serverStatus.message}
              </p>
              <p className="text-xs text-yellow-700 mt-2">
                Jalankan server dengan:{" "}
                <code className="bg-yellow-100 px-2 py-1 rounded">
                  uvicorn main:app --reload --host 127.0.0.1 --port 8000
                </code>
              </p>
            </motion.div>
          )}
        </motion.div>

        <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-4">
          {/* Camera List Sidebar ... (Sama seperti kode Anda) */}
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
                    onClick={() => {
                      setSelectedCamera(camera);
                      setUploadPreview(null);
                      setMlResult(null);
                      setIsWebcamActive(false);
                    }}
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

          {/* Main Camera View */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-3 order-1 lg:order-2"
          >
            {selectedCamera && (
              <div className="rounded-2xl bg-white p-4 sm:p-6 shadow-lg">
                {/* Header Kartu Kamera */}
                <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div>
                    <h2 className="text-lg sm:text-xl font-semibold text-neutral-800">
                      {selectedCamera.robotName}
                    </h2>
                    <p className="text-xs sm:text-sm text-neutral-600">
                      {isWebcamActive
                        ? "Live Camera Feed"
                        : `Kamera di ${selectedCamera.location}`}
                    </p>
                    <p className="text-xs text-neutral-500 mt-1">
                      Kamera terpasang di robot
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium ${
                        selectedCamera.status === "online"
                          ? "bg-green-100 text-green-800 border border-green-300"
                          : "bg-red-100 text-red-800 border border-red-300"
                      }`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full ${
                          selectedCamera.status === "online"
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                      />
                      <span>
                        {selectedCamera.status === "online"
                          ? "Online"
                          : "Offline"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Area Tampilan Gambar / Webcam */}
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
                        onClick={capture}
                        className="bg-white rounded-full p-4 shadow-lg hover:bg-gray-100 transition-colors ring-4 ring-cyan-500/50"
                      >
                        <FaCamera className="text-cyan-600 text-2xl" />
                      </button>
                    </div>
                  )}

                  {/* Overlay Hasil Deteksi - Desktop Only (hidden di mobile) */}
                  {(selectedCamera.hasDetection || mlResult) && (
                    <>
                      {/* Info card Hasil Deteksi */}
                      <motion.div
                        initial={{ x: 16, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className="hidden sm:block absolute right-2 sm:right-4 top-4 w-64 rounded-xl border border-cyan-400/30 bg-black/60 p-4 text-white backdrop-blur-md"
                      >
                        <h3 className="mb-2 text-sm font-semibold text-cyan-300">
                          Hasil Analisis AI
                        </h3>
                        <div className="space-y-2 text-sm">
                          {mlResult ? (
                            mlResult.error ? (
                              <p className="text-red-300">{mlResult.error}</p>
                            ) : (
                              <>
                                <div className="flex justify-between border-b border-white/10 pb-1">
                                  <span className="text-white/70">Objek</span>
                                  <span className="font-medium">
                                    {mlResult.objek}
                                  </span>
                                </div>
                                <div className="flex justify-between border-b border-white/10 pb-1">
                                  <span className="text-white/70">
                                    Diagnosa
                                  </span>
                                  <span className="font-medium text-yellow-300">
                                    {mlResult.penyakit}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-white/70">Akurasi</span>
                                  <span className="font-medium text-green-300">
                                    {mlResult.confidence}
                                  </span>
                                </div>
                              </>
                            )
                          ) : selectedCamera.hasDetection ? (
                            <p className="text-orange-300">
                              Deteksi simulasi pada kamera CCTV.
                            </p>
                          ) : (
                            <p className="text-white/50 italic">
                              Menunggu input...
                            </p>
                          )}
                        </div>
                      </motion.div>
                    </>
                  )}
                </div>

                {/* Hasil Analisis AI - Mobile Only (tampil di bawah camera) */}
                {(selectedCamera.hasDetection || mlResult) && (
                  <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="sm:hidden mt-4 w-full rounded-xl border border-cyan-400/30 bg-gradient-to-br from-cyan-50 to-blue-50 p-4 shadow-lg"
                  >
                    <h3 className="mb-3 text-base font-semibold text-cyan-800">
                      Hasil Analisis AI
                    </h3>
                    <div className="space-y-2.5 text-sm">
                      {mlResult ? (
                        mlResult.error ? (
                          <p className="text-red-600 font-medium">
                            {mlResult.error}
                          </p>
                        ) : (
                          <>
                            <div className="flex justify-between items-center border-b border-cyan-200 pb-2">
                              <span className="text-neutral-600">Objek</span>
                              <span className="font-semibold text-neutral-800">
                                {mlResult.objek}
                              </span>
                            </div>
                            <div className="flex justify-between items-center border-b border-cyan-200 pb-2">
                              <span className="text-neutral-600">Diagnosa</span>
                              <span className="font-semibold text-yellow-600">
                                {mlResult.penyakit}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-neutral-600">Akurasi</span>
                              <span className="font-semibold text-green-600">
                                {mlResult.confidence}
                              </span>
                            </div>
                          </>
                        )
                      ) : selectedCamera.hasDetection ? (
                        <p className="text-orange-600 font-medium">
                          Deteksi simulasi pada kamera CCTV.
                        </p>
                      ) : (
                        <p className="text-neutral-500 italic">
                          Menunggu input...
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Control Buttons (Upload & Webcam Toggle) */}
                {/* Control Buttons */}
                <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    {/* Tombol Buka/Tutup Kamera */}
                    {!isWebcamActive ? (
                      <button
                        onClick={() => {
                          setIsWebcamActive(true);
                          setUploadPreview(null);
                          setMlResult(null);
                        }}
                        className="flex items-center gap-2 rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-600"
                      >
                        <FaVideo /> Buka Kamera
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setIsWebcamActive(false);
                          setIsRealtime(false); // Matikan realtime jika kamera ditutup
                        }}
                        className="flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600"
                      >
                        <IoMdClose /> Tutup Kamera
                      </button>
                    )}

                    {/* TOMBOL BARU: Toggle Realtime (Hanya muncul jika kamera aktif) */}
                    {isWebcamActive && (
                      <button
                        onClick={() => setIsRealtime(!isRealtime)}
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
                          onClick={onPick}
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
                          onChange={onFile}
                        />
                      </>
                    )}
                  </div>

                  <div className="text-sm font-medium text-cyan-600">
                    {loading ? (
                      <span className="animate-pulse">
                        {isRealtime
                          ? "Menganalisis Stream..."
                          : "Sedang Menganalisis..."}
                      </span>
                    ) : mlResult ? (
                      // Tampilkan timestamp biar user tau datanya baru
                      <span className="text-green-600">Update Terkini ✓</span>
                    ) : (
                      ""
                    )}
                  </div>
                </div>

                {/* Alert Box (Sama seperti kode Anda) */}
                {/* --- TEMPELKAN INI DI BAWAH TOMBOL CONTROL --- */}

                {/* Alert Box / Detection Info */}
                {selectedCamera.hasDetection && (
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
