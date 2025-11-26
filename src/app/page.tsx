"use client";

import CtaSection from "@/views/LandingPage/CtaSection";
import FeatureSection from "@/views/LandingPage/FeatureSection";
import HeroSection from "@/views/LandingPage/HeroSection";
import Chatbot from "@/views/LandingPage/Chatbot";
import EducationSection from "@/views/LandingPage/EducationSection";
import AnimationRobot from "@/views/LandingPage/AnimationRobot";
import RobotViewer from "@/views/LandingPage/RobotDetail";

export default function Home() {
  return (
    <main className="min-h-screen bg-linear-to-b from-neutral-50 to-neutral-100 text-neutral-900 overflow-x-hidden">
      <HeroSection />
      <EducationSection />
      <FeatureSection />
      <RobotViewer />
      <AnimationRobot />
      <CtaSection />
      <Chatbot />
    </main>
  );
}
