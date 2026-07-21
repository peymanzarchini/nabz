"use client";

import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import { Loader2, X, ImagePlus } from "lucide-react";
import dynamic from "next/dynamic";

import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { getApiErrorMessage } from "@/utils/getApiErrorMessage";

import BasicInfoForm from "@/modules/panel/components/forms/BasicInfoForm";
import CategoryLocationForm from "@/modules/panel/components/forms/CategoryLocationForm";
import SpecsForm from "@/modules/panel/components/forms/SpecsForm";
import VariantsForm from "@/modules/panel/components/forms/VariantsForm";
import { useListingForm } from "@/modules/panel/hooks/useListingForm";
import { FormValues } from "@/modules/panel/types";

const MapPickerModal = dynamic(() => import("@/modules/panel/components/modals/MapPickerModal"), {
  ssr: false,
});

const EditListingPage = () => {
  const params = useParams();
  const router = useRouter();
  const listingId = params.id as string;

  const form = useListingForm(listingId);

  const onSubmit = async (data: FormValues) => {
    if (form.existingImages.length === 0 && form.images.length === 0)
      return toast.error("حداقل یک تصویر الزامی است.");
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
    if (form.selectedCategoryId) formData.append("categoryId", form.selectedCategoryId);

    formData.append("specs", JSON.stringify(form.specs));
    formData.append("variants", JSON.stringify(form.variants));

    try {
      await api.patch(`/marketplace/listings/${listingId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("آگهی با موفقیت ویرایش شد.");
      router.push("/dashboard/listings");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  if (form.isLoadingListing) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-zinc-900 rounded-2xl p-6 sm:p-8 shadow-sm border border-zinc-100 dark:border-zinc-800">
      <h1 className="text-2xl font-black text-zinc-800 dark:text-white mb-6">ویرایش آگهی</h1>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <BasicInfoForm
          register={form.register}
          errors={form.errors}
          isNegotiable={form.isNegotiable ?? false}
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
          selectedCityId={form.selectedCityId || ""}
          selectedDistrictId={form.selectedDistrictId || ""}
          handleCatChange={form.handleCatChange}
          setValue={form.setValue}
        />

        <section className="space-y-4">
          <h2 className="text-lg font-bold text-zinc-700 dark:text-zinc-200 border-b border-zinc-100 dark:border-zinc-800 pb-2">
            موقعیت دقیق روی نقشه
          </h2>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
              آدرس دقیق
            </label>
            <div
              onClick={() => form.setIsMapOpen(true)}
              className="mt-1.5 h-11 w-full bg-gray-50 border border-gray-200 dark:bg-zinc-800 dark:border-zinc-700 rounded-md flex items-center px-3 cursor-pointer hover:border-violet-500 transition-colors"
            >
              <span
                className={`text-sm truncate ${form.address || form.position ? "text-zinc-900 dark:text-white" : "text-zinc-400"}`}
              >
                {form.address
                  ? form.address
                  : form.position
                    ? `مختصات: ${form.position.lat}, ${form.position.lng}`
                    : "برای انتخاب موقعیت کلیک کنید"}
              </span>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-bold text-zinc-700 dark:text-zinc-200 border-b border-zinc-100 dark:border-zinc-800 pb-2">
            تصاویر آگهی
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {form.existingImages.map((imgUrl, index) => (
              <div
                key={`existing-${index}`}
                className="relative aspect-square rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-700"
              >
                <Image
                  src={imgUrl}
                  alt="existing"
                  fill
                  className="object-cover"
                  sizes="100%"
                  unoptimized
                />
                <button
                  type="button"
                  onClick={() => form.removeExistingImage(imgUrl)}
                  className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full z-10"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
            {form.imagePreviews.map((preview, index) => (
              <div
                key={`new-${index}`}
                className="relative aspect-square rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-700"
              >
                <Image
                  src={preview}
                  alt="preview"
                  fill
                  className="object-cover"
                  sizes="100%"
                  unoptimized
                />
                <button
                  type="button"
                  onClick={() => form.removeNewImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full z-10"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
            <label className="aspect-square rounded-xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-violet-500 transition-colors text-zinc-500 dark:text-zinc-400">
              <ImagePlus className="h-8 w-8" />
              <span className="text-xs">افزودن عکس جدید</span>
              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={form.handleImageChange}
              />
            </label>
          </div>
        </section>

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
            className="dark:text-zinc-300 cursor-pointer rounded-sm"
          >
            انصراف
          </Button>
          <Button
            type="submit"
            disabled={form.isSubmitting}
            className="bg-linear-to-r from-violet-600 to-teal-500 text-white cursor-pointer rounded-sm"
          >
            {form.isSubmitting ? <Loader2 className="animate-spin ml-2" /> : null}
            ذخیره تغییرات
          </Button>
        </div>
      </form>

      <MapPickerModal
        isOpen={form.isMapOpen}
        onClose={() => form.setIsMapOpen(false)}
        onConfirm={form.handleMapConfirm}
        cityCenter={form.cityCenter}
        cityName={form.selectedCity?.name}
        initialPosition={form.position}
      />
    </div>
  );
};

export default EditListingPage;
