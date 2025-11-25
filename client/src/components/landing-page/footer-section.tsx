"use client";

import Image from "next/image";
import Link from "next/link";
import { Typography } from "../ui/typography";
import { ArrowUp } from "lucide-react";
import { BsTwitterX } from "react-icons/bs";
// import { FaTelegram } from "react-icons/fa";
import { PATHS } from "@/constants/routes";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function FooterSection() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  // Cache images - using local paths
  const footerBg = "/images/landing-v3/footer-bg.png";

  const handleSubscribe = () => {
    if (!email) {
      alert("Please enter your email address");
      return;
    }

    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      alert("Please enter a valid email address");
      return;
    }

    // Simple success message
    alert("Thank you for subscribing to our newsletter!");
    setEmail(""); // Clear the input
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <section className="relative w-full overflow-hidden text-white h-[90vh] md:h-[100vh] flex flex-col">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={footerBg}
          alt="Footer background"
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
          quality={80}
          placeholder="blur"
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
        />
      </div>

      {/* Gradient Overlay */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 50%, rgba(0,0,0,0) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Content Container */}
      <div className="flex-1 z-10 px-4 md:px-10 pt-14 pb-4 md:pt-24 md:pb-6 flex flex-col justify-between">
        {/* Main Content */}
        <div className="max-w-4xl">
          <Typography
            as="h2"
            variant="h2"
            weight="bold"
            className="text-3xl md:text-4xl leading-tight text-white mb-6"
          >
            REVOLUTIONIZE YOUR DEFI EXPERIENCE WITH TASMIL FINANCE
          </Typography>

          <Typography
            as="div"
            className="text-lg md:text-2xl md:w-[60%] mb-6 md:mb-10 mt-4 md:mt-6 opacity-90 max-w-2xl text-white"
          >
            Experience the future of decentralized finance with our AI-powered
            platform. Trade, manage liquidity, and optimize your portfolio with
            intelligent automation.
          </Typography>

          <button
            className="rounded-lg transition-all duration-300 relative group overflow-hidden flex items-center p-1 bg-gradient-to-b from-[#B5EAFF] to-[#00BFFF] hover:from-[#C5F0FF] hover:to-[#1CCFFF] transform hover:scale-105"
            style={{
              boxShadow: "0 0 15px rgba(181, 234, 255, 0.5)",
            }}
            onClick={() => router.push("/ai-agents")}
          >
            {/* Glow effect */}
            <div className="absolute w-[50%] h-4 top-0 left-1/2 -translate-x-1/2 bg-white/80 rounded-full blur-xl" />
            <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-black rounded-lg group-hover:bg-[#0a0a0a] transition-colors duration-300">
              <Image
                src="/images/logo.png"
                alt="Tasmil Finance Logo"
                width={24}
                height={24}
                loading="eager"
                quality={90}
                className="sm:w-8 sm:h-8 transition-transform duration-300 group-hover:scale-110"
              />
            </div>
            <Typography
              font="geistMono"
              className="text-black text-sm sm:text-base uppercase tracking-wide px-2 sm:px-3 transition-all duration-300 group-hover:tracking-wider"
            >
              LAUNCH TASMIL FINANCE
            </Typography>
          </button>
        </div>

        {/* Stay in the Loop Section */}
        <div className="bg-black/10 rounded-lg p-4 sm:p-6 shadow-lg drop-shadow-lg backdrop-blur-lg w-full sm:w-[80%] md:w-[60%] lg:w-[40%]">
          <Typography
            font="darkerGrotesk"
            weight="semibold"
            className="text-base md:text-xl mb-4 md:mb-6 text-white"
          >
            STAY IN THE LOOP
          </Typography>

          {/* Subscription input */}
          <div className="w-full">
            <div className="flex flex-row gap-3 sm:gap-0 items-stretch sm:items-center w-full overflow-hidden bg-black/30 rounded-xl border border-white/10">
              <div className="w-full pl-6">
                <input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full font-geistMono bg-transparent border-none text-white placeholder:text-gray-500 h-14 focus:outline-none focus:ring-0 text-sm"
                />
              </div>
              <div className="w-auto">
                <button
                  onClick={handleSubscribe}
                  className="w-auto bg-white hover:bg-gray-100 text-black font-medium mt-2 md:mt-0 h-10 mr-2 px-4 sm:px-5 transition-all duration-300 rounded-md hover:shadow-md transform hover:scale-[1.02]"
                >
                  <Typography className="text-black whitespace-nowrap text-sm font-mono transition-all duration-300 hover:tracking-wider">
                    SUBSCRIBE NOW
                  </Typography>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Back to top button */}
      <div className="hidden sm:block absolute right-4 sm:right-10 bottom-[25%] sm:bottom-[20%] z-20">
        <button
          onClick={scrollToTop}
          aria-label="Back to top"
          className="group relative flex flex-col items-center cursor-pointer"
        >
          <div className="flex items-center justify-center h-[52px] w-[52px] sm:h-[64px] sm:w-[64px] rounded-full bg-white/10 backdrop-blur-lg border border-white/10 group-hover:bg-white/20 transition-all duration-300">
            <ArrowUp
              size={20}
              className="text-white group-hover:scale-110 group-hover:-translate-y-0.5 transition-all duration-300"
            />
            <div className="absolute inset-0 rounded-full border border-white/20 group-hover:border-white/40 transition-colors duration-300"></div>
          </div>
          <Typography
            font="geistMono"
            className="mt-2 text-center text-white/80 group-hover:text-white transition-colors duration-300 text-sm"
          >
            Back to top
          </Typography>
        </button>
      </div>

      {/* Footer Bottom */}
      <div className="relative z-10 w-full">
        {/* Mobile Footer */}
        <div className="block sm:hidden p-3 w-full">
          <div className="flex flex-col px-4 py-4 gap-6 bg-black/50 backdrop-blur-sm rounded-lg">
            <div className="flex flex-row items-center justify-between gap-6">
              {/* Logo */}
              <div className="flex items-center gap-2">
                <Image
                  src="/images/logo.png"
                  alt="Tasmil Finance logo"
                  width={32}
                  height={32}
                  loading="lazy"
                  quality={90}
                />
                <Typography
                  as="span"
                  weight="bold"
                  className="text-white text-base"
                  gradient={true}
                >
                  Tasmil Finance
                </Typography>
              </div>

              {/* Social Links */}
              <div className="flex items-center justify-center gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        href={PATHS.X}
                        aria-label="Twitter"
                        className="group"
                      >
                        <div className="relative flex items-center justify-center h-10 w-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/5 hover:bg-white/20">
                          <BsTwitterX className="text-white text-lg" />
                          <div className="absolute inset-0 rounded-full border border-white/20 group-hover:border-white/40"></div>
                        </div>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      <span>Twitter</span>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            {/* Copyright */}
            <Typography
              variant="small"
              className="text-gray-400 text-xs text-center"
            >
              © 2025 TASMIL FINANCE. ALL RIGHTS RESERVED.
            </Typography>
          </div>
        </div>

        {/* Desktop Footer */}
        <div className="hidden sm:flex px-8 py-4 items-center justify-between w-full bg-black/50 backdrop-blur-sm border-t border-gray-800">
          <div className="flex items-center gap-2">
            <Image
              src="/images/logo.png"
              alt="Tasmil Finance logo"
              width={28}
              height={28}
              className="w-8 h-8"
            />
            <Typography
              as="span"
              weight="bold"
              size="lg"
              className="text-white text-lg"
              gradient={true}
            >
              Tasmil Finance
            </Typography>
          </div>

          <Typography size="base" className="text-gray-400">
            © 2025 TASMIL FINANCE. ALL RIGHTS RESERVED.
          </Typography>

          <div className="flex items-center gap-3">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href={PATHS.X} aria-label="Twitter" className="group">
                    <div className="relative flex items-center justify-center h-10 w-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/5 hover:bg-white/20">
                      <BsTwitterX className="text-white text-lg group-hover:scale-110 transition-transform" />
                      <div className="absolute inset-0 rounded-full border border-white/20 group-hover:border-white/40"></div>
                    </div>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <span>Twitter</span>
                </TooltipContent>
              </Tooltip>

              {/* <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href={PATHS.TELEGRAM}
                    aria-label="Telegram"
                    className="group"
                  >
                    <div className="relative flex items-center justify-center h-10 w-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/5 hover:bg-white/20">
                      <FaTelegram className="text-white text-lg group-hover:scale-110 transition-transform" />
                      <div className="absolute inset-0 rounded-full border border-white/20 group-hover:border-white/40"></div>
                    </div>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <span>Telegram</span>
                </TooltipContent>
              </Tooltip> */}
            </TooltipProvider>
          </div>
        </div>
      </div>
    </section>
  );
}
