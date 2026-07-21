/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { Loader2, X, PlusCircle, Trash2 } from "lucide-react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GetCategory, SpecsSchema } from "@/modules/home/types";
import { getApiErrorMessage } from "@/utils/getApiErrorMessage";
import IconPicker from "@/components/ui/IconPicker";

interface Props {
  category: GetCategory | null;
  parentCategories: { id: string; name: string }[];
  onClose: () => void;
  onSuccess: () => void;
}

interface FormValues {
  name: string;
  slug: string;
  parentId: string | null;
  icon: string | null;
}

interface UiSpecField {
  key: string;
  label: string;
  type: "string" | "number" | "dropdown" | "boolean";
  options: string[];
  required: boolean;
  isVariant: boolean;
}

export default function CategoryFormModal({
  category,
  parentCategories,
  onClose,
  onSuccess,
}: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [specFields, setSpecFields] = useState<UiSpecField[]>([]);

  const { register, handleSubmit, reset, getValues, setValue, control } = useForm<FormValues>({
    defaultValues: { name: "", slug: "", parentId: null, icon: null },
  });

  const iconValue = useWatch({ control, name: "icon" });

  useEffect(() => {
    if (category) {
      reset({
        name: category.name,
        slug: category.slug,
        parentId: category.parentId,
        icon: category.icon,
      });

      if (
        category.specsSchema &&
        typeof category.specsSchema === "object" &&
        !("inheritFrom" in category.specsSchema)
      ) {
        const schema = category.specsSchema as SpecsSchema;
        const fields: UiSpecField[] = Object.entries(schema).map(([key, val]) => ({
          key,
          label: val.label,
          type: val.type,
          options: val.options || [],
          required: val.required || false,
          isVariant: val.isVariant || false,
        }));
        setSpecFields(fields);
      } else {
        setSpecFields([]);
      }
    } else {
      reset({ name: "", slug: "", parentId: null, icon: null });
      setSpecFields([]);
    }
  }, [category, reset]);

  const generateSlug = (name: string) => {
    const slug = name
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "");
    setValue("slug", slug);
  };

  // توابع مدیریت فیلدهای داینامیک
  const addSpecField = () => {
    setSpecFields([
      ...specFields,
      { key: "", label: "", type: "string", options: [], required: false, isVariant: false },
    ]);
  };

  const removeSpecField = (index: number) => {
    setSpecFields(specFields.filter((_, i) => i !== index));
  };

  const updateSpecField = (
    index: number,
    field: keyof UiSpecField,
    value: string | boolean | string[],
  ) => {
    const updatedFields = [...specFields];
    updatedFields[index] = { ...updatedFields[index], [field]: value };
    setSpecFields(updatedFields);
  };

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      let parsedSpecs: SpecsSchema | null = null;
      if (specFields.length > 0) {
        parsedSpecs = {};
        for (const field of specFields) {
          if (!field.key || !field.label) {
            toast.error("کلید انگلیسی و عنوان فارسی تمام فیلدها الزامی است.");
            setIsSubmitting(false);
            return;
          }
          parsedSpecs[field.key] = {
            label: field.label,
            type: field.type,
            options: field.type === "dropdown" ? field.options : undefined,
            required: field.required,
            isVariant: field.isVariant,
          };
        }
      }

      const payload = {
        name: data.name,
        slug: data.slug,
        parentId: data.parentId || null,
        icon: data.icon || null,
        specsSchema: parsedSpecs,
        hasSpecs: !!parsedSpecs,
      };

      if (category) {
        await api.patch(`/marketplace/categories/${category.id}`, payload);
        toast.success("دسته‌بندی ویرایش شد.");
      } else {
        await api.post("/marketplace/categories", payload);
        toast.success("دسته‌بندی جدید ایجاد شد.");
      }

      onSuccess();
      onClose();
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "mt-1.5 h-11 bg-gray-50 border-gray-200 text-gray-900 focus:border-violet-500 focus:ring-violet-500 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white rounded-sm";

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-zinc-900 rounded-sm shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-zinc-100 dark:border-zinc-800 sticky top-0 bg-white dark:bg-zinc-900 z-10">
          <h2 className="text-xl font-bold text-zinc-800 dark:text-white">
            {category ? "ویرایش دسته‌بندی" : "افزودن دسته‌بندی جدید"}
          </h2>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>نام دسته‌بندی *</Label>
              <Input
                {...register("name", {
                  required: "نام الزامی است",
                  onBlur: (e) => !getValues("slug") && generateSlug(e.target.value),
                })}
                className={inputClass}
              />
            </div>
            <div>
              <Label>اسلاگ (انگلیسی) *</Label>
              <Input
                {...register("slug", { required: "اسلاگ الزامی است" })}
                className={inputClass}
                dir="ltr"
              />
            </div>
            <div>
              <Label className="text-zinc-700 dark:text-zinc-200">دسته والد (اختیاری)</Label>
              <select
                {...register("parentId")}
                className={inputClass + " w-full px-3 cursor-pointer"}
              >
                <option value="">دسته اصلی</option>
                {parentCategories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label>آیکون (اختیاری)</Label>
              <IconPicker value={iconValue} onChange={(val) => setValue("icon", val)} />
            </div>
          </div>

          <div className="border border-zinc-200 dark:border-zinc-800 rounded-sm p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-md font-bold text-zinc-700 dark:text-zinc-200">
                فیلدهای مشخصات کالا
              </h3>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={addSpecField}
                className="rounded-sm! py-5 text-xs cursor-pointer"
              >
                <PlusCircle className="h-4 w-4 ml-2" /> افزودن فیلد
              </Button>
            </div>

            {specFields.length === 0 && (
              <p className="text-center text-sm text-zinc-500 py-4">هیچ فیلدی تعریف نشده است.</p>
            )}

            {specFields.map((field, index) => (
              <div
                key={index}
                className="bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-lg space-y-3 relative"
              >
                <button
                  type="button"
                  onClick={() => removeSpecField(index)}
                  className="absolute top-3 left-3 text-red-500 hover:bg-red-100 dark:hover:bg-red-500/10 p-1 rounded"
                >
                  <Trash2 className="h-4 w-4" />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">عنوان فارسی (مثال: رنگ) *</Label>
                    <Input
                      value={field.label}
                      onChange={(e) => updateSpecField(index, "label", e.target.value)}
                      className={inputClass + " h-10"}
                    />
                  </div>
                  <div>
                    <Label className="text-xs">کلید انگلیسی (مثال: color) *</Label>
                    <Input
                      value={field.key}
                      onChange={(e) =>
                        updateSpecField(
                          index,
                          "key",
                          e.target.value.replace(/\s+/g, "_").toLowerCase(),
                        )
                      }
                      className={inputClass + " h-10"}
                      dir="ltr"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">نوع فیلد</Label>
                    <select
                      value={field.type}
                      onChange={(e) => updateSpecField(index, "type", e.target.value)}
                      className={inputClass + " h-10 w-full px-3 cursor-pointer"}
                    >
                      <option value="string">متن کوتاه (String)</option>
                      <option value="number">عدد (Number)</option>
                      <option value="dropdown">لیست کشویی (Dropdown)</option>
                      <option value="boolean">دکمه بله/خیر (Boolean)</option>
                    </select>
                  </div>
                  {field.type === "dropdown" && (
                    <div>
                      <Label className="text-xs">گزینه‌ها (با کاما جدا کنید)</Label>
                      <Input
                        value={field.options.join(", ")}
                        onChange={(e) =>
                          updateSpecField(
                            index,
                            "options",
                            e.target.value.split(",").map((opt) => opt.trim()),
                          )
                        }
                        className={inputClass + " h-10"}
                        placeholder="قرمز, آبی, مشکی"
                      />
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-6 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer text-sm text-zinc-600 dark:text-zinc-300">
                    <input
                      type="checkbox"
                      checked={field.required}
                      onChange={(e) => updateSpecField(index, "required", e.target.checked)}
                      className="accent-violet-600 w-4 h-4"
                    />
                    اجباری باشد
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-sm text-zinc-600 dark:text-zinc-300">
                    <input
                      type="checkbox"
                      checked={field.isVariant}
                      onChange={(e) => updateSpecField(index, "isVariant", e.target.checked)}
                      className="accent-violet-600 w-4 h-4"
                    />
                    به عنوان واریانت (مثل رنگ/حافظه)
                  </label>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
            <Button type="button" variant="ghost" onClick={onClose} className="cursor-pointer py-4">
              انصراف
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-linear-to-r from-violet-600 to-teal-500 text-white cursor-pointer rounded-sm py-4"
            >
              {isSubmitting && <Loader2 className="animate-spin ml-2" />}
              ذخیره دسته‌بندی
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
