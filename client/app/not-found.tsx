import Link from "next/link";
import { Home, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/ui/Logo";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-violet-50 to-teal-50 dark:from-zinc-950 dark:to-zinc-900 px-4">
      <div className="text-center max-w-md w-full bg-white dark:bg-zinc-900 p-8 sm:p-12 rounded-3xl shadow-2xl border border-zinc-100 dark:border-zinc-800 animate-slide-up">
        <div className="flex justify-center mb-8">
          <Logo width={80} height={80} />
        </div>

        <div className="relative inline-block mb-6">
          <h1 className="text-7xl sm:text-8xl font-black bg-linear-to-l from-violet-600 to-teal-500 bg-clip-text text-transparent">
            ۴۰۴
          </h1>
          <div className="absolute -top-2 -right-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 transform rotate-12 animate-pulse-slow shadow-lg">
            <SearchX className="h-3.5 w-3.5" />
            یافت نشد
          </div>
        </div>

        <h2 className="text-xl font-bold text-zinc-800 dark:text-white mb-3">
          صفحه مورد نظر پیدا نشد!
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-7 mb-8">
          ممکن است آدرس را اشتباه وارد کرده باشید یا این صفحه دیگر وجود نداشته باشد. نگران نباشید،
          بیایید شما را به مسیر درست هدایت کنیم.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/">
            <Button
              size="lg"
              className="w-full sm:w-auto bg-linear-to-r from-violet-600 to-teal-500 text-white shadow-lg cursor-pointer"
            >
              <Home className="h-4 w-4 ml-2" />
              بازگشت به خانه
            </Button>
          </Link>
          <Link href="/listings">
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer"
            >
              مشاهده آگهی‌ها
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
