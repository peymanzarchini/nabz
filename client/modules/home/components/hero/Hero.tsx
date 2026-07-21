import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles } from "lucide-react";
import HeroBackground from "./HeroBackground";
import HeroFloatingCards from "./HeroFloatingCard";

const HeroSection = () => {
  return (
    <section className="relative min-h-[calc(100vh-95px)] flex items-center overflow-hidden pb-30">
      <HeroBackground />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 text-center md:text-right space-y-8 animate-slide-up">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-5 py-2 text-sm font-bold text-primary backdrop-blur-sm shadow-inner shadow-primary/10">
            <Sparkles className="h-4 w-4" />
            سوپراپلیکیشن نسل جدید
          </div>

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
                size="default"
                className="w-full sm:w-auto text-lg px-8 py-7 bg-linear-to-l from-primary via-purple-600 to-accent hover:brightness-110 shadow-xl shadow-primary/30 transition-all hover:scale-105 group cursor-pointer text-white border-0 rounded-sm"
              >
                شروع کنید
                <ArrowLeft className="mr-2 h-5 w-5 transition-transform group-hover:-translate-x-1" />
              </Button>
            </Link>
            <Link href="/listings">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto text-lg px-8 py-7 border-primary/30 hover:bg-primary/10 backdrop-blur-sm rounded-sm cursor-pointer bg-white/40 dark:bg-gray-900/40 hover:border-primary/60 transition-all"
              >
                مشاهده آگهی‌ها
              </Button>
            </Link>
          </div>
        </div>

        <HeroFloatingCards />
      </div>
    </section>
  );
};

export default HeroSection;
