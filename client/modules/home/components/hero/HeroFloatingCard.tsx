import Link from "next/link";
import { ShoppingBag, Car, CreditCard, ArrowLeft, Zap } from "lucide-react";

const HeroFloatingCards = () => {
  return (
    <div className="flex-1 hidden md:flex justify-center relative h-125 w-full animate-slide-up animate-delay-400">
      <Link
        href="/listings?categoryId=1"
        className="absolute top-10 right-10 w-80 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl rounded-3xl border border-white/30 dark:border-gray-700/30 shadow-2xl p-8 flex flex-col gap-5 transform rotate-3 hover:rotate-0 transition-all duration-500 hover:shadow-primary/20 hover:shadow-2xl cursor-pointer group"
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
            <ShoppingBag className="h-7 w-7" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-foreground">بازارچه نبض</h3>
            <p className="text-sm text-muted-foreground">جدیدترین آگهی‌ها</p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-black/5 dark:bg-white/5 rounded-xl p-3">
          <div className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-700 shrink-0 flex items-center justify-center text-muted-foreground">
            <Zap className="h-5 w-5" />
          </div>
          <div className="flex-1 space-y-1.5">
            <div className="h-2.5 w-3/4 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
            <div className="h-2 w-1/2 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
          </div>
          <span className="text-xs font-bold text-primary">۶۵۰ ت</span>
        </div>

        <div className="mt-auto flex justify-end text-primary text-sm font-semibold group-hover:-translate-x-2.5 transition-transform items-center gap-1">
          مشاهده و خرید <ArrowLeft className="h-4 w-4" />
        </div>
      </Link>

      <div className="absolute bottom-20 left-10 w-64 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-white/30 dark:border-gray-700/30 shadow-xl p-5 flex items-center gap-4 transform -rotate-6 hover:rotate-0 transition-all duration-500 cursor-pointer hover:shadow-accent/20 hover:shadow-lg">
        <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center text-accent shrink-0">
          <Car className="h-6 w-6" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground">درخواست تاکسی</p>
          <p className="font-bold text-sm text-foreground">کمتر از ۲ دقیقه</p>
        </div>
      </div>

      <div className="absolute top-1/2 left-1/3 w-52 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-white/30 dark:border-gray-700/30 shadow-xl p-5 flex items-center gap-4 transform rotate-12 hover:rotate-0 transition-all duration-500 animate-float cursor-pointer hover:shadow-destructive/20 hover:shadow-lg">
        <div className="w-12 h-12 rounded-xl bg-destructive/20 flex items-center justify-center text-destructive shrink-0">
          <CreditCard className="h-6 w-6" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground">پرداخت آنی</p>
          <p className="font-bold text-sm text-foreground">امن و سریع</p>
        </div>
      </div>
    </div>
  );
};

export default HeroFloatingCards;
