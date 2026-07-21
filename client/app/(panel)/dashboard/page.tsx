"use client";

import Link from "next/link";
import {
  Loader2,
  PackageCheck,
  Clock,
  XCircle,
  ShieldCheck,
  MessageSquare,
  PackagePlus,
  TrendingUp,
} from "lucide-react";
import { useAuth } from "@/lib/providers/AuthProvider";
import { useDashboardStats } from "@/modules/panel/hooks/useAdmin";

const MainPage = () => {
  const { user } = useAuth();
  const { data: stats, isLoading } = useDashboardStats();

  const statCards = [
    {
      label: "کل آگهی‌ها",
      value: stats?.totalListings || 0,
      icon: TrendingUp,
      color: "from-blue-500 to-cyan-500",
      link: "/dashboard/listings",
    },
    {
      label: "منتشر شده",
      value: stats?.activeListings || 0,
      icon: PackageCheck,
      color: "from-green-500 to-emerald-500",
      link: "/dashboard/listings",
    },
    {
      label: "در انتظار تایید",
      value: stats?.pendingListings || 0,
      icon: Clock,
      color: "from-yellow-500 to-orange-500",
      link: "/dashboard/listings",
    },
    {
      label: "رد شده",
      value: stats?.rejectedListings || 0,
      icon: XCircle,
      color: "from-red-500 to-rose-500",
      link: "/dashboard/listings",
    },
  ];

  const adminCards = [
    {
      label: "آگهی‌های در انتظار",
      value: stats?.pendingListings || 0,
      icon: ShieldCheck,
      color: "from-violet-500 to-purple-500",
      link: "/dashboard/admin",
    },
    {
      label: "دیدگاه‌های در انتظار",
      value: stats?.pendingReviews || 0,
      icon: MessageSquare,
      color: "from-pink-500 to-rose-500",
      link: "/dashboard/admin/reviews",
    },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-zinc-800 dark:text-white">نمای کلی</h1>
        <p className="text-sm text-zinc-500 mt-1">خلاصه فعالیت‌های شما در نبض</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, idx) => (
          <Link href={card.link} key={idx}>
            <div className="bg-white dark:bg-zinc-900 rounded-2xl p-5 border border-zinc-100 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow group cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-12 h-12 rounded-xl bg-linear-to-br ${card.color} flex items-center justify-center text-white shadow-lg`}
                >
                  <card.icon className="h-6 w-6" />
                </div>
                <span className="text-3xl font-black text-zinc-800 dark:text-white">
                  {card.value.toLocaleString("fa-IR")}
                </span>
              </div>
              <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{card.label}</p>
            </div>
          </Link>
        ))}
      </div>

      {user?.role === "admin" && (
        <div>
          <h2 className="text-lg font-bold text-zinc-700 dark:text-zinc-200 mb-4">مدیریت سیستم</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {adminCards.map((card, idx) => (
              <Link href={card.link} key={idx}>
                <div className="bg-white dark:bg-zinc-900 rounded-2xl p-5 border border-zinc-100 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow group cursor-pointer flex items-center justify-between">
                  <div>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-1">{card.label}</p>
                    <p className="text-2xl font-black text-zinc-800 dark:text-white">
                      {card.value.toLocaleString("fa-IR")} مورد
                    </p>
                  </div>
                  <div
                    className={`w-14 h-14 rounded-full bg-linear-to-br ${card.color} flex items-center justify-center text-white shadow-lg`}
                  >
                    <card.icon className="h-7 w-7" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-100 dark:border-zinc-800 shadow-sm">
        <h2 className="text-lg font-bold text-zinc-700 dark:text-zinc-200 mb-4">دسترسی سریع</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/dashboard/create-listing">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 rounded-lg font-medium text-sm hover:bg-violet-100 dark:hover:bg-violet-500/20 transition-colors cursor-pointer">
              <PackagePlus className="h-4 w-4" />
              ثبت آگهی جدید
            </button>
          </Link>
          <Link href="/dashboard/messages">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg font-medium text-sm hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors cursor-pointer">
              <MessageSquare className="h-4 w-4" />
              صندوق پیام‌ها
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
