"use client";

import CtaSection from "@/components/sections/LandingPage/CtaSection";
import FeatureSection from "@/components/sections/LandingPage/FeatureSection";
import HeroSection from "@/components/sections/LandingPage/HeroSection";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-gray-100 overflow-x-hidden">
      <HeroSection />
      <FeatureSection />
      <CtaSection />
    </main>
  );
}
