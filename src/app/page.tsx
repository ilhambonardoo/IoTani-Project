"use client";

import CtaSection from "@/components/LandingPage/CtaSection";
import FeatureSection from "@/components/LandingPage/FeatureSection";
import HeroSection from "@/components/LandingPage/HeroSection";
import Chatbot from "@/components/LandingPage/Chatbot";

export default function Home() {
  return (
    <main className="min-h-screen bg-linear-to-b from-neutral-50 to-neutral-100 text-neutral-900 overflow-x-hidden">
      <HeroSection />
      <FeatureSection />
      <CtaSection />
      <Chatbot />
    </main>
  );
}
