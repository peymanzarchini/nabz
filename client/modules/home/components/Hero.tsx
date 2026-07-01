import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Car, CreditCard, ArrowLeft, Sparkles, Zap } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-[calc(100vh-95px)] flex items-center overflow-hidden pb-30">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-125 h-125 bg-linear-to-br from-primary/20 via-purple-500/10 to-accent/20 rounded-full blur-[120px] animate-pulse-slow animate-gradient-bg"></div>
        <div className="absolute bottom-1/4 left-1/4 w-100 h-100 bg-linear-to-tl from-accent/15 via-blue-500/10 to-primary/10 rounded-full blur-[100px] animate-pulse-slow animate-delay-200 animate-gradient-bg"></div>

        <div className="absolute top-20 left-20 w-32 h-32 border border-primary/10 rounded-full animate-pulse-slow animate-delay-400"></div>
        <div className="absolute bottom-40 right-40 w-48 h-48 border border-accent/10 rounded-full animate-pulse-slow animate-delay-600"></div>

        <div className="absolute top-1/3 right-1/4 w-16 h-16 border-2 border-accent/10 rotate-45 animate-[spin_30s_linear_infinite]"></div>
        <div className="absolute bottom-1/3 left-1/4 w-10 h-10 border border-primary/10 rotate-12 animate-[spin_45s_linear_infinite_reverse]"></div>

        <svg
          className="absolute bottom-1/4 left-1/3 w-12 h-12 text-primary/10 animate-float animate-delay-200"
          viewBox="0 0 40 40"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M20 4L36 36H4L20 4Z" />
        </svg>

        <svg
          className="absolute top-1/2 left-20 w-10 h-10 text-destructive/10 animate-[spin_40s_linear_infinite_reverse]"
          viewBox="0 0 40 40"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M20 2L36.32 11V29L20 38L3.68 29V11L20 2Z" />
        </svg>

        <div className="absolute bottom-20 right-1/3 text-accent/10 animate-pulse-slow animate-delay-600 text-4xl font-light select-none">
          +
        </div>

        <div className="absolute top-1/3 left-1/4 w-2 h-2 bg-primary rounded-full animate-pulse-slow shadow-lg shadow-primary/50"></div>
        <div className="absolute bottom-1/3 right-1/3 w-3 h-3 bg-accent rounded-full animate-pulse-slow animate-delay-200 shadow-lg shadow-accent/50"></div>
        <div className="absolute top-1/2 right-10 w-2 h-2 bg-destructive rounded-full animate-pulse-slow animate-delay-400 shadow-lg shadow-destructive/50"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 text-center md:text-right space-y-8 animate-slide-up">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-5 py-2 text-sm font-bold text-primary backdrop-blur-sm shadow-inner shadow-primary/10">
            <Sparkles className="h-4 w-4" />
            سوپراپلیکیشن نسل جدید
          </div>{" "}
          <h1 className="text-3xl sm:text-5xl lg:text-7xl font-black tracking-normal text-foreground leading-tight">
            <span className="whitespace-nowrap">هر کاری داری،</span>
            <br className="hidden md:block" />
            <span className="bg-linear-to-l from-primary via-purple-500 to-accent bg-clip-text text-transparent whitespace-nowrap">
              یه نبض کافیه!
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto md:mx-0 leading-relaxed">
            از بازارچه‌ای با هزاران آگهی تا حمل‌ونقل سریع و پرداخت‌های امن. همه‌چیز برای یک زندگی
            راحت، در یک اپلیکیشن.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Link href="/register">
              <Button
                size="lg"
                className="w-full sm:w-auto text-lg px-8 py-7 bg-linear-to-l from-primary via-purple-600 to-accent hover:brightness-110 shadow-xl shadow-primary/30 transition-all hover:scale-105 group rounded-xl cursor-pointer text-white border-0"
              >
                شروع کنید
                <ArrowLeft className="mr-2 h-5 w-5 transition-transform group-hover:-translate-x-1" />
              </Button>
            </Link>
            <Link href="/listings">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto text-lg px-8 py-7 border-primary/30 hover:bg-primary/10 backdrop-blur-sm rounded-xl cursor-pointer bg-white/40 dark:bg-gray-900/40 hover:border-primary/60 transition-all"
              >
                مشاهده آگهی‌ها
              </Button>
            </Link>
          </div>
        </div>

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
      </div>
    </section>
  );
};

export default HeroSection;
