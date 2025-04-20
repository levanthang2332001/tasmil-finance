"use client";

export default function BiophilicBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Background pattern from crypto-whale-whisper */}
      <div className="absolute inset-0 organic-pattern mix-blend-overlay opacity-30"></div>

      {/* Gradient blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-gradient-to-b from-[#1EAEDB]/30 to-transparent blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-gradient-to-t from-[#1EAEDB]/30 to-transparent blur-3xl"></div>
      <div className="absolute top-1/2 left-1/4 w-72 h-72 rounded-full bg-gradient-to-tr from-[#1EAEDB]/20 to-transparent blur-3xl"></div>

      {/* Organic patterns */}
      <svg
        className="absolute top-0 left-0 w-full h-full opacity-5"
        width="100%"
        height="100%"
      >
        <pattern
          id="pattern-circles"
          x="0"
          y="0"
          width="50"
          height="50"
          patternUnits="userSpaceOnUse"
          patternContentUnits="userSpaceOnUse"
        >
          <circle
            id="pattern-circle"
            cx="10"
            cy="10"
            r="1.6257413380501518"
            fill="none"
            stroke="#1EAEDB"
            strokeWidth="0.5"
          ></circle>
        </pattern>
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="url(#pattern-circles)"
        ></rect>
      </svg>

      {/* Grid lines */}
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-5"></div>

      {/* Animated floating particles - simulated with fixed elements */}
      <div className="absolute top-1/4 left-1/3 w-1 h-1 rounded-full bg-[#1EAEDB] animate-pulse-slow"></div>
      <div
        className="absolute top-2/3 left-1/5 w-1 h-1 rounded-full bg-[#1EAEDB] animate-pulse-slow"
        style={{ animationDelay: "1s" }}
      ></div>
      <div
        className="absolute top-1/2 left-3/4 w-1.5 h-1.5 rounded-full bg-[#1EAEDB] animate-float"
        style={{ animationDelay: "2s" }}
      ></div>
      <div
        className="absolute top-1/3 left-2/3 w-1 h-1 rounded-full bg-[#1EAEDB] animate-float"
        style={{ animationDelay: "0.5s" }}
      ></div>
      <div
        className="absolute top-3/4 right-1/4 w-1 h-1 rounded-full bg-[#1EAEDB] animate-pulse-slow"
        style={{ animationDelay: "1.5s" }}
      ></div>

      {/* Scrapbook texture overlay */}
      <div className="absolute inset-0 bg-scrapbook-texture opacity-5"></div>

      {/* Radial gradient overlay */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent to-black/30 opacity-70"></div>
    </div>
  );
}
