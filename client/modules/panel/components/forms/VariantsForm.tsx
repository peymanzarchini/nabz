import { PlusCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SpecsSchema, SpecFieldSchema, ListingVariant } from "@/modules/home/types";
import { formatPriceInput, numberToPersianWords, parsePriceInput } from "@/utils/formatNumber";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import DateObject from "react-date-object";

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
    "mt-1.5 h-11 bg-muted/40 border-input text-foreground focus:border-primary focus:ring-primary/50 rounded-sm placeholder:text-muted-foreground/60";
  const selectClass = inputClass + " w-full px-3 appearance-none cursor-pointer";

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-bold text-foreground border-b border-border pb-2">
        واریانت‌ها و قیمت‌ها
      </h2>

      {variants.length > 0 && (
        <div className="space-y-2 mb-4">
          {variants.map((v) => (
            <div
              key={v.id}
              className="flex items-center justify-between bg-muted/40 p-3 rounded-sm border border-border"
            >
              <span className="text-sm font-medium text-foreground">
                {Object.values(v.specs).join(" / ") || "نوع اصلی"} -
                <span className="text-primary font-bold mr-1">
                  {v.price.toLocaleString("fa-IR")} تومان
                </span>
                {v.discountPercentage > 0 && (
                  <span className="text-xs text-destructive mr-2">
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
                className="text-destructive hover:text-destructive/80"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="border border-border rounded-sm p-4 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {Object.entries(variantSpecsSchema).map(([key, schema]: [string, SpecFieldSchema]) => (
            <div key={key}>
              <Label className="text-xs text-muted-foreground">{schema.label}</Label>
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
            <Label className="text-xs text-muted-foreground">قیمت پایه (تومان) *</Label>
            <Input
              type="text"
              inputMode="numeric"
              dir="ltr"
              className={inputClass + " text-sm h-10 text-left"}
              value={formatPriceInput(currentVariant.price)}
              onChange={(e) =>
                setCurrentVariant((prev) => ({ ...prev, price: parsePriceInput(e.target.value) }))
              }
            />
            {currentVariant.price > 0 && (
              <p className="text-xs text-primary mt-1 font-medium">
                {numberToPersianWords(currentVariant.price)} تومان
              </p>
            )}
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">موجودی *</Label>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-border mt-3">
          <div>
            <Label className="text-xs text-muted-foreground">درصد تخفیف (۰ تا ۱۰۰)</Label>
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
            <Label className="text-xs text-muted-foreground">تاریخ پایان تخفیف</Label>

            <DatePicker
              calendar={persian}
              locale={persian_fa}
              calendarPosition="bottom-right"
              format="YYYY/MM/DD"
              value={currentVariant.discountExpiry ? new Date(currentVariant.discountExpiry) : ""}
              onChange={(dateObject: DateObject | null) => {
                if (dateObject) {
                  const isoString = dateObject.toDate().toISOString();
                  setCurrentVariant((prev) => ({ ...prev, discountExpiry: isoString }));
                } else {
                  setCurrentVariant((prev) => ({ ...prev, discountExpiry: null }));
                }
              }}
              inputClass="mt-1.5 h-10 w-full bg-muted/40 border border-input text-foreground focus:border-primary focus:ring-primary/50 rounded-sm text-sm px-3 cursor-pointer outline-none"
              containerClassName="w-full"
            />
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addVariant}
          className="w-full rounded-sm cursor-pointer"
        >
          <PlusCircle className="h-4 w-4 ml-2" /> افزودن واریانت
        </Button>
      </div>
    </section>
  );
};

export default VariantsForm;
