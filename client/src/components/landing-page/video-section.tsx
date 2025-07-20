"use client";

import { Typography } from "../ui/typography";
import { HeroVideoDialog } from "../ui/hero-video-dialog";

export const VideoSection = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center w-full py-20 px-4 md:px-8">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-black/60" />

      {/* Content container */}
      <div className="relative z-10 flex flex-col items-center gap-16 w-full max-w-6xl">
        {/* Section Header */}
        <div className="text-center flex flex-col items-center gap-6">
          <Typography
            variant="h1"
            font="sfPro"
            gradient={true}
            className="text-center uppercase text-4xl md:text-5xl xl:text-6xl font-bold"
          >
            See Tasmil Finance in Action
          </Typography>

          <div className="max-w-2xl">
            <Typography
              variant="p"
              className="text-center text-xl md:text-2xl text-gray-300 leading-relaxed"
            >
              Watch how our AI-powered DeFi platform transforms your trading
              experience with intelligent automation and real-time insights.
            </Typography>
          </div>
        </div>

        {/* Video Demo */}
        <div className="relative w-full max-w-4xl">
          <HeroVideoDialog
            className="block dark:hidden"
            animationStyle="from-center"
            videoSrc="https://www.youtube.com/watch?v=qu1r2K83KNE"
            thumbnailSrc="/images/landing-v3/video-thumbnail.png"
            thumbnailAlt="Tasmil Finance Demo Video"
          />
          <HeroVideoDialog
            className="hidden dark:block"
            animationStyle="from-center"
            videoSrc="https://www.youtube.com/watch?v=qu1r2K83KNE"
            thumbnailSrc="/images/landing-v3/video-thumbnail.png"
            thumbnailAlt="Tasmil Finance Demo Video"
          />
        </div>

        {/* Additional Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mt-8">
          <div className="text-center">
            <Typography
              variant="h3"
              font="sfPro"
              className="text-white text-xl font-semibold mb-3"
            >
              AI-Powered Trading
            </Typography>
            <Typography
              variant="p"
              className="text-gray-400 text-sm leading-relaxed"
            >
              Experience intelligent trading decisions with our advanced AI
              algorithms that analyze market trends in real-time.
            </Typography>
          </div>

          <div className="text-center">
            <Typography
              variant="h3"
              font="sfPro"
              className="text-white text-xl font-semibold mb-3"
            >
              Seamless Integration
            </Typography>
            <Typography
              variant="p"
              className="text-gray-400 text-sm leading-relaxed"
            >
              Connect with major DeFi protocols and manage your portfolio from a
              single, intuitive interface.
            </Typography>
          </div>

          <div className="text-center">
            <Typography
              variant="h3"
              font="sfPro"
              className="text-white text-xl font-semibold mb-3"
            >
              Real-Time Analytics
            </Typography>
            <Typography
              variant="p"
              className="text-gray-400 text-sm leading-relaxed"
            >
              Get instant insights into market conditions, portfolio
              performance, and trading opportunities.
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
};
