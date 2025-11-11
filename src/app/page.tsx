"use client";

import CtaSection from "@/views/LandingPage/CtaSection";
import FeatureSection from "@/views/LandingPage/FeatureSection";
import HeroSection from "@/views/LandingPage/HeroSection";
import Chatbot from "@/views/LandingPage/Chatbot";
import EducationSection from "@/views/LandingPage/EducationSection";

export default function Home() {
  return (
    <main className="min-h-screen bg-linear-to-b from-neutral-50 to-neutral-100 text-neutral-900 overflow-x-hidden">
      <HeroSection />
      <EducationSection />
      <FeatureSection />
      <CtaSection />
      <Chatbot />
    </main>
  );
}
