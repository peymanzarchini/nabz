import { Label } from "@/components/ui/label";
import { GetCategory } from "@/modules/home/types";
import { GetLocation } from "../types";

interface Props {
  categories?: GetCategory[];
  locations?: GetLocation[];
  cat1: string;
  cat2: string;
  cat3: string;
  selectedCat1?: GetCategory;
  selectedCat2?: GetCategory;
  selectedCityId: string;
  selectedDistrictId: string;
  selectedCity?: GetLocation;
  handleCatChange: (level: 1 | 2 | 3, id: string) => void;
  setValue: (name: "cityId" | "districtId", value: string) => void;
}

export default function CategoryLocationForm(props: Props) {
  const inputClass =
    "mt-1.5 h-11 bg-gray-50 border-gray-200 text-gray-900 focus:border-violet-500 focus:ring-violet-500 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white dark:placeholder:text-zinc-400 rounded-md";
  const selectClass = inputClass + " w-full px-3 appearance-none cursor-pointer";

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-bold text-zinc-700 dark:text-zinc-200 border-b border-zinc-100 dark:border-zinc-800 pb-2">
        دسته‌بندی و موقعیت
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label className="text-zinc-700 dark:text-zinc-200">دسته اصلی *</Label>
          <select
            className={selectClass}
            value={props.cat1}
            onChange={(e) => props.handleCatChange(1, e.target.value)}
          >
            <option value="">انتخاب کنید...</option>
            {props.categories?.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {props.selectedCat1 &&
          props.selectedCat1.subcategories &&
          props.selectedCat1.subcategories.length > 0 && (
            <div>
              <Label className="text-zinc-700 dark:text-zinc-200">زیردسته *</Label>
              <select
                className={selectClass}
                value={props.cat2}
                onChange={(e) => props.handleCatChange(2, e.target.value)}
              >
                <option value="">انتخاب کنید...</option>
                {props.selectedCat1.subcategories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          )}

        {props.selectedCat2 &&
          props.selectedCat2.subcategories &&
          props.selectedCat2.subcategories.length > 0 && (
            <div>
              <Label className="text-zinc-700 dark:text-zinc-200">زیردسته ۲ *</Label>
              <select
                className={selectClass}
                value={props.cat3}
                onChange={(e) => props.handleCatChange(3, e.target.value)}
              >
                <option value="">انتخاب کنید...</option>
                {props.selectedCat2.subcategories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div>
          <Label className="text-zinc-700 dark:text-zinc-200">شهر *</Label>
          <select
            className={selectClass}
            value={props.selectedCityId}
            onChange={(e) => props.setValue("cityId", e.target.value)}
          >
            <option value="">انتخاب کنید...</option>
            {props.locations?.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label className="text-zinc-700 dark:text-zinc-200">محله (اختیاری)</Label>
          <select
            className={selectClass}
            value={props.selectedDistrictId}
            onChange={(e) => props.setValue("districtId", e.target.value)}
            disabled={!props.selectedCity}
          >
            <option value="">انتخاب کنید...</option>
            {props.selectedCity?.districts?.map((dist) => (
              <option key={dist.id} value={dist.id}>
                {dist.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </section>
  );
}
