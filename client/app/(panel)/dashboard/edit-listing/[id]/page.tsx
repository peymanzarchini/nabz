/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { Loader2, X, ImagePlus } from "lucide-react";
import dynamic from "next/dynamic";

import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { useCategories } from "@/modules/home/hooks/useGetCategories";
import { useLocations } from "@/modules/panel/hooks/useLocations";
import { useListingDetails } from "@/modules/home/hooks/useListings";
import { SpecsSchema, ListingVariant, GetCategory } from "@/modules/home/types";
import { getApiErrorMessage } from "@/utils/getApiErrorMessage";

import BasicInfoForm from "@/modules/panel/components/BasicInfoForm";
import CategoryLocationForm from "@/modules/panel/components/CategoryLocationForm";
import SpecsForm from "@/modules/panel/components/SpecsForm";
import VariantsForm from "@/modules/panel/components/VariantsForm";
import { FormValues, GetLocation } from "@/modules/panel/types";

const LocationMap = dynamic(() => import("@/modules/panel/components/LocationMap"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-gray-50 dark:bg-zinc-800 animate-pulse rounded-xl" />
  ),
});

const findCategoryInTree = (
  cats: GetCategory[] | undefined,
  id: string,
): GetCategory | undefined => {
  if (!cats) return undefined;
  for (const c of cats) {
    if (c.id === id) return c;
    const found = findCategoryInTree(c.subcategories, id);
    if (found) return found;
  }
  return undefined;
};

const EditListingPage = () => {
  const params = useParams();
  const router = useRouter();
  const listingId = params.id as string;

  const { data: listing, isLoading: isLoadingListing } = useListingDetails(listingId);
  const { data: categories } = useCategories();
  const { data: locations } = useLocations();

  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);

  const [selectedCategoryId, setSelectedCategoryId] = useState("");

  const [specs, setSpecs] = useState<Record<string, string | number | boolean | null>>({});
  const [variants, setVariants] = useState<ListingVariant[]>([]);
  const [currentVariant, setCurrentVariant] = useState<ListingVariant>({
    id: "",
    specs: {},
    price: 0,
    stock: 1,
    discountPercentage: 0,
    discountExpiry: null,
    finalPrice: 0,
    sku: null,
  });

  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();

  const isNegotiable = useWatch({ control, name: "isNegotiable" });
  const selectedCityId = useWatch({ control, name: "cityId" });
  const selectedDistrictId = useWatch({ control, name: "districtId" });

  useEffect(() => {
    if (listing) {
      reset({
        title: listing.title,
        description: listing.description,
        condition: listing.condition as "new" | "used",
        isNegotiable: listing.isNegotiable,
        cityId: listing.city?.id || "",
        districtId: listing.district?.id || "",
      });

      setExistingImages(listing.images || []);

      if (listing.latitude && listing.longitude) {
        setPosition({ lat: Number(listing.latitude), lng: Number(listing.longitude) });
      }

      if (listing.specs) setSpecs(listing.specs);
      if (listing.variants && listing.variants.length > 0) {
        setVariants(listing.variants);
      }

      if (listing.category) {
        setSelectedCategoryId(listing.category.id);
      }
    }
  }, [listing, reset]);

  const finalCategory = useMemo(
    () => findCategoryInTree(categories, selectedCategoryId),
    [categories, selectedCategoryId],
  );

  const generalSpecsSchema = useMemo(() => {
    if (!finalCategory?.specsSchema) return {} as SpecsSchema;
    const schema = finalCategory.specsSchema as unknown as SpecsSchema;
    return Object.fromEntries(Object.entries(schema).filter(([_, val]) => !val.isVariant));
  }, [finalCategory]);

  const variantSpecsSchema = useMemo(() => {
    if (!finalCategory?.specsSchema) return {} as SpecsSchema;
    const schema = finalCategory.specsSchema as unknown as SpecsSchema;
    return Object.fromEntries(Object.entries(schema).filter(([_, val]) => val.isVariant));
  }, [finalCategory]);

  const selectedCity = useMemo(() => {
    if (!locations) return undefined;
    for (const prov of locations) {
      if (prov.districts) {
        const city = prov.districts.find((c) => c.id === selectedDistrictId);
        if (city) return city;
      }
    }
    return undefined;
  }, [locations, selectedDistrictId]);

  const cityCenter = useMemo(() => {
    if (selectedCity?.latitude && selectedCity?.longitude) {
      return { lat: Number(selectedCity.latitude), lng: Number(selectedCity.longitude) };
    }
    return null;
  }, [selectedCity]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setImages((prev) => [...prev, ...files]);
      setImagePreviews((prev) => [...prev, ...files.map((file) => URL.createObjectURL(file))]);
    }
  };

  const removeNewImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = async (imageUrl: string) => {
    try {
      await api.delete(`/marketplace/listings/${listingId}/images`, { data: { imageUrl } });
      setExistingImages((prev) => prev.filter((img) => img !== imageUrl));
      toast.success("تصویر حذف شد.");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  const handleSpecChange = (key: string, value: string | number | boolean | null) =>
    setSpecs((prev) => ({ ...prev, [key]: value }));
  const handleVariantSpecChange = (key: string, value: string) =>
    setCurrentVariant((prev) => ({ ...prev, specs: { ...prev.specs, [key]: value } }));

  const addVariant = () => {
    if (currentVariant.price <= 0) return toast.error("قیمت باید بزرگتر از صفر باشد.");
    setVariants((prev) => [
      ...prev,
      { ...currentVariant, id: Math.random().toString(36).substring(7) },
    ]);
    setCurrentVariant({
      id: "",
      specs: {},
      price: 0,
      stock: 1,
      discountPercentage: 0,
      discountExpiry: null,
      finalPrice: 0,
      sku: null,
    });
  };

  const removeVariant = (id: string) => setVariants((prev) => prev.filter((v) => v.id !== id));

  const onSubmit = async (data: FormValues) => {
    if (existingImages.length === 0 && images.length === 0)
      return toast.error("حداقل یک تصویر الزامی است.");
    if (variants.length === 0) return toast.error("حداقل یک واریانت الزامی است.");

    const formData = new FormData();
    images.forEach((image) => formData.append("images", image));

    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("condition", data.condition);
    formData.append("isNegotiable", String(data.isNegotiable));
    formData.append("cityId", data.cityId);
    if (data.districtId) formData.append("districtId", data.districtId);
    if (position) {
      formData.append("latitude", String(position.lat));
      formData.append("longitude", String(position.lng));
    }
    if (selectedCategoryId) formData.append("categoryId", selectedCategoryId);

    formData.append("specs", JSON.stringify(specs));
    formData.append("variants", JSON.stringify(variants));

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

  if (isLoadingListing) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-zinc-900 rounded-2xl p-6 sm:p-8 shadow-sm border border-zinc-100 dark:border-zinc-800">
      <h1 className="text-2xl font-black text-zinc-800 dark:text-white mb-6">ویرایش آگهی</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <BasicInfoForm
          register={register}
          errors={errors}
          isNegotiable={isNegotiable ?? false}
          setValue={setValue}
        />

        <CategoryLocationForm
          categories={categories}
          locations={locations}
          cat1={selectedCategoryId}
          cat2=""
          cat3=""
          selectedCat1={finalCategory}
          selectedCat2={undefined}
          selectedCityId={selectedCityId || ""}
          selectedDistrictId={selectedDistrictId || ""}
          handleCatChange={(level, id) => {
            if (level === 1) setSelectedCategoryId(id);
            setSpecs({});
            setVariants([]);
          }}
          setValue={setValue}
        />

        <section className="space-y-4">
          <h2 className="text-lg font-bold text-zinc-700 dark:text-zinc-200 border-b border-zinc-100 dark:border-zinc-800 pb-2">
            موقعیت دقیق روی نقشه
          </h2>
          <div className="h-100 w-full rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-700 z-0 relative">
            <LocationMap position={position} setPosition={setPosition} cityCenter={cityCenter} />
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-bold text-zinc-700 dark:text-zinc-200 border-b border-zinc-100 dark:border-zinc-800 pb-2">
            تصاویر آگهی
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {existingImages.map((imgUrl, index) => (
              <div
                key={`existing-${index}`}
                className="relative aspect-square rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-700"
              >
                <Image
                  src={`http://localhost:5000${imgUrl}`}
                  alt="existing"
                  fill
                  className="object-cover"
                  sizes="100%"
                />
                <button
                  type="button"
                  onClick={() => removeExistingImage(imgUrl)}
                  className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full z-10"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}

            {imagePreviews.map((preview, index) => (
              <div
                key={`new-${index}`}
                className="relative aspect-square rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-700"
              >
                <Image src={preview} alt="preview" fill className="object-cover" sizes="100%" />
                <button
                  type="button"
                  onClick={() => removeNewImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full z-10"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}

            {/* دکمه آپلود عکس جدید */}
            <label className="aspect-square rounded-xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-violet-500 transition-colors text-zinc-500 dark:text-zinc-400">
              <ImagePlus className="h-8 w-8" />
              <span className="text-xs">افزودن عکس جدید</span>
              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
          </div>
        </section>

        {selectedCategoryId && Object.keys(generalSpecsSchema).length > 0 && (
          <SpecsForm
            generalSpecsSchema={generalSpecsSchema}
            specs={specs}
            handleSpecChange={handleSpecChange}
          />
        )}

        {selectedCategoryId && (
          <VariantsForm
            variantSpecsSchema={variantSpecsSchema}
            variants={variants}
            currentVariant={currentVariant}
            handleVariantSpecChange={handleVariantSpecChange}
            setCurrentVariant={setCurrentVariant}
            addVariant={addVariant}
            removeVariant={removeVariant}
          />
        )}

        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.back()}
            className="dark:text-zinc-300"
          >
            انصراف
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-linear-to-r from-violet-600 to-teal-500 text-white"
          >
            {isSubmitting ? <Loader2 className="animate-spin ml-2" /> : null}
            ذخیره تغییرات
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditListingPage;
