import { AmazingOffersSection } from "@/modules/home/components/AmazingOffer";
import CategoriesSection from "@/modules/home/components/Categories";
import CtaSection from "@/modules/home/components/Cta";
import FeaturesSection from "@/modules/home/components/Features";
import HeroSection from "@/modules/home/components/Hero";

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
