export const NAV_LINKS = [
  { href: "/", label: "Key Insights" },
  { href: "/games", label: "Current Games" },
  { href: "/concepts", label: "Future Concepts" },
] as const;

export type NavLink = (typeof NAV_LINKS)[number];
