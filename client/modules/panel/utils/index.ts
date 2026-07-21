import { GetCategory } from "@/modules/home/types";
import { GetLocation } from "../types";

export const getStatusInfo = (status: string) => {
  switch (status) {
    case "active":
      return {
        label: "منتشر شده",
        color: "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400",
      };
    case "pending":
      return {
        label: "در انتظار تایید",
        color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400",
      };
    case "rejected":
      return {
        label: "رد شده",
        color: "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400",
      };
    case "sold":
      return {
        label: "فروخته شده",
        color: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
      };
    default:
      return { label: "نامشخص", color: "bg-zinc-100 text-zinc-600" };
  }
};

export const findCategoryPath = (
  cats: GetCategory[] | undefined,
  targetId: string,
  path: string[] = [],
): string[] | null => {
  if (!cats) return null;
  for (const c of cats) {
    const newPath = [...path, c.id];
    if (c.id === targetId) return newPath;
    const found = findCategoryPath(c.subcategories, targetId, newPath);
    if (found) return found;
  }
  return null;
};

export const findLocationPath = (
  locs: GetLocation[] | undefined,
  targetId: string,
): { provinceId: string; cityId: string } | null => {
  if (!locs) return null;
  for (const prov of locs) {
    if (prov.id === targetId) return { provinceId: prov.id, cityId: "" };
    if (prov.districts) {
      for (const city of prov.districts) {
        if (city.id === targetId) return { provinceId: prov.id, cityId: city.id };
      }
    }
  }
  return null;
};

export const formatLastSeen = (dateStr: string | null) => {
  if (!dateStr) return "آنلاین";
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);
  if (mins < 1) return "همین الان";
  if (mins < 60) return `${mins} دقیقه پیش`;
  if (hours < 24) return `${hours} ساعت پیش`;
  return `${days} روز پیش`;
};
