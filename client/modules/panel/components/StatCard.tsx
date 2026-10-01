import { cn } from "@/lib/utils";
import { type LucideIcon } from "lucide-react";

const StatCard = ({
  icon: Icon,
  label,
  value,
  iconClass,
  variant = "default",
}: {
  icon: LucideIcon;
  label: string;
  value: number;
  iconClass: string;
  variant?: "default" | "admin";
}) => (
  <div className="bg-card border border-border rounded-sm p-5 shadow-sm hover:shadow-md hover:-translate-y-1 hover:border-primary/20 transition-all group cursor-pointer h-full flex items-center justify-between">
    {variant === "default" ? (
      <>
        <div className="flex flex-col">
          <span className="text-3xl font-black text-foreground mb-2">
            {value.toLocaleString("fa-IR")}
          </span>
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
        </div>
        <div
          className={cn(
            "w-12 h-12 rounded-sm flex items-center justify-center shadow-sm transition-transform group-hover:scale-105",
            iconClass,
          )}
        >
          <Icon className="h-6 w-6" />
        </div>
      </>
    ) : (
      <>
        <div>
          <p className="text-sm text-muted-foreground mb-1">{label}</p>
          <p className="text-2xl font-black text-foreground">
            {value.toLocaleString("fa-IR")} مورد
          </p>
        </div>
        <div
          className={cn(
            "w-14 h-14 rounded-full flex items-center justify-center shadow-sm transition-transform group-hover:scale-105",
            iconClass,
          )}
        >
          <Icon className="h-7 w-7" />
        </div>
      </>
    )}
  </div>
);

export default StatCard;
