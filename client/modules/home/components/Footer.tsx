import Link from "next/link";
import Logo from "@/components/ui/Logo";

const Footer = () => {
  return (
    <footer className="bg-secondary/30 border-t border-border/30 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="space-y-4">
            <Logo width={100} height={100} />
            <p className="text-sm text-muted-foreground leading-relaxed">
              سوپراپلیکیشن نبض، پلتفرمی یکپارچه برای نیازهای روزمره شما. از بازارچه تا حمل‌ونقل و
              پرداخت آنلاین.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-foreground mb-4">دسترسی سریع</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/listings"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  بازارچه
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  ثبت‌نام
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  ورود
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  درباره ما
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-foreground mb-4">خدمات مشتریان</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  سوالات متداول
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  قوانین و مقررات
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  حریم خصوصی
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  پشتیبانی
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/30 mt-10 pt-6 text-center">
          <p className="text-xs text-muted-foreground">
            تمامی حقوق مادی و معنوی این سایت متعلق به نبض می‌باشد. © {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
