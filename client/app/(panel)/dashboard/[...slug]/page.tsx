import Link from "next/link";
import { LayoutDashboard, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PanelNotFound() {
  return (
    <div className="h-full w-full flex items-center justify-center p-4">
      <div className="text-center max-w-md w-full bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 dark:bg-red-500/10 text-red-500 mb-6">
          <SearchX className="h-8 w-8" />
        </div>

        <h1 className="text-5xl font-black text-zinc-800 dark:text-white mb-2">۴۰۴</h1>

        <h2 className="text-lg font-bold text-zinc-700 dark:text-zinc-200 mb-3">
          این بخش در داشبورد وجود ندارد
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-7 mb-8">
          به نظر می‌رسد لینکی که وارد کرده‌اید اشتباه است یا دسترسی به آن بخش در پنل کاربری شما
          مقدور نیست.
        </p>

        <Link href="/dashboard">
          <Button className="bg-linear-to-r from-violet-600 to-teal-500 text-white cursor-pointer py-5 rounded-sm">
            <LayoutDashboard className="h-4 w-4 ml-2" />
            بازگشت به نمای کلی
          </Button>
        </Link>
      </div>
    </div>
  );
}
