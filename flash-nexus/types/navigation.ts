import type { LucideIcon } from "lucide-react";

export interface NavItem {
  title: string;
  arabicTitle?: string;
  href: string;
  icon?: LucideIcon;
}

export interface NavGroup {
  id: string;
  title: string;
  arabicTitle?: string;
  items: NavItem[];
}
