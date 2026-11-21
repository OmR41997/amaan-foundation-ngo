export type NavItem = {
  label: string;
  href?: string;
  icon?: string;
  children?: NavItem[];
  disabled?: boolean;
  badge?: string;
};

export type NavSection = {
  heading?: string;
  items: NavItem[];
};

export const adminNavSections: NavSection[] = [
  {
    heading: "Overview",
    items: [
      {
        label: "Dashboard",
        href: "/admin",
        icon: "dashboard",
      },
    ],
  },
  {
    heading: "Core Management",
    items: [
      {
        label: "Member Requests",
        href: "/admin/member-requests",
        icon: "requests",
      },
      {
        label: "Teams",
        href: "/admin/teams",
        icon: "teams",
      },
      {
        label: "Gallery",
        href: "/admin/gallery",
        icon: "gallery",
      },
    ],
  },
  {
    heading: "Settings",
    items: [
      {
        label: "Change Password",
        href: "/admin/change-password",
        icon: "settings",
      },
    ],
  },
];


