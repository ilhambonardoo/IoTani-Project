"use client";

import HeroSection from "./HeroSection";
import VisionMissionSection from "./VisionMissionSection";
import ValuesSection from "./ValuesSection";
import TeamSection from "./TeamSection";
import CtaSection from "./CtaSection";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-neutral-50 to-neutral-100">
      <HeroSection />
      <VisionMissionSection />
      <ValuesSection />
      <TeamSection />
      <CtaSection />
    </div>
  );
};

export default AboutPage;
