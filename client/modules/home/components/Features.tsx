import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { features } from "../data";

const FeaturesSection = () => {
  return (
    <section className=" pt-5 pb-25 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 max-w-2xl mx-auto animate-slide-up">
          <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4">
            خدمات بی‌نهایت، در یک نگاه
          </h2>
          <p className="text-muted-foreground text-lg">
            نیازی به نصب ده‌ها اپلیکیشن ندارید. همه آنچه برای روزمرگی نیاز دارید در نبض جمع شده است.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Link
              key={feature.title}
              href={feature.href}
              className={`group flex flex-col bg-white/50 dark:bg-gray-900/40 backdrop-blur-xl border border-border/30 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${feature.shadowColor} cursor-pointer animate-slide-up`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div
                className={`w-14 h-14 rounded-2xl ${feature.bgColor} flex items-center justify-center mb-5 transition-colors duration-300`}
              >
                <feature.icon className={`h-7 w-7 ${feature.color}`} />
              </div>

              <h3 className="text-xl font-bold text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                {feature.description}
              </p>

              <div className="flex items-center text-sm font-semibold text-muted-foreground group-hover:text-primary transition-colors mt-auto">
                ورود به بخش
                <ArrowLeft className="h-4 w-4 mr-1 transition-transform group-hover:-translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
