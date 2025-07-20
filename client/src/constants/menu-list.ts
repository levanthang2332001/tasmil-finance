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
  image: string;
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
          image: "/sidebar/dashboard.png",
        },

        {
          href: PATHS.DEFI_AGENT,
          label: "Defi Agent",
          image: "/sidebar/defi-agent.png",
        },
        {
          href: PATHS.COMMUNITY,
          label: "Community",
          image: "/sidebar/community.png",
        },
        {
          href: PATHS.PORTFOLIO,
          label: "Portfolio",
          image: "/sidebar/portfolio.png",
        },
      ],
    },
  ];
}
