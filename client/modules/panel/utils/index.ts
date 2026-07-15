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
