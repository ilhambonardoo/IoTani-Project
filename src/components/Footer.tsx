"use client";

import { useState, useEffect } from "react";

const Footer = () => {
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="border-t border-slate-700/50 py-8 bg-whie">
      <div className="container mx-auto px-6 text-center text-black">
        <p>
          &copy; {year ?? "2024"} IoTani. Semua Hak Cipta Dilindungi.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
