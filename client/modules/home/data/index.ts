import { Bot, Car, CreditCard, ShoppingBag } from "lucide-react";

export const features = [
  {
    title: "بازارچه نبض",
    description: "خرید و فروش آسان کالا، ثبت آگهی و بررسی نظرات خریداران قبلی در یک پلتفرم هوشمند.",
    icon: ShoppingBag,
    color: "text-primary",
    bgColor: "bg-primary/10 group-hover:bg-primary/20",
    shadowColor: "hover:shadow-primary/20",
    href: "/listings",
  },
  {
    title: "حمل و نقل",
    description: "درخواست سریع خودرو، ردیابی لحظه‌ای مسیر و سفرهای راحت و امن با چند لمس.",
    icon: Car,
    color: "text-accent",
    bgColor: "bg-accent/10 group-hover:bg-accent/20",
    shadowColor: "hover:shadow-accent/20",
    href: "#",
  },
  {
    title: "فین‌تک و پرداخت",
    description: "پرداخت قبوض، خرید شارژ و انجام روزانه تراکنش‌های مالی با بالاترین امنیت.",
    icon: CreditCard,
    color: "text-destructive",
    bgColor: "bg-destructive/10 group-hover:bg-destructive/20",
    shadowColor: "hover:shadow-destructive/20",
    href: "#",
  },
  {
    title: "دستیار هوشمند",
    description: "پاسخگویی لحظه‌ای به سوالات شما، پشتیبانی ۲۴ ساعته و مدیریت خودکار وظایف با AI.",
    icon: Bot,
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10 group-hover:bg-yellow-500/20",
    shadowColor: "hover:shadow-yellow-500/20",
    href: "#",
  },
];
