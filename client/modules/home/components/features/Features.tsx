import { features } from "../../data";
import FeatureCard from "./FeatureCard";

const FeaturesSection = () => {
  return (
    <section className="pt-5 pb-25 relative">
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
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
