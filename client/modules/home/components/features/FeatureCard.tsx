import Link from "next/link";
import { ArrowLeft, LucideIcon } from "lucide-react";

interface Feature {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  shadowColor: string;
  href: string;
}

interface FeatureCardProps {
  feature: Feature;
  index: number;
}

const FeatureCard = ({ feature, index }: FeatureCardProps) => {
  const Icon = feature.icon;

  return (
    <Link
      href={feature.href}
      className={`group flex flex-col bg-white/50 dark:bg-gray-900/40 backdrop-blur-xl border border-border/30 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${feature.shadowColor} cursor-pointer animate-slide-up`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div
        className={`w-14 h-14 rounded-2xl ${feature.bgColor} flex items-center justify-center mb-5 transition-colors duration-300`}
      >
        <Icon className={`h-7 w-7 ${feature.color}`} />
      </div>

      <h3 className="text-xl font-bold text-foreground mb-2">{feature.title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed mb-6">{feature.description}</p>

      <div className="flex items-center text-sm font-semibold text-muted-foreground group-hover:text-primary transition-colors mt-auto">
        ورود به بخش
        <ArrowLeft className="h-4 w-4 mr-1 transition-transform group-hover:-translate-x-1" />
      </div>
    </Link>
  );
};

export default FeatureCard;
