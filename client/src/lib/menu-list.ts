import {
  Wallet,
  Brain,
  Landmark,
  ChartNoAxesCombined,
  Award,
  HelpCircle,
  Settings,
  LucideIcon
} from "lucide-react";
import { PATHS } from "@/constants/routes";

type Submenu = {
  href: string;
  label: string;
  active?: boolean;
};

type Menu = {
  href: string;
  label: string;
  active?: boolean;
  icon: LucideIcon;
  submenus?: Submenu[];
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function getMenuList(pathname: string): Group[] {
  console.log(pathname);
  return [
    {
      groupLabel: "",
      menus: [
        {
          href: PATHS.DASHBOARD,
          label: "Dashboard",
          icon: Wallet,
        },
        {
          href: PATHS.AI_AGENT,
          label: "Ai Agents",
          icon: Brain,
        },
        {
          href: PATHS.DEFI_AGENT,
          label: "Defi Agent",
          icon: Landmark,
        },
        {
          href: PATHS.TRENDING,
          label: "Trending",
          icon: ChartNoAxesCombined,
        },
        {
          href: PATHS.PORTFOLIO,
          label: "Portfolio",
          icon: Award,
        },
      ]
    },
    {
      groupLabel: "Settings",
      menus: [
        {
          href: PATHS.SETTINGS,
          label: "Settings",
          icon: Settings,
        },
        {
          href: PATHS.HELP,
          label: "Help & FAQ",
          icon: HelpCircle,
        },
      ]
    }
  ];
}
