"use client";

import CtaSection from "@/components/LandingPage/CtaSection";
import FeatureSection from "@/components/LandingPage/FeatureSection";
import HeroSection from "@/components/LandingPage/HeroSection";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-gray-100 overflow-x-hidden">
      <HeroSection />
      <FeatureSection />
      <CtaSection />
    </main>
  );
}
