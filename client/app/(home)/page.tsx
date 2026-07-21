import AmazingOffersSection from "@/modules/home/components/amazing/AmazingOffer";
import CategoriesSection from "@/modules/home/components/Categories";
import CtaSection from "@/modules/home/components/Cta";
import FeaturesSection from "@/modules/home/components/features/Features";
import HeroSection from "@/modules/home/components/hero/Hero";

const HomePage = () => {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <AmazingOffersSection />
      <CategoriesSection />
      <CtaSection />
    </>
  );
};

export default HomePage;
