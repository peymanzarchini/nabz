import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const CtaSection = () => {
  return (
    <section className="py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-card border border-border rounded-2xl p-8 md:p-12 shadow-sm flex flex-col items-center text-center gap-5">
          <h2 className="text-2xl md:text-3xl font-black text-foreground">
            همین امروز به نبض بپیوندید!
          </h2>

          <p className="text-muted-foreground text-base md:text-lg max-w-xl leading-relaxed">
            از بازارچه‌ای با هزاران آگهی، حمل‌ونقل سریع و خدمات بی‌نظیر بهره‌مند شوید. ثبت‌نام
            رایگان است!
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mt-2">
            <Button asChild size="lg" className="h-12 px-8 text-base cursor-pointer rounded-lg">
              <Link href="/register">
                ثبت‌نام رایگان
                <ArrowLeft className="mr-2 h-5 w-5" />
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-12 px-8 text-base cursor-pointer rounded-lg"
            >
              <Link href="/listings">مشاهده آگهی‌ها</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
