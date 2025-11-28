"use client";

import { motion } from "framer-motion";

interface Zone {
  id: string;
  name: string;
  location: string;
  status: "online" | "offline";
}

interface DashboardHeaderProps {
  role: string | null | undefined;
  fullName: string | null | undefined;
  zones: Zone[];
  selectedZoneId: string;
  onZoneSelect: (zoneId: string) => void;
}

const DashboardHeader = ({
  role,
  fullName,
  zones,
  selectedZoneId,
  onZoneSelect,
}: DashboardHeaderProps) => {
  const selectedZone = zones.find((z) => z.id === selectedZoneId) || zones[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6 sm:mb-8"
    >
      {role === "admin" || role === "owner" ? (
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-800 lg:text-4xl text-center md:text-left">
            Monitoring Kelembaban tanah
          </h1>
        </div>
      ) : (
        <>
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-800 lg:text-4xl text-center md:text-left">
            Selamat Datang, {fullName || "Pengguna"}! 👋
          </h1>
          <p className="mt-2 text-sm sm:text-base text-neutral-600 text-center md:text-left">
            Pantau kondisi lahan Anda secara real-time
          </p>
        </>
      )}

      {/* Zone Selector */}
      <div className="mt-4 flex flex-wrap gap-2">
        {zones.map((zone) => (
          <button
            key={zone.id}
            onClick={() => onZoneSelect(zone.id)}
            className={`rounded-lg border-2 px-4 py-2 text-sm font-medium transition-all ${
              selectedZoneId === zone.id
                ? "border-green-500 bg-green-50 text-green-700"
                : "border-neutral-200 bg-white text-neutral-700 hover:border-green-300"
            }`}
          >
            <div className="flex items-center gap-2">
              <span>{zone.name}</span>
              <div
                className={`h-2 w-2 rounded-full ${
                  zone.status === "online" ? "bg-green-500" : "bg-red-500"
                }`}
              />
            </div>
          </button>
        ))}
      </div>

      <div className="mt-3 rounded-lg bg-blue-50 border border-blue-200 px-4 py-2">
        <p className="text-sm text-blue-800">
          <span className="font-semibold">Lahan yang dipilih:</span>{" "}
          {selectedZone.name} - {selectedZone.location}
        </p>
      </div>
    </motion.div>
  );
};

export default DashboardHeader;

