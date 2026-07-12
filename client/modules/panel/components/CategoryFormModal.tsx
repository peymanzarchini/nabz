"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Loader2, X } from "lucide-react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GetCategory } from "@/modules/home/types";
import { getApiErrorMessage } from "@/utils/getApiErrorMessage";

interface Props {
  category: GetCategory | null;
  parentCategories: GetCategory[];
  onClose: () => void;
  onSuccess: () => void;
}

interface FormValues {
  name: string;
  slug: string;
  parentId: string | null;
  icon: string | null;
  specsSchema: string;
}

const CategoryFormModal = ({ category, parentCategories, onClose, onSuccess }: Props) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, reset, getValues, setValue } = useForm<FormValues>({
    defaultValues: {
      name: "",
      slug: "",
      parentId: null,
      icon: null,
      specsSchema: "",
    },
  });

  useEffect(() => {
    if (category) {
      reset({
        name: category.name,
        slug: category.slug,
        parentId: category.parentId,
        icon: category.icon,
        specsSchema: category.specsSchema ? JSON.stringify(category.specsSchema, null, 2) : "",
      });
    } else {
      reset({ name: "", slug: "", parentId: null, icon: null, specsSchema: "" });
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

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      let parsedSpecs = null;
      if (data.specsSchema) {
        try {
          parsedSpecs = JSON.parse(data.specsSchema);
        } catch (error) {
          toast.error(getApiErrorMessage(error));
          setIsSubmitting(false);
          return;
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
    "mt-1.5 h-11 bg-gray-50 border-gray-200 text-gray-900 focus:border-violet-500 focus:ring-violet-500 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white rounded-md";

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-zinc-100 dark:border-zinc-800 sticky top-0 bg-white dark:bg-zinc-900 z-10">
          <h2 className="text-xl font-bold text-zinc-800 dark:text-white">
            {category ? "ویرایش دسته‌بندی" : "افزودن دسته‌بندی جدید"}
          </h2>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-zinc-700 dark:text-zinc-200">نام دسته‌بندی *</Label>
              <Input
                {...register("name", {
                  required: "نام الزامی است",
                  onBlur: (e) => !getValues("slug") && generateSlug(e.target.value),
                })}
                className={inputClass}
              />
            </div>
            <div>
              <Label className="text-zinc-700 dark:text-zinc-200">اسلاگ (انگلیسی) *</Label>
              <Input
                {...register("slug", { required: "اسلاگ الزامی است" })}
                className={inputClass}
                dir="ltr"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <Label className="text-zinc-700 dark:text-zinc-200">آیکون (اختیاری)</Label>
              <Input {...register("icon")} className={inputClass} placeholder="مثال: car" />
            </div>
          </div>

          <div>
            <Label className="text-zinc-700 dark:text-zinc-200">
              اسکیمای مشخصات (Specs Schema)
            </Label>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-2">
              یک JSON معتبر وارد کنید. برای ارث‌بری از دسته دیگر:{" "}
              <code dir="ltr" className="bg-zinc-100 dark:bg-zinc-800 p-1 rounded">
                {'{"inheritFrom": "ID-دسته"}'}
              </code>
            </p>
            <textarea
              {...register("specsSchema")}
              className={inputClass + " w-full font-mono text-sm p-3"}
              rows={8}
              dir="ltr"
              placeholder='{"color":{"type":"dropdown","label":"رنگ","options":["قرمز","آبی"],"required":true,"isVariant":true}}'
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="ghost" onClick={onClose}>
              انصراف
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-linear-to-r from-violet-600 to-teal-500 text-white"
            >
              {isSubmitting && <Loader2 className="animate-spin ml-2" />}
              ذخیره
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryFormModal;
