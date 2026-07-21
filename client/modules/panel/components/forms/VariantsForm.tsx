import { PlusCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SpecsSchema, SpecFieldSchema, ListingVariant } from "@/modules/home/types";

interface Props {
  variantSpecsSchema: SpecsSchema;
  variants: ListingVariant[];
  currentVariant: ListingVariant;
  handleVariantSpecChange: (key: string, value: string) => void;
  setCurrentVariant: React.Dispatch<React.SetStateAction<ListingVariant>>;
  addVariant: () => void;
  removeVariant: (id: string) => void;
}

const VariantsForm = ({
  variantSpecsSchema,
  variants,
  currentVariant,
  handleVariantSpecChange,
  setCurrentVariant,
  addVariant,
  removeVariant,
}: Props) => {
  const inputClass =
    "mt-1.5 h-11 bg-gray-50 border-gray-200 text-gray-900 focus:border-violet-500 focus:ring-violet-500 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white dark:placeholder:text-zinc-400 rounded-md";
  const selectClass = inputClass + " w-full px-3 appearance-none cursor-pointer";

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-bold text-zinc-700 dark:text-zinc-200 border-b border-zinc-100 dark:border-zinc-800 pb-2">
        واریانت‌ها و قیمت‌ها
      </h2>

      {variants.length > 0 && (
        <div className="space-y-2 mb-4">
          {variants.map((v) => (
            <div
              key={v.id}
              className="flex items-center justify-between bg-gray-50 dark:bg-zinc-800 p-3 rounded-lg border border-gray-100 dark:border-zinc-700"
            >
              <span className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
                {Object.values(v.specs).join(" / ") || "نوع اصلی"} -
                <span className="text-violet-600 dark:text-violet-400 font-bold mr-1">
                  {v.price.toLocaleString("fa-IR")} تومان
                </span>
                {v.discountPercentage > 0 && (
                  <span className="text-xs text-red-500 mr-2">
                    (با {v.discountPercentage}% تخفیف تا{" "}
                    {v.discountExpiry
                      ? new Date(v.discountExpiry).toLocaleDateString("fa-IR")
                      : "نامشخص"}
                    )
                  </span>
                )}
              </span>
              <button
                type="button"
                onClick={() => removeVariant(v.id)}
                className="text-red-500 hover:text-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="border border-gray-200 dark:border-zinc-700 rounded-xl p-4 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {Object.entries(variantSpecsSchema).map(([key, schema]: [string, SpecFieldSchema]) => (
            <div key={key}>
              <Label className="text-xs text-zinc-600 dark:text-zinc-300">{schema.label}</Label>
              <select
                className={selectClass + " text-sm h-10"}
                value={(currentVariant.specs[key] as string) || ""}
                onChange={(e) => handleVariantSpecChange(key, e.target.value)}
              >
                <option value="">انتخاب...</option>
                {schema.options?.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          ))}

          <div>
            <Label className="text-xs text-zinc-600 dark:text-zinc-300">قیمت پایه (تومان) *</Label>
            <Input
              type="number"
              className={inputClass + " text-sm h-10"}
              value={currentVariant.price || ""}
              onChange={(e) =>
                setCurrentVariant((prev) => ({ ...prev, price: Number(e.target.value) }))
              }
            />
          </div>
          <div>
            <Label className="text-xs text-zinc-600 dark:text-zinc-300">موجودی *</Label>
            <Input
              type="number"
              className={inputClass + " text-sm h-10"}
              value={currentVariant.stock || ""}
              onChange={(e) =>
                setCurrentVariant((prev) => ({ ...prev, stock: Number(e.target.value) }))
              }
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-zinc-100 dark:border-zinc-700 mt-3">
          <div>
            <Label className="text-xs text-zinc-600 dark:text-zinc-300">
              درصد تخفیف (۰ تا ۱۰۰)
            </Label>
            <Input
              type="number"
              min={0}
              max={100}
              className={inputClass + " text-sm h-10"}
              value={currentVariant.discountPercentage || ""}
              onChange={(e) =>
                setCurrentVariant((prev) => ({
                  ...prev,
                  discountPercentage: Number(e.target.value),
                }))
              }
              placeholder="مثلا: 20"
            />
          </div>
          <div>
            <Label className="text-xs text-zinc-600 dark:text-zinc-300">تاریخ پایان تخفیف</Label>
            <Input
              type="date"
              className={inputClass + " text-sm h-10"}
              value={
                currentVariant.discountExpiry
                  ? new Date(currentVariant.discountExpiry).toISOString().split("T")[0]
                  : ""
              }
              onChange={(e) =>
                setCurrentVariant((prev) => ({
                  ...prev,
                  discountExpiry: e.target.value ? new Date(e.target.value).toISOString() : null,
                }))
              }
            />
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addVariant}
          className="w-full dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
        >
          <PlusCircle className="h-4 w-4 ml-2" /> افزودن واریانت
        </Button>
      </div>
    </section>
  );
};

export default VariantsForm;
