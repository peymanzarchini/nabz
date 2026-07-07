"use client";

import { Filter, Zap, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Combobox,
  ComboboxTrigger,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
} from "@/components/ui/combobox";
import { ListingFilters } from "../types";
import { useCategories } from "@/modules/home/hooks/useGetCategories";
import { GetCategory } from "@/modules/home/types";

interface FiltersProps {
  filters: ListingFilters;
  onChange: (newFilters: Partial<ListingFilters>) => void;
  onReset: () => void;
}

const Filters = ({ filters, onChange, onReset }: FiltersProps) => {
  const { data: categories } = useCategories();
  const inputClass =
    "bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 focus:border-primary transition-colors text-sm rounded-md h-11 text-zinc-900 dark:text-white";

  const categoryOptions = [
    { label: "همه دسته‌ها", value: "" },
    ...(categories?.map((cat: GetCategory) => ({ label: cat.name, value: String(cat.id) })) || []),
  ];

  const currentCategoryLabel =
    categoryOptions.find(
      (opt) => opt.value === (filters.categoryId ? String(filters.categoryId) : ""),
    )?.label || "انتخاب دسته...";

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 space-y-6 sticky top-28">
      <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4">
        <h3 className="flex items-center gap-2 font-bold text-zinc-800 dark:text-zinc-100">
          <Filter className="h-5 w-5 text-primary" />
          فیلترها
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="text-zinc-500 hover:text-destructive text-xs gap-1"
        >
          <RotateCcw className="h-3 w-3" />
          حذف
        </Button>
      </div>

      <div className="flex flex-col gap-y-2">
        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-200">دسته‌بندی</label>
        <Combobox
          value={filters.categoryId ? String(filters.categoryId) : ""}
          onValueChange={(val) => onChange({ categoryId: val || null, page: 1 })}
        >
          <ComboboxTrigger className="h-11 w-full flex items-center justify-between px-4 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md text-sm font-normal text-zinc-900 dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-700">
            <span>{currentCategoryLabel}</span>
          </ComboboxTrigger>
          <ComboboxContent className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
            <ComboboxList>
              <ComboboxEmpty>یافت نشد</ComboboxEmpty>
              {categoryOptions.map((opt) => (
                <ComboboxItem key={opt.value} value={opt.value}>
                  {opt.label}
                </ComboboxItem>
              ))}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </div>

      <div className="flex flex-col gap-y-2">
        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
          محدوده قیمت (تومان)
        </label>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            min="0"
            placeholder="حداقل"
            value={filters.minPrice || ""}
            onChange={(e) =>
              onChange({
                minPrice: e.target.value ? Math.max(0, Number(e.target.value)) : null,
                page: 1,
              })
            }
            className={inputClass}
          />
          <span className="text-zinc-400 text-xs">تا</span>
          <Input
            type="number"
            min="0"
            placeholder="حداکثر"
            value={filters.maxPrice || ""}
            onChange={(e) =>
              onChange({
                maxPrice: e.target.value ? Math.max(0, Number(e.target.value)) : null,
                page: 1,
              })
            }
            className={inputClass}
          />
        </div>
      </div>

      <div className="flex flex-col gap-y-2">
        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-200">وضعیت کالا</label>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant={filters.condition === "new" ? "default" : "outline"}
            size="sm"
            className="h-10"
            onClick={() =>
              onChange({ condition: filters.condition === "new" ? null : "new", page: 1 })
            }
          >
            نو
          </Button>
          <Button
            variant={filters.condition === "used" ? "default" : "outline"}
            size="sm"
            className="h-10"
            onClick={() =>
              onChange({ condition: filters.condition === "used" ? null : "used", page: 1 })
            }
          >
            دست دوم
          </Button>
        </div>
      </div>

      <div
        className={`flex items-center justify-between p-4 rounded-md border cursor-pointer transition-all ${filters.isAmazingOffer ? "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800" : "bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700"}`}
        onClick={() => onChange({ isAmazingOffer: !filters.isAmazingOffer, page: 1 })}
      >
        <div className="flex flex-col gap-1">
          <span className="text-sm font-bold text-zinc-800 dark:text-zinc-100 flex items-center gap-2">
            <Zap
              className={`h-4 w-4 ${filters.isAmazingOffer ? "text-red-500" : "text-zinc-500"}`}
            />
            پیشنهاد شگفت‌انگیز
          </span>
          <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
            فقط کالاهای تخفیف‌دار
          </span>
        </div>
        <Switch
          checked={!!filters.isAmazingOffer}
          onCheckedChange={(checked) =>
            onChange({ isAmazingOffer: checked ? true : null, page: 1 })
          }
        />
      </div>
    </div>
  );
};

export default Filters;
