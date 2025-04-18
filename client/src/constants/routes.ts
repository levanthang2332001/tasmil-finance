export const PATHS = {
  DASHBOARD: "/dashboard",
  AI_AGENT: "/ai-agent",
  PORTFOLIO: "/portfolio",
  TRENDING: "/trending",
  DEFI_AGENT: "/defi-agent",
  SETTINGS: "/settings",
  HELP: "/help",

  LANDING_PAGE: "/",
  NEXT: "/_next",
  FAVICON: "/favicon.ico",
  ROBOTS: "/robots.txt",
};

export const PUBLIC_PATHS = [
  PATHS.LANDING_PAGE,
  PATHS.NEXT,
  PATHS.FAVICON,
  PATHS.ROBOTS,
];

export const PROTECTED_PATHS = [
  PATHS.DASHBOARD,
  PATHS.AI_AGENT,
  PATHS.PORTFOLIO,
  PATHS.TRENDING,
  PATHS.DEFI_AGENT,
  PATHS.SETTINGS,
  PATHS.HELP,
];
