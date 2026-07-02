export const getEmoji = (icon: string | null) => {
  if (icon === "vehicle") return "🚗";
  if (icon === "building") return "🏢";
  if (icon === "digital") return "💻";
  return "📦"; // پیش‌فرض
};
