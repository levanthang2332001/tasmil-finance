// import { StarsBackground } from "@/components/animate-ui/backgrounds/stars";
// import FlowSection from "@/components/landing-page/FlowSection";
// import Features from "@/components/landing-page/Features";
// import Footer from "@/components/landing-page/Footer";
// import Header from "@/components/landing-page/Header";
// import Hero from "@/components/landing-page/Hero";
// import IntroAi from "@/components/landing-page/IntroAi";
// import { cn } from "@/lib/utils";

import LandingPage from "@/components/landing-page";

export default function Home() {
  // const WIDTH = "w-full max-w-[var(--container-width)] mx-auto";

  return (
    <div className="min-h-screen relative bg-gradient-to-b from-gray-900/70 to-black">
      <LandingPage />
    </div>
  );
}
