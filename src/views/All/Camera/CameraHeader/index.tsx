"use client";

import { motion } from "framer-motion";

interface ServerStatus {
  connected: boolean;
  message: string;
}

interface CameraHeaderProps {
  serverStatus: ServerStatus | null;
}

const CameraHeader = ({ serverStatus }: CameraHeaderProps) => {
  return (
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
  );
};

export default CameraHeader;

