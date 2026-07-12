import { UseFormRegister, FieldErrors } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { FormValues } from "../types";

interface Props {
  register: UseFormRegister<FormValues>;
  errors: FieldErrors<FormValues>;
  isNegotiable: boolean;
  setValue: (name: "isNegotiable", value: boolean) => void;
}

export default function BasicInfoForm({ register, errors, isNegotiable, setValue }: Props) {
  const inputClass =
    "mt-1.5 h-11 bg-gray-50 border-gray-200 text-gray-900 focus:border-violet-500 focus:ring-violet-500 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white dark:placeholder:text-zinc-400 rounded-md";

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-bold text-zinc-700 dark:text-zinc-200 border-b border-zinc-100 dark:border-zinc-800 pb-2">
        اطلاعات اصلی
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label className="text-zinc-700 dark:text-zinc-200">عنوان آگهی *</Label>
          <Input {...register("title", { required: "عنوان الزامی است" })} className={inputClass} />
          {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>}
        </div>
        <div>
          <Label className="text-zinc-700 dark:text-zinc-200">وضعیت کالا *</Label>
          <div className="flex gap-4 mt-4">
            <label className="flex items-center gap-2 cursor-pointer text-zinc-600 dark:text-zinc-300">
              <input
                type="radio"
                value="new"
                {...register("condition")}
                className="accent-violet-600"
              />{" "}
              نو
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-zinc-600 dark:text-zinc-300">
              <input
                type="radio"
                value="used"
                {...register("condition")}
                className="accent-violet-600"
              />{" "}
              دست دوم
            </label>
          </div>
        </div>
      </div>
      <div>
        <Label className="text-zinc-700 dark:text-zinc-200">توضیحات *</Label>
        <Textarea
          {...register("description", { required: "توضیحات الزامی است" })}
          className={inputClass}
          rows={5}
        />
        {errors.description && (
          <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>
        )}
      </div>
      <div className="flex items-center gap-3 pt-2">
        <Switch
          id="isNegotiable"
          checked={isNegotiable}
          onCheckedChange={(checked) => setValue("isNegotiable", checked)}
        />
        <Label htmlFor="isNegotiable" className="text-zinc-700 dark:text-zinc-200 cursor-pointer">
          قیمت توافقی است
        </Label>
      </div>
    </section>
  );
}
