"use client";

import CtaSection from "@/views/All/LandingPage/CtaSection";
import FeatureSection from "@/views/All/LandingPage/FeatureSection";
import HeroSection from "@/views/All/LandingPage/HeroSection";
import Chatbot from "@/views/All/LandingPage/Chatbot";
import EducationSection from "@/views/All/LandingPage/EducationSection";
import AnimationRobot from "@/views/All/LandingPage/AnimationRobot";
import RobotViewer from "@/views/All/LandingPage/RobotDetail";

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
