import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";
import svgToDataUri from "mini-svg-data-uri";
import flattenColorPalette from "tailwindcss/lib/util/flattenColorPalette";

const config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    screens: {
      xs: "480px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontSize: {
        // Default sizes
        xs: ["10px", { lineHeight: "12px" }],
        sm: ["12px", { lineHeight: "14px" }],
        base: ["14px", { lineHeight: "16px" }],
        lg: ["16px", { lineHeight: "18px" }],
        xl: ["18px", { lineHeight: "20px" }],
        "2xl": ["20px", { lineHeight: "22px" }],
        "3xl": ["24px", { lineHeight: "26px" }],
        "3.5xl": ["26px", { lineHeight: "28px" }],
        "3.8xl": ["28px", { lineHeight: "30px" }],
        "4xl": ["32px", { lineHeight: "34px" }],
        "5xl": ["40px", { lineHeight: "42px" }],
        "6xl": ["48px", { lineHeight: "50px" }],
        "7xl": ["56px", { lineHeight: "58px" }],
        "8xl": ["64px", { lineHeight: "66px" }],
        "9xl": ["72px", { lineHeight: "74px" }],
        "10xl": ["80px", { lineHeight: "82px" }],

        // Darker Grotesk specific sizes
        "xs-darker": ["12px", { lineHeight: "16px" }],
        "sm-darker": ["14px", { lineHeight: "20px" }],
        "base-darker": ["16px", { lineHeight: "24px" }],
        "lg-darker": ["18px", { lineHeight: "28px" }],
        "xl-darker": ["20px", { lineHeight: "32px" }],
        "2xl-darker": ["24px", { lineHeight: "36px" }],
        "3xl-darker": ["32px", { lineHeight: "40px" }],
        "4xl-darker": ["40px", { lineHeight: "48px" }],
        "5xl-darker": ["48px", { lineHeight: "56px" }],
        "6xl-darker": ["56px", { lineHeight: "64px" }],
        "7xl-darker": ["64px", { lineHeight: "72px" }],
        "8xl-darker": ["72px", { lineHeight: "80px" }],
        "9xl-darker": ["80px", { lineHeight: "88px" }],
        "10xl-darker": ["88px", { lineHeight: "96px" }],

        // Lab Grotesk specific sizes
        "xs-lab": ["12px", { lineHeight: "16px" }],
        "sm-lab": ["14px", { lineHeight: "20px" }],
        "base-lab": ["16px", { lineHeight: "24px" }],
        "lg-lab": ["18px", { lineHeight: "28px" }],
        "xl-lab": ["20px", { lineHeight: "32px" }],
        "2xl-lab": ["24px", { lineHeight: "36px" }],
        "3xl-lab": ["32px", { lineHeight: "40px" }],
        "4xl-lab": ["40px", { lineHeight: "48px" }],
        "5xl-lab": ["48px", { lineHeight: "56px" }],
        "6xl-lab": ["56px", { lineHeight: "64px" }],
        "7xl-lab": ["64px", { lineHeight: "72px" }],
        "8xl-lab": ["72px", { lineHeight: "80px" }],
        "9xl-lab": ["80px", { lineHeight: "88px" }],
        "10xl-lab": ["88px", { lineHeight: "96px" }],

        // Geist Mono specific sizes
        "xs-geist": ["10px", { lineHeight: "16px" }],
        "sm-geist": ["12px", { lineHeight: "20px" }],
        "base-geist": ["14px", { lineHeight: "24px" }],
        "lg-geist": ["16px", { lineHeight: "24px" }],
        "xl-geist": ["18px", { lineHeight: "28px" }],
        "2xl-geist": ["20px", { lineHeight: "32px" }],
        "3xl-geist": ["24px", { lineHeight: "36px" }],
        "4xl-geist": ["32px", { lineHeight: "40px" }],
        "5xl-geist": ["40px", { lineHeight: "48px" }],
        "6xl-geist": ["48px", { lineHeight: "56px" }],
        "7xl-geist": ["56px", { lineHeight: "64px" }],
        "8xl-geist": ["64px", { lineHeight: "72px" }],
        "9xl-geist": ["72px", { lineHeight: "80px" }],
        "10xl-geist": ["80px", { lineHeight: "88px" }],

        // SF Pro Display specific sizes
        "xs-sfpro": ["10px", { lineHeight: "14px" }],
        "sm-sfpro": ["12px", { lineHeight: "16px" }],
        "base-sfpro": ["14px", { lineHeight: "20px" }],
        "lg-sfpro": ["16px", { lineHeight: "24px" }],
        "xl-sfpro": ["18px", { lineHeight: "28px" }],
        "2xl-sfpro": ["20px", { lineHeight: "32px" }],
        "3xl-sfpro": ["24px", { lineHeight: "36px" }],
        "4xl-sfpro": ["32px", { lineHeight: "40px" }],
        "5xl-sfpro": ["40px", { lineHeight: "48px" }],
        "6xl-sfpro": ["48px", { lineHeight: "56px" }],
        "7xl-sfpro": ["56px", { lineHeight: "64px" }],
        "8xl-sfpro": ["64px", { lineHeight: "72px" }],
        "9xl-sfpro": ["72px", { lineHeight: "80px" }],
        "10xl-sfpro": ["80px", { lineHeight: "88px" }],
      },
      fontFamily: {
        sans: [
          "var(--font-sf-pro)",
          "SF Pro Display",
          "-apple-system",
          "BlinkMacSystemFont",
          ...fontFamily.sans,
        ],
        mono: [
          "var(--font-geist-mono)",
          "Geist Mono",
          "Consolas",
          "Monaco",
          "Lucida Console",
          "monospace",
        ],
        geistMono: [
          "var(--font-geist-mono)",
          "Geist Mono",
          "Consolas",
          "Monaco",
          "Lucida Console",
          "monospace",
        ],
        darkerGrotesk: ["Darker Grotesk", "Inter", "system-ui", "sans-serif"],
        labGrotesk: ["Lab Grotesk", "Inter", "system-ui", "sans-serif"],
        ppNeue: [
          "var(--font-pp-neue)",
          "PP Neue Montreal",
          "Inter",
          "system-ui",
          "sans-serif",
        ],
        sfPro: [
          "var(--font-sf-pro)",
          "SF Pro Display",
          "-apple-system",
          "BlinkMacSystemFont",
          "system-ui",
          "sans-serif",
        ],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        embossed: "hsl(var(--embossed))",
        submerged: "hsl(var(--submerged))",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card-background))",
          foreground: "hsl(var(--card-foreground))",
          reflv1: "hsla(var(--ref-program-card-foreground-lv1))",
          reflv2: "hsla(var(--ref-program-card-foreground-lv2))",
        },
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsla(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        slate: {
          900: "#0f172a",
          950: "#020617",
        },
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "collapsible-down": {
          from: { height: "0", opacity: "0" },
          to: {
            height: "var(--radix-collapsible-content-height)",
            opacity: "1",
          },
        },
        "collapsible-up": {
          from: {
            height: "var(--radix-collapsible-content-height)",
            opacity: "1",
          },
          to: { height: "0", opacity: "0" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "fade-out": {
          from: { opacity: "1" },
          to: { opacity: "0" },
        },
        float: {
          "0%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
          "100%": { transform: "translateY(0px)" },
        },
        "float-wide": {
          "0%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(60px)" },
          "100%": { transform: "translateY(0px)" },
        },
        "float-reverse": {
          "0%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(10px)" },
          "100%": { transform: "translateY(0px)" },
        },
        "spin-once": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "scale-up": {
          "0%": { transform: "scale(0)" },
          "100%": { transform: "scale(1)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "collapsible-down": "collapsible-down 0.3s ease-out",
        "collapsible-up": "collapsible-up 0.3s ease-out",
        "fade-in": "fade-in 0.2s ease-out",
        "fade-out": "fade-out 0.2s ease-out",
        float: "float 3s ease-in-out infinite",
        "float-wide": "float-wide 4s ease-in-out infinite",
        "float-reverse": "float-reverse 3s ease-in-out infinite",
        "spin-once": "spin-once 1s ease-in-out forwards",
      },
      backgroundColor: {
        "card-reflv1": "hsla(var(--ref-program-card-foreground-lv1))",
        "card-reflv2": "hsla(var(--ref-program-card-foreground-lv2))",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    addVariablesForColors,
    function ({ matchUtilities, theme }: any) {
      matchUtilities(
        {
          "bg-grid": (value: any) => ({
            backgroundImage: `url("${svgToDataUri(
              `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="80" height="80" fill="none" stroke="${value}" stroke-width="0.4"><path d="M0 .5H79.5V80"/></svg>`,
            )}")`,
          }),
        },
        {
          values: flattenColorPalette(theme("backgroundColor")),
          type: "color",
        },
      );
    },
  ],
} satisfies Config;

function addVariablesForColors({ addBase, theme }: any) {
  const allColors = flattenColorPalette(theme("colors"));
  const newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val]),
  );

  addBase({
    ":root": newVars,
  });
}

export default config;
