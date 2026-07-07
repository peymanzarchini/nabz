import { v4 as uuidv4 } from "uuid";

export function generateSlug(title: string): string {
  // 1. تبدیل به حروف کوچک
  let slug = title.toLowerCase();

  // 2. جایگزین کردن فاصله‌ها با خط تیره
  slug = slug.replace(/\s+/g, "-");

  // 3. حذف کاراکترهای خاص (فقط حروف فارسی، انگلیسی، اعداد و خط تیره باقی بمانند)
  slug = slug.replace(/[^\u06F0-\u06F9a-z0-9-\u0600-\u06FF]/g, "");

  // 4. جایگزین کردن چند خط تیره پشت سر هم با یک خط تیره
  slug = slug.replace(/-+/g, "-");

  // 5. حذف خط تیره از ابتدا و انتهای رشته
  slug = slug.trim().replace(/^(-+)|(-+)$/g, "");

  // 6. محدود کردن طول اسلاگ به 60 کاراکتر
  slug = slug.substring(0, 60);

  // 7. ترکیب اسلاگ با 8 کاراکتر اول UUID برای جلوگیری از تکراری بودن (مثل دیجی‌کالا)
  const uniqueSuffix = uuidv4().substring(0, 8);

  return `${slug}-${uniqueSuffix}`;
}
