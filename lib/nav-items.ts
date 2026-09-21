import { Home, Search, Library, Download, BarChart3, WavesLadder } from "lucide-react";
import type { NavItem } from "@/types/nav";

export const primaryNavItems: NavItem[] = [
  { label: "Home", href: "/", icon: Home },
  { label: "Search", href: "/search", icon: Search },
  { label: "Moods", href: "/moods", icon: WavesLadder },
  { label: "Your Library", href: "/library", icon: Library },
];

export const secondaryNavItems: NavItem[] = [
  { label: "Downloads", href: "/downloads", icon: Download },
  { label: "Stats", href: "/stats", icon: BarChart3 },
];

export const mobileNavItems: NavItem[] = [
  { label: "Home", href: "/", icon: Home },
  { label: "Search", href: "/search", icon: Search },
  { label: "Moods", href: "/moods", icon: WavesLadder },
  { label: "Library", href: "/library", icon: Library },
];
