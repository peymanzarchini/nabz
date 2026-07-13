import Image from "next/image";
import lightLogo from "@/public/images/light-logo.png";
import darkLogo from "@/public/images/dark-logo.png";
import Link from "next/link";

interface LogoProps {
  width?: number;
  height?: number;
}

const Logo = ({ width = 70, height = 70 }: LogoProps) => {
  return (
    <Link
      href={"/"}
      // کلاس block اضافه شد تا تگ a در فلکس‌باکس‌ها ارتفاع صفر نگیرد
      className="relative block shrink-0"
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      <Image
        src={lightLogo}
        alt="Nabz Logo"
        fill
        sizes={`${width}px`}
        className="object-contain block dark:hidden"
        priority
      />

      <Image
        src={darkLogo}
        alt="Nabz Logo"
        fill
        sizes={`${width}px`}
        className="object-contain hidden dark:block"
        priority
      />
    </Link>
  );
};

export default Logo;
