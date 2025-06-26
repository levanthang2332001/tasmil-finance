import {
  Wallet,
  Brain,
  Landmark,
  ChartNoAxesCombined,
  Award,
  HelpCircle,
  Settings,
  LucideIcon,
} from "lucide-react";
import { PATHS } from "@/constants/routes";

export type SubmenuType = {
  href: string;
  label: string;
  active?: boolean;
};

export type MenuType = {
  href: string;
  label: string;
  active?: boolean;
  icon: LucideIcon;
  submenus?: SubmenuType[];
};

export type GroupType = {
  groupLabel: string;
  menus: MenuType[];
};

export function getMenuList(): GroupType[] {
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
      ],
    },
    {
      groupLabel: "",
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
      ],
    },
  ];
}
