"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, MapPin } from "lucide-react";
import dynamic from "next/dynamic";

import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { getApiErrorMessage } from "@/utils/getApiErrorMessage";
import BasicInfoForm from "@/modules/panel/components/forms/BasicInfoForm";
import CategoryLocationForm from "@/modules/panel/components/forms/CategoryLocationForm";
import ImagesForm from "@/modules/panel/components/forms/ImagesForm";
import SpecsForm from "@/modules/panel/components/forms/SpecsForm";
import VariantsForm from "@/modules/panel/components/forms/VariantsForm";
import { FormValues } from "@/modules/panel/types";
import { useListingForm } from "@/modules/panel/hooks/useListingForm";

const LocationMap = dynamic(() => import("@/modules/panel/components/LocationMap"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-gray-50 dark:bg-zinc-800 animate-pulse rounded-xl" />
  ),
});

const CreateListingPage = () => {
  const router = useRouter();
  const form = useListingForm();

  const onSubmit = async (data: FormValues) => {
    if (!form.selectedCategoryId)
      return toast.error("لطفاً تا آخرین سطح دسته‌بندی را انتخاب کنید.");
    if (form.images.length === 0) return toast.error("حداقل یک تصویر الزامی است.");
    if (form.variants.length === 0) return toast.error("حداقل یک واریانت الزامی است.");

    const formData = new FormData();
    form.images.forEach((image) => formData.append("images", image));

    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("condition", data.condition);
    formData.append("isNegotiable", String(data.isNegotiable));
    formData.append("cityId", data.cityId);
    if (data.districtId) formData.append("districtId", data.districtId);
    if (form.position) {
      formData.append("latitude", String(form.position.lat));
      formData.append("longitude", String(form.position.lng));
    }
    formData.append("categoryId", form.selectedCategoryId);
    formData.append("thumbnailIndex", "0");
    formData.append("specs", JSON.stringify(form.specs));
    formData.append("variants", JSON.stringify(form.variants));

    try {
      await api.post("/marketplace/listings", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("آگهی ثبت شد و در انتظار تایید است.");
      router.push("/dashboard/listings");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-zinc-900 rounded-lg p-6 sm:p-8 shadow-sm border border-zinc-100 dark:border-zinc-800 h-[80vh] overflow-y-scroll">
      <h1 className="text-2xl font-black text-zinc-800 dark:text-white mb-6">ثبت آگهی جدید</h1>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <BasicInfoForm
          register={form.register}
          errors={form.errors}
          isNegotiable={form.isNegotiable}
          setValue={form.setValue}
        />

        <CategoryLocationForm
          categories={form.categories}
          locations={form.locations}
          cat1={form.cat1}
          cat2={form.cat2}
          cat3={form.cat3}
          selectedCat1={form.selectedCat1}
          selectedCat2={form.selectedCat2}
          selectedCityId={form.selectedCityId}
          selectedDistrictId={form.selectedDistrictId}
          handleCatChange={form.handleCatChange}
          setValue={form.setValue}
        />

        <section className="space-y-4">
          <h2 className="text-lg font-bold text-zinc-700 dark:text-zinc-200 border-b border-zinc-100 dark:border-zinc-800 pb-2">
            موقعیت دقیق روی نقشه
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            برای تعیین موقعیت دقیق، روی نقشه کلیک کنید.
          </p>
          <div className="h-100 w-full rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-700 z-0 relative">
            <LocationMap
              position={form.position}
              setPosition={form.setPosition}
              cityCenter={form.cityCenter}
              cityName={form.selectedCity?.name}
            />
          </div>
          {form.position && (
            <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
              <MapPin className="h-4 w-4" />
              مختصات انتخاب شد: {form.position.lat.toFixed(4)}, {form.position.lng.toFixed(4)}
            </div>
          )}
        </section>

        <ImagesForm
          imagePreviews={form.imagePreviews}
          handleImageChange={form.handleImageChange}
          removeImage={form.removeNewImage}
        />

        {form.selectedCategoryId && Object.keys(form.generalSpecsSchema).length > 0 && (
          <SpecsForm
            generalSpecsSchema={form.generalSpecsSchema}
            specs={form.specs}
            handleSpecChange={form.handleSpecChange}
          />
        )}

        {form.selectedCategoryId && (
          <VariantsForm
            variantSpecsSchema={form.variantSpecsSchema}
            variants={form.variants}
            currentVariant={form.currentVariant}
            handleVariantSpecChange={form.handleVariantSpecChange}
            setCurrentVariant={form.setCurrentVariant}
            addVariant={form.addVariant}
            removeVariant={form.removeVariant}
          />
        )}

        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.back()}
            className="dark:text-zinc-300"
            disabled={form.isSubmitting}
          >
            انصراف
          </Button>
          <Button
            type="submit"
            disabled={form.isSubmitting}
            className="bg-linear-to-r from-violet-600 to-teal-500 text-white"
          >
            {form.isSubmitting && <Loader2 className="animate-spin ml-2" />}
            ثبت آگهی
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateListingPage;
