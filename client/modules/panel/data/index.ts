import {
  LayoutDashboard,
  ListOrdered,
  MessageSquare,
  PackagePlus,
  Settings,
  ShieldCheck,
  Tags,
} from "lucide-react";

export const panelLinks = [
  {
    href: "/dashboard",
    label: "نمای کلی",
    icon: LayoutDashboard,
    roles: ["admin", "seller", "customer"],
  },
  {
    href: "/dashboard/listings",
    label: "آگهی‌های من",
    icon: ListOrdered,
    roles: ["seller", "admin"],
  },
  {
    href: "/dashboard/create-listing",
    label: "ثبت آگهی جدید",
    icon: PackagePlus,
    roles: ["seller", "admin"],
  },
  {
    href: "/dashboard/messages",
    label: "پیام‌ها",
    icon: MessageSquare,
    roles: ["admin", "seller", "customer"],
  },

  { href: "/dashboard/admin", label: "مدیریت آگهی‌ها", icon: ShieldCheck, roles: ["admin"] },
  {
    href: "/dashboard/admin/categories",
    label: "مدیریت دسته‌بندی‌ها",
    icon: Tags,
    roles: ["admin"],
  },

  {
    href: "/dashboard/settings",
    label: "تنظیمات",
    icon: Settings,
    roles: ["admin", "seller", "customer"],
  },
];
