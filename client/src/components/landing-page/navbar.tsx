"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiArrowUpRight, FiMenu, FiX } from "react-icons/fi";
import { BsTwitterX } from "react-icons/bs";
import { FaTelegram } from "react-icons/fa";
import React from "react";
import { PATHS, SECTION_IDS } from "@/constants/routes";
// import { socialConfig, fundingConfig } from "@/config";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Typography } from "../ui/typography";
import { Button } from "../ui/button-v2";
import ConnectButton from "../wallet/ConnectButton";

// Add these styles at the top of the file
const styles = {
  indicatorTransition: "all 300ms cubic-bezier(0.4, 0, 0.2, 1)",
  navbarTransition: "all 300ms cubic-bezier(0.4, 0, 0.2, 1)",
};

interface IndicatorStyle {
  left: string;
  width: string;
  transition: string;
  opacity: number;
}

// Separate Announcement Bar component
// const AnnouncementBar = () => {
//   // Cache images
//   const saliteImage = "/images/landing-v3/navbar/salite.png";
//   const fireIcon = "/images/landing-v3/navbar/fire-icon.gif";

//   return (
//     <div
//       className="w-full relative backdrop-blur-md flex justify-center items-center h-12 gap-6 overflow-hidden"
//       style={{
//         background: "rgba(0, 0, 0, 0.3)",
//       }}
//     >
//       <div className="absolute top-[-20px] right-[-50px] w-[600px] h-auto opacity-30 z-0">
//         <Image
//           src={saliteImage}
//           alt="salite"
//           width={600}
//           height={400}
//           loading="lazy"
//           className="object-cover w-full h-auto"
//         />
//       </div>
//       <div className="flex items-center gap-2 z-10">
//         <div className="h-5 w-5 relative">
//           <Image
//             src={fireIcon}
//             alt="Emoji"
//             width={20}
//             height={20}
//             className="object-contain"
//           />
//         </div>
//         <Typography
//           font="geistMono"
//           size="base-geist"
//           color="submerged"
//           className="text-xs md:text-base"
//         >
//           Tasmil Finance is LIVE now!
//         </Typography>
//       </div>

//       <Link href={PATHS.DEFI_AGENT} className="group z-10">
//         <Button
//           variant="gradient"
//           size="sm"
//           className="font-mono text-black text-xs md:text-sm font-semibold uppercase transition-all duration-300 hover:tracking-wider"
//         >
//           EXPLORE NOW
//           <FiArrowUpRight className="w-4 h-4 ml-1.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
//         </Button>
//       </Link>
//     </div>
//   );
// };

type SectionId =
  | "hero"
  | "about"
  | "number"
  | "coreTechnology"
  | "benefit"
  | "abstract"
  | "faq"
  | "support";

// Update MainNavbar props interface
interface MainNavbarProps {
  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
  isAnnouncementVisible: boolean;
  onSectionClick?: (sectionId: SectionId) => void;
}

// Main Navbar component
const MainNavbar = ({
  isMobileMenuOpen,
  toggleMobileMenu,
  // onSectionClick,
}: MainNavbarProps) => {
  const router = useRouter();
  type TabName = "DEMO" | "DEFI AGENT" | "DOCS";
  const [activeTab, setActiveTab] = useState<TabName>("DEMO");
  const [indicatorStyle, setIndicatorStyle] = useState<IndicatorStyle>({
    left: "0px",
    width: "40px",
    transition: styles.indicatorTransition,
    opacity: 0,
  });

  // Listen for section changes with debounce
  useEffect(() => {
    const handleSectionChange = (event: CustomEvent<TabName>) => {
      requestAnimationFrame(() => {
        setActiveTab(event.detail);
      });
    };

    document.addEventListener(
      "sectionChange",
      handleSectionChange as EventListener,
    );
    return () => {
      document.removeEventListener(
        "sectionChange",
        handleSectionChange as EventListener,
      );
    };
  }, []);

  // Update indicator position with RAF and better transition
  const updateIndicatorPosition = () => {
    requestAnimationFrame(() => {
      const activeTabRef = getActiveTabRef();
      const containerRef = navContainerRef;

      if (
        activeTabRef &&
        activeTabRef.current &&
        containerRef.current &&
        activeTab
      ) {
        const tabRect = activeTabRef.current.getBoundingClientRect();
        const containerRect = containerRef.current.getBoundingClientRect();
        const centerPosition =
          tabRect.left - containerRect.left + tabRect.width / 2;
        const indicatorWidth = Math.min(tabRect.width * 0.25, 24); // 25% of tab width or max 24px

        setIndicatorStyle({
          left: `${centerPosition}px`,
          width: `${indicatorWidth}px`,
          transition: styles.indicatorTransition,
          opacity: 1,
        });
      } else {
        // No active tab or refs not available
        setIndicatorStyle((prev) => ({
          ...prev,
          opacity: 0,
          transition: styles.indicatorTransition,
        }));
      }
    });
  };

  // Update position when active tab changes or on resize
  useEffect(() => {
    updateIndicatorPosition();

    const handleResize = () => {
      updateIndicatorPosition();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [activeTab, updateIndicatorPosition]);

  // Handle scroll to section with immediate tab update
  const handleTabClick = (tab: TabName) => {
    setActiveTab(tab);

    // Handle routing or scrolling based on selected tab
    switch (tab) {
      case "DEMO":
        // Scroll to video section
        const videoSection = document.querySelector(`[data-section-id="${SECTION_IDS.VIDEO}"]`);
        if (videoSection) {
          const navbarHeight = 72;
          const elementPosition = videoSection.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });
        }
        break;
      case "DEFI AGENT":
        router.push(PATHS.DEFI_AGENT);
        break;
      case "DOCS":
        window.open(PATHS.DOCS, '_blank');
        break;
      default:
        break;
    }
  };

  // Refs for each tab element
  const frameworkRef = useRef<HTMLDivElement>(null);
  const useCaseRef = useRef<HTMLDivElement>(null);
  const rewardRef = useRef<HTMLDivElement>(null);
  const navContainerRef = useRef<HTMLDivElement>(null);

  // Get the active tab ref based on current selection
  const getActiveTabRef = () => {
    switch (activeTab) {
      case "DEMO":
        return frameworkRef;
      case "DEFI AGENT":
        return useCaseRef;
      case "DOCS":
        return rewardRef;
      default:
        return null;
    }
  };

  // Navigation menu items data
  const menuItems = [
    { label: "DEMO", icon: <FiArrowUpRight className="w-5 h-5" /> },
    { label: "DEFI AGENT", icon: <FiArrowUpRight className="w-5 h-5" /> },
    {
      label: "DOCS",
      icon: <FiArrowUpRight className="w-5 h-5" />,
    },
  ];

  return (
    <div
      className={`fixed top-0 left-0 w-full flex items-center justify-between h-[72px] px-8 md:px-16 transition-all duration-300`}
      style={{ transition: styles.navbarTransition }}
    >
      {/* Left Navigation Menu - Desktop Only */}
      <div className="hidden md:flex">
        <div
          ref={navContainerRef}
          className="flex bg-gradient-to-r from-black/30 to-black/20 backdrop-blur-lg rounded-xl overflow-hidden border border-white/10 relative"
        >
          {/* Animated Indicator */}
          <div
            className="absolute bottom-0 h-[2px] pointer-events-none"
            style={{
              ...indicatorStyle,
              transform: `translateX(-50%)`,
              willChange: "transform, width, opacity",
            }}
          >
            {/* Radial glow background */}
            <div
              className="w-6 h-6 bg-white/40 rounded-full blur-md absolute -bottom-2.5 left-1/2 -translate-x-1/2"
              style={{ transition: styles.indicatorTransition }}
            />

            {/* Indicator bar */}
            <div
              className="absolute bottom-0 w-full h-[2px] bg-white rounded-full"
              style={{ transition: styles.indicatorTransition }}
            />
          </div>

                    <div ref={frameworkRef} className="relative">
            <Link
              href={`${PATHS.DEMO}`}
              className="flex items-center px-4 py-3 relative hover:bg-white/10 transition-all duration-300 group"
              onClick={(e) => {
                e.preventDefault();
                handleTabClick("DEMO");
              }}
            >
              <Typography
                font="geistMono"
                size="sm"
                className={
                  activeTab === "DEMO"
                    ? "text-embossed"
                    : "text-submerged group-hover:text-embossed/80"
                }
              >
                <span className="uppercase transition-colors duration-300">
                  DEMO
                </span>
              </Typography>
            </Link>
          </div>
          <div ref={useCaseRef} className="relative">
            <Link
              href={`${PATHS.DEFI_AGENT}`}
              className="flex items-center px-4 py-3 hover:bg-white/10 transition-all duration-300 group"
              onClick={(e) => {
                e.preventDefault();
                handleTabClick("DEFI AGENT");
              }}
            >
              <Typography
                font="geistMono"
                size="sm"
                className={
                  activeTab === "DEFI AGENT"
                    ? "text-embossed"
                    : "text-submerged group-hover:text-embossed/80"
                }
              >
                <span className="uppercase transition-colors duration-300">
                  DEFI AGENT
                </span>
              </Typography>
            </Link>
          </div>
          <div ref={rewardRef} className="relative">
            <Link
              href={PATHS.DOCS}
              className="flex items-center gap-2 px-4 py-3 hover:bg-white/10 transition-all duration-300 group"
              onClick={(e) => {
                e.preventDefault();
                handleTabClick("DOCS");
              }}
            >
              <Typography
                font="geistMono"
                size="sm"
                className={
                  activeTab === "DOCS"
                    ? "text-embossed"
                    : "text-submerged group-hover:text-embossed/80"
                }
              >
                <span className="uppercase transition-colors duration-300">
                  DOCS
                </span>
              </Typography>
            </Link>
          </div>
        </div>
      </div>

      {/* Logo - Left aligned on mobile, center on desktop */}
      <Link
        href="/"
        className={`flex flex-row items-center gap-2 md:absolute md:left-1/2 md:top-1/2 md:transform md:-translate-x-1/2 md:-translate-y-1/2`}
      >
        <div className="relative w-8 h-8 md:w-10 md:h-10 flex items-center justify-center">
          <Image src={"/images/logo.png"} alt="logo" width={40} height={40} />
        </div>
        <Typography
          font="darkerGrotesk"
          size="2xl"
          weight="bold"
          gradient={true}
          className="transition-all duration-300"
        >
          Tasmil Finance
        </Typography>
      </Link>

      {/* Mobile Menu Toggle - Right aligned on mobile */}
      <div className="md:hidden">
        <button
          onClick={toggleMobileMenu}
          className="p-2 hover:bg-white/5 rounded-md transition-colors duration-300"
        >
          <FiMenu className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* CTA Button (Desktop) - Right side */}
      <div className="hidden md:block">
        <Button
          variant="gradient"
          size="default"
          className="font-mono text-black font-semibold text-sm uppercase py-2 px-4 rounded-lg transition-all duration-300 hover:tracking-wider"
          onClick={() => router.push(PATHS.DEFI_AGENT)}
        >
          LAUNCH APP
        </Button>
      </div>

      {/* Mobile Menu Modal with slide-down animation */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop overlay with blur effect */}
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-[999]"
            onClick={toggleMobileMenu}
            style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }}
          />

          {/* Modal content */}
          <div
            className="fixed inset-0 w-full h-[100dvh] bg-[#080a06]/95 z-[1000] flex flex-col animate-slide-down overflow-y-auto"
            style={{
              animationDuration: "0.3s",
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
          >
            {/* Top navigation bar */}
            <header className="sticky top-0 flex w-full h-20 items-center justify-between px-4 py-8 bg-black/80 backdrop-blur-[32px] z-[1001]">
              <div className="flex items-center gap-2.5">
                <button
                  onClick={toggleMobileMenu}
                  className="relative w-10 h-10 rounded-full overflow-hidden flex items-center justify-center"
                >
                  <FiX className="w-6 h-6 text-white" />
                </button>
              </div>

              {/* {activeAccount?.address ? ( */}
              {true ? (
                // When wallet is connected, show Launch Terminal button
                <Button
                  variant="gradient"
                  size="default"
                  className="font-mono text-black font-semibold text-sm uppercase tracking-tight hover:tracking-wider transition-all duration-300"
                  // onClick={handleLaunchApp}
                >
                  LAUNCH TERMINAL
                </Button>
              ) : (
                // When wallet is not connected, show Connect button with LAUNCH TERMINAL label
                <div className="bg-white hover:bg-white/90 rounded-lg overflow-hidden shadow-[0px_8px_8px_-4px_#b8bfc980] hover:shadow-[0px_10px_15px_-3px_#b8bfc980] transition-all duration-300 hover:scale-105">
                  <ConnectButton label="LAUNCH TERMINAL" />
                </div>
              )}
            </header>

            {/* Navigation menu */}
            <nav className="inline-flex flex-col items-start gap-8 w-full">
              <div className="inline-flex flex-col items-start w-full">
                {menuItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex w-full items-center justify-between py-8 px-4 border-b border-white/10 hover:bg-white/5 transition-all duration-300 cursor-pointer"
                    onClick={() => {
                      handleTabClick(item.label as any);
                      toggleMobileMenu();
                    }}
                  >
                    <div className="inline-flex items-center gap-2">
                      <div
                        className={`font-mono font-normal text-sm ${activeTab === item.label ? "text-primary" : "text-white"}`}
                      >
                        {item.label}
                      </div>
                    </div>
                    {item.icon}
                  </div>
                ))}
              </div>
            </nav>

            {/* Bottom content with social icons and logo */}
            <div className="flex flex-col items-center justify-end gap-12 p-6 flex-1 w-full">
              {/* Social media icons */}
              <div className="flex flex-row items-center justify-center gap-2 w-full">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        href={PATHS.X}
                        aria-label="Twitter"
                        className="group"
                      >
                        <div className="relative flex items-center justify-center h-10 w-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/5 hover:bg-white/20">
                          <BsTwitterX className="w-4 h-4 text-white group-hover:scale-110" />
                          <div className="absolute inset-0 rounded-full border border-white/20 group-hover:border-white/40"></div>
                        </div>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      <span>Twitter</span>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        href={PATHS.TELEGRAM}
                        aria-label="Telegram"
                        className="group"
                      >
                        <div className="relative flex items-center justify-center h-10 w-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/5 hover:bg-white/20">
                          <FaTelegram className="w-4 h-4 text-white group-hover:scale-110" />
                          <div className="absolute inset-0 rounded-full border border-white/20 group-hover:border-white/40"></div>
                        </div>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      <span>Telegram</span>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              {/* byData logo */}
              <Link
                href="/"
                className={`flex flex-row items-center gap-2 md:absolute md:left-1/2 md:top-1/2 md:transform md:-translate-x-1/2 md:-translate-y-1/2`}
              >
                <div className="relative w-8 h-8 md:w-10 md:h-10 flex items-center justify-center">
                  <Image
                    src={"/images/logo.png"}
                    alt="logo"
                    width={40}
                    height={40}
                  />
                </div>
                <Typography
                  font="darkerGrotesk"
                  size="2xl"
                  weight="bold"
                  gradient={true}
                  className="transition-all duration-300"
                >
                  Tasmil Finance
                </Typography>
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// Update Navbar component props
interface NavbarProps {
  onSectionClick?: (sectionId: SectionId) => void;
}

export const Navbar = ({ onSectionClick }: NavbarProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAnnouncementVisible, setIsAnnouncementVisible] = useState(true);
  const lastScrollY = useRef(0);
  const scrollTimeout = useRef<NodeJS.Timeout>();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      // Clear existing timeout
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }

      const currentScrollY = window.scrollY;

      // Debounce the announcement visibility change
      scrollTimeout.current = setTimeout(() => {
        if (currentScrollY > lastScrollY.current && currentScrollY > 0) {
          // Scrolling down
          setIsAnnouncementVisible(false);
        } else if (currentScrollY === 0) {
          // At the top of the page
          setIsAnnouncementVisible(true);
        } else if (currentScrollY < lastScrollY.current) {
          // Scrolling up but not at top
          setIsAnnouncementVisible(true);
        }

        lastScrollY.current = currentScrollY;
      }, 50); // Small delay for smoother transitions
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full z-30 flex flex-col">
      {/* Announcement Bar */}
      {/* <div
        className={`transform transition-transform duration-300 ease-in-out ${
          isAnnouncementVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <AnnouncementBar />
      </div> */}

      {/* Main Navbar */}
      <div
        className={`transform transition-all duration-300 ease-in-out ${
          isAnnouncementVisible ? "translate-y-0" : "-translate-y-20"
        }`}
      >
        <MainNavbar
          isMobileMenuOpen={isMobileMenuOpen}
          toggleMobileMenu={toggleMobileMenu}
          isAnnouncementVisible={isAnnouncementVisible}
          onSectionClick={onSectionClick}
        />
      </div>
    </div>
  );
};
