"use client";

import Link from "next/link";
import { Loader2, MessageSquare, PackagePlus } from "lucide-react";
import { useAuth } from "@/lib/providers/AuthProvider";
import { useDashboardStats } from "@/modules/panel/hooks/useAdmin";
import { Button } from "@/components/ui/button";
import { adminCardsConfig, statCardsConfig } from "@/modules/panel/data";
import StatCard from "@/modules/panel/components/StatCard";

const MainPage = () => {
  const { user } = useAuth();
  const { data: stats, isLoading } = useDashboardStats();

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
        <h1 className="text-2xl font-black text-foreground">نمای کلی</h1>
        <p className="text-sm text-muted-foreground mt-1">خلاصه فعالیت‌های شما در نبض</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCardsConfig.map((card, idx) => (
          <Link href={card.link} key={idx}>
            <StatCard
              icon={card.icon}
              label={card.label}
              value={stats?.[card.key as keyof typeof stats] || 0}
              iconClass={card.iconClass}
            />
          </Link>
        ))}
      </div>

      {user?.role === "admin" && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-foreground">مدیریت سیستم</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {adminCardsConfig.map((card, idx) => (
              <Link href={card.link} key={idx}>
                <StatCard
                  icon={card.icon}
                  label={card.label}
                  value={stats?.[card.key as keyof typeof stats] || 0}
                  iconClass={card.iconClass}
                  variant="admin"
                />
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="bg-card border border-border rounded-sm p-6 shadow-sm">
        <h2 className="text-lg font-bold text-foreground mb-4">دسترسی سریع</h2>
        <div className="flex flex-wrap gap-3">
          <Button asChild variant="secondary" className="rounded-lg cursor-pointer">
            <Link href="/dashboard/create-listing">
              <PackagePlus className="h-4 w-4" />
              ثبت آگهی جدید
            </Link>
          </Button>
          <Button asChild variant="outline" className="rounded-lg cursor-pointer">
            <Link href="/dashboard/messages">
              <MessageSquare className="h-4 w-4" />
              صندوق پیام‌ها
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
