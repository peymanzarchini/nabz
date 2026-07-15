import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const CtaSection = () => {
  return (
    <section className="py-20 px-4 relative overflow-hidden">
      <div className="max-w-4xl mx-auto relative rounded-sm p-10 md:p-16 text-center shadow-2xl animate-slide-up overflow-hidden">
        {/* پس‌زمینه گرادیانت متحرک */}
        <div className="absolute inset-0 bg-linear-to-r from-primary via-purple-600 to-accent animate-gradient-bg z-0"></div>

        {/* لایه شیشه‌ای روی گرادیانت برای خوانایی بهتر متن */}
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm z-0"></div>

        <div className="relative z-10 space-y-6">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
            همین امروز به نبض بپیوندید!
          </h2>
          <p className="text-white/90 mb-8 text-lg max-w-xl mx-auto">
            از هزاران آگهی، حمل‌ونقل سریع و خدمات بی‌نظیر بهره‌مند شوید. ثبت‌نام رایگان است!
          </p>

          <Link href="/register">
            <button className="bg-white text-primary hover:bg-white/90 font-bold shadow-xl transition-transform hover:scale-105 px-10 py-4 rounded-sm text-lg cursor-pointer group flex items-center gap-2 mx-auto">
              ثبت‌نام رایگان
              <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
