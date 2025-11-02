"use client";

import { useState } from "react";
import { Switch } from "@headlessui/react";
import { LuDroplets } from "react-icons/lu";

export function PumpControl() {
  const [isAuto, setIsAuto] = useState(true);

  return (
    <div className="flex h-full flex-col justify-between rounded-2xl border border-gray-800 bg-black p-6">
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-white">Kontrol Irigasi</h3>
          <LuDroplets size={24} className="text-blue-400" />
        </div>
        <p className="mt-2 text-gray-400">
          Atur mode pompa air otomatis berdasarkan kelembapan tanah.
        </p>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <span className="font-medium text-white">Mode Otomatis</span>
        <Switch
          checked={isAuto}
          onChange={setIsAuto}
          className={`${
            isAuto ? "bg-lime-400" : "bg-gray-700"
          } relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-lime-400 focus:ring-offset-2 focus:ring-offset-black`}
        >
          <span className="sr-only">Aktifkan mode otomatis</span>
          <span
            aria-hidden="true"
            className={`${
              isAuto ? "translate-x-5" : "translate-x-0"
            } pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
          />
        </Switch>
      </div>
    </div>
  );
}
