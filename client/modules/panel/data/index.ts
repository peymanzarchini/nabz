import {
  // Bot,
  Clock,
  LayoutDashboard,
  ListOrdered,
  MessageSquare,
  PackageCheck,
  PackagePlus,
  Settings,
  ShieldCheck,
  Tags,
  TrendingUp,
  XCircle,
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
    href: "/dashboard/admin/reviews",
    label: "مدیریت دیدگاه‌ها",
    icon: MessageSquare,
    roles: ["admin"],
  },
  // {
  //   href: "/dashboard/ai-assistant",
  //   label: "دستیار هوشمند",
  //   icon: Bot,
  //   roles: ["admin", "seller", "customer"],
  // },

  {
    href: "/dashboard/settings",
    label: "تنظیمات",
    icon: Settings,
    roles: ["admin", "seller", "customer"],
  },
];

export const statCardsConfig = [
  {
    label: "کل آگهی‌ها",
    key: "totalListings",
    icon: TrendingUp,
    iconClass: "bg-primary/10 text-primary",
    link: "/dashboard/listings",
  },
  {
    label: "منتشر شده",
    key: "activeListings",
    icon: PackageCheck,
    iconClass: "bg-emerald-500/10 text-emerald-500 dark:text-emerald-400",
    link: "/dashboard/listings",
  },
  {
    label: "در انتظار تایید",
    key: "pendingListings",
    icon: Clock,
    iconClass: "bg-amber-500/10 text-amber-500 dark:text-amber-400",
    link: "/dashboard/listings",
  },
  {
    label: "رد شده",
    key: "rejectedListings",
    icon: XCircle,
    iconClass: "bg-destructive/10 text-destructive",
    link: "/dashboard/listings",
  },
];

export const adminCardsConfig = [
  {
    label: "آگهی‌های در انتظار",
    key: "pendingListings",
    icon: ShieldCheck,
    iconClass: "bg-primary/10 text-primary",
    link: "/dashboard/admin",
  },
  {
    label: "دیدگاه‌های در انتظار",
    key: "pendingReviews",
    icon: MessageSquare,
    iconClass: "bg-secondary text-secondary-foreground",
    link: "/dashboard/admin/reviews",
  },
];
