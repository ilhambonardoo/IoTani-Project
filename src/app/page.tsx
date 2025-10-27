"use client";

import CtaSection from "@/components/sections/CtaSection";
import FeatureSection from "@/components/sections/FeatureSection";
import HeroSection from "@/components/sections/HeroSection";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-gray-100 overflow-x-hidden">
      <HeroSection />
      <FeatureSection />
      <CtaSection />
    </main>
  );
}
