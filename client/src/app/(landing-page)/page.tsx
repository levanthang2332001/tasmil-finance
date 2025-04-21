import Features from "@/components/landing-page/Features";
import Footer from "@/components/landing-page/Footer";
import Header from "@/components/landing-page/Header";
import Hero from "@/components/landing-page/Hero";
import HeroScroll from "@/components/landing-page/HeroScroll";
import IntroAi from "@/components/landing-page/IntroAi";
import StepMoving from "@/components/landing-page/StepMoving";
import Squares from "@/components/ui/squares-background";
import { cn } from "@/lib/utils";

export default function Home() {
  const WIDTH = "w-full max-w-[var(--container-width)] mx-auto";

  return (
    <div className="min-h-screen relative bg-transparent">
      <Header />
      <Squares
        direction="diagonal"
        speed={0.5}
        squareSize={40}
        borderColor="#333"
        hoverFillColor="#222"
        className="h-screen"
      />

      <div className="absolute z-[2] top-0 left-1/2 -translate-x-1/2 transform pt-52">
        <Hero />
      </div>

      <div className="absolute z-[1] top-0 left-1/2 -translate-x-1/2 transform mt-96">
        <HeroScroll />
      </div>

      <Features className={cn(WIDTH, "mt-96")} />
      <IntroAi className={WIDTH} />
      <StepMoving className={WIDTH} />
      <Footer />
    </div>
  );
}
