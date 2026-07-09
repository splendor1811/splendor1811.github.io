import {
  LayoutDashboard,
  Library,
  FolderTree,
  Share2,
  Route,
  Repeat,
  Activity,
  Star,
  Settings,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  key?: string; // for "g then <key>" navigation
}

export const PRIMARY_NAV: NavItem[] = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, key: "d" },
  { to: "/library", label: "Library", icon: Library, key: "l" },
  { to: "/topics", label: "Topics", icon: FolderTree, key: "t" },
  { to: "/graph", label: "Knowledge Graph", icon: Share2, key: "g" },
  { to: "/roadmap", label: "Roadmap", icon: Route, key: "r" },
  { to: "/review", label: "Review", icon: Repeat, key: "v" },
  { to: "/activity", label: "Activity", icon: Activity, key: "a" },
  { to: "/favorites", label: "Favorites", icon: Star, key: "f" },
];

export const FOOTER_NAV: NavItem[] = [{ to: "/settings", label: "Settings", icon: Settings }];
