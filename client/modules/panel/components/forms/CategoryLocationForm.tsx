import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { GetCategory } from "@/modules/home/types";
import {
  Combobox,
  ComboboxTrigger,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
} from "@/components/ui/combobox";
import { GetLocation } from "../../types";

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
  handleCatChange: (level: 1 | 2 | 3, id: string) => void;
  setValue: (name: "cityId" | "districtId", value: string) => void;
}

const CategoryLocationForm = (props: Props) => {
  const [provSearch, setProvSearch] = useState("");
  const [citySearch, setCitySearch] = useState("");

  const inputClass =
    "mt-1.5 h-11 bg-gray-50 border-gray-200 text-gray-900 focus:border-violet-500 focus:ring-violet-500 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white dark:placeholder:text-zinc-400 rounded-md";
  const selectClass = inputClass + " w-full px-3 appearance-none cursor-pointer";

  const provinces = [...(props.locations?.filter((l) => !l.parentId) || [])].sort((a, b) =>
    a.name.localeCompare(b.name, "fa"),
  );
  const filteredProvinces = provinces.filter((p) => p.name.includes(provSearch));

  const selectedProvince = provinces.find((p) => p.id === props.selectedCityId);

  const cities = [...(selectedProvince?.districts || [])].sort((a, b) =>
    a.name.localeCompare(b.name, "fa"),
  );
  const filteredCities = cities.filter((c) => c.name.includes(citySearch));

  const selectedCityName = cities.find((c) => c.id === props.selectedDistrictId)?.name;

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
              <Label className="text-zinc-700 dark:text-zinc-200">زیردسته ۱ *</Label>
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
          <Label className="text-zinc-700 dark:text-zinc-200 mb-1.5 block">استان *</Label>
          <Combobox
            value={props.selectedCityId || ""}
            onValueChange={(val) => {
              props.setValue("cityId", val!);
              props.setValue("districtId", "");
              setCitySearch("");
            }}
          >
            <ComboboxTrigger
              className={selectClass + " flex items-center justify-between text-right"}
            >
              <span className={props.selectedCityId ? "" : "text-zinc-400 dark:text-zinc-500"}>
                {selectedProvince?.name || "انتخاب استان..."}
              </span>
            </ComboboxTrigger>
            <ComboboxContent className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <div className="p-2 border-b border-zinc-100 dark:border-zinc-800">
                <Input
                  placeholder="جستجوی استان..."
                  value={provSearch}
                  onChange={(e) => setProvSearch(e.target.value)}
                  className="h-9 text-sm bg-transparent"
                />
              </div>
              <ComboboxList>
                {filteredProvinces.length > 0 ? (
                  filteredProvinces.map((prov) => (
                    <ComboboxItem key={prov.id} value={prov.id}>
                      {prov.name}
                    </ComboboxItem>
                  ))
                ) : (
                  <div className="p-4 text-center text-sm text-zinc-500">استانی یافت نشد</div>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </div>

        <div>
          <Label className="text-zinc-700 dark:text-zinc-200 mb-1.5 block">شهر *</Label>
          <Combobox
            value={props.selectedDistrictId || ""}
            onValueChange={(val) => props.setValue("districtId", val!)}
          >
            <ComboboxTrigger
              disabled={!props.selectedCityId}
              className={
                selectClass +
                " flex items-center justify-between text-right disabled:opacity-50 disabled:cursor-not-allowed"
              }
            >
              <span className={props.selectedDistrictId ? "" : "text-zinc-400 dark:text-zinc-500"}>
                {selectedCityName || "انتخاب شهر..."}
              </span>
            </ComboboxTrigger>
            <ComboboxContent className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <div className="p-2 border-b border-zinc-100 dark:border-zinc-800">
                <Input
                  placeholder="جستجوی شهر..."
                  value={citySearch}
                  onChange={(e) => setCitySearch(e.target.value)}
                  className="h-9 text-sm bg-transparent"
                />
              </div>
              <ComboboxList>
                {filteredCities.length > 0 ? (
                  filteredCities.map((city) => (
                    <ComboboxItem key={city.id} value={city.id}>
                      {city.name}
                    </ComboboxItem>
                  ))
                ) : (
                  <div className="p-4 text-center text-sm text-zinc-500">شهری یافت نشد</div>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </div>
      </div>
    </section>
  );
};

export default CategoryLocationForm;
