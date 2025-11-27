"use client";

import { FaUser } from "react-icons/fa";

const MessageAccessDenied = () => {
  return (
    <div className="rounded-2xl bg-white p-12 text-center shadow-sm">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100 text-neutral-400">
        <FaUser size={24} />
      </div>
      <h3 className="text-lg font-medium text-neutral-900">Akses Terbatas</h3>
      <p className="mt-1 text-neutral-600">
        Silakan masuk terlebih dahulu untuk mengirim pesan.
      </p>
    </div>
  );
};

export default MessageAccessDenied;

