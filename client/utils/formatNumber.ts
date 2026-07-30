export const toEnglishDigits = (str: string): string => {
  const persianDigits = "۰۱۲۳۴۵۶۷۸۹";
  const arabicDigits = "٠١٢٣٤٥٦٧٨٩";
  let result = str;
  for (let i = 0; i < 10; i++) {
    result = result.replace(new RegExp(persianDigits[i], "g"), String(i));
    result = result.replace(new RegExp(arabicDigits[i], "g"), String(i));
  }
  return result;
};

export const formatPriceInput = (value: number | string): string => {
  const cleanValue = toEnglishDigits(String(value)).replace(/[^0-9]/g, "");
  if (!cleanValue) return "";
  return Number(cleanValue).toLocaleString("en-US");
};

export const parsePriceInput = (value: string): number => {
  const cleanValue = toEnglishDigits(value).replace(/[^0-9]/g, "");
  return cleanValue ? Number(cleanValue) : 0;
};

export const numberToPersianWords = (num: number): string => {
  if (num === 0) return "صفر";

  const yekan = ["", "یک", "دو", "سه", "چهار", "پنج", "شش", "هفت", "هشت", "نه"];
  const dahgan = ["", "", "بیست", "سی", "چهل", "پنجاه", "شصت", "هفتاد", "هشتاد", "نود"];
  const dahyek = [
    "ده",
    "یازده",
    "دوازده",
    "سیزده",
    "چهارده",
    "پانزده",
    "شانزده",
    "هفده",
    "هجده",
    "نوزده",
  ];
  const sadgan = ["", "صد", "دویست", "سیصد", "چهارصد", "پانصد", "ششصد", "هفتصد", "هشتصد", "نهصد"];

  const getThreeDigit = (n: number): string => {
    let result = "";
    const sad = Math.floor(n / 100);
    const dahganVal = Math.floor((n % 100) / 10);
    const yek = n % 10;

    if (sad > 0) result += sadgan[sad] + (n % 100 > 0 ? " و " : "");
    if (dahganVal > 0) {
      if (dahganVal === 1) {
        result += dahyek[yek];
        return result;
      } else {
        result += dahgan[dahganVal] + (yek > 0 ? " و " : "");
      }
    }
    if (yek > 0) result += yekan[yek];
    return result;
  };

  let result = "";
  let isNegative = false;
  if (num < 0) {
    isNegative = true;
    num = Math.abs(num);
  }

  const hezargan = Math.floor(num / 1000000000);
  const million = Math.floor((num % 1000000000) / 1000000);
  const hezar = Math.floor((num % 1000000) / 1000);
  const baghi = num % 1000;

  if (hezargan > 0)
    result += getThreeDigit(hezargan) + " میلیارد" + (num % 1000000000 > 0 ? " و " : "");
  if (million > 0) result += getThreeDigit(million) + " میلیون" + (num % 1000000 > 0 ? " و " : "");
  if (hezar > 0) result += getThreeDigit(hezar) + " هزار" + (num % 1000 > 0 ? " و " : "");
  if (baghi > 0) result += getThreeDigit(baghi);

  return (isNegative ? "منفی " : "") + result;
};
