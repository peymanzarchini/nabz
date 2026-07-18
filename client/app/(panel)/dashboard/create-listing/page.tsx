/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { Loader2, MapPin } from "lucide-react";
import dynamic from "next/dynamic";

import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { useCategories } from "@/modules/home/hooks/useGetCategories";
import { SpecsSchema, ListingVariant } from "@/modules/home/types";
import { getApiErrorMessage } from "@/utils/getApiErrorMessage";
import { useLocations } from "@/modules/panel/hooks/useLocations";
import BasicInfoForm from "@/modules/panel/components/BasicInfoForm";
import CategoryLocationForm from "@/modules/panel/components/CategoryLocationForm";
import ImagesForm from "@/modules/panel/components/ImagesForm";
import SpecsForm from "@/modules/panel/components/SpecsForm";
import VariantsForm from "@/modules/panel/components/VariantsForm";
import { FormValues } from "@/modules/panel/types";

const LocationMap = dynamic(() => import("@/modules/panel/components/LocationMap"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-gray-50 dark:bg-zinc-800 animate-pulse rounded-xl" />
  ),
});

const CreateListingPage = () => {
  const router = useRouter();
  const { data: categories } = useCategories();
  const { data: locations } = useLocations();

  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const [cat1, setCat1] = useState("");
  const [cat2, setCat2] = useState("");
  const [cat3, setCat3] = useState("");
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
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: { condition: "new", isNegotiable: false },
  });

  const isNegotiable = useWatch({ control, name: "isNegotiable" });
  const selectedCityId = useWatch({ control, name: "cityId" });
  const selectedDistrictId = useWatch({ control, name: "districtId" });

  const selectedCat1 = useMemo(() => categories?.find((c) => c.id === cat1), [categories, cat1]);
  const selectedCat2 = useMemo(
    () => selectedCat1?.subcategories?.find((c) => c.id === cat2),
    [selectedCat1, cat2],
  );

  const finalCategory = useMemo(() => {
    if (cat3) return selectedCat2?.subcategories?.find((c) => c.id === cat3);
    if (cat2) return selectedCat2;
    if (cat1) return selectedCat1;
    return null;
  }, [cat1, cat2, cat3, selectedCat1, selectedCat2]);

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

  const handleCatChange = (level: 1 | 2 | 3, id: string) => {
    if (level === 1) {
      setCat1(id);
      setCat2("");
      setCat3("");
    }
    if (level === 2) {
      setCat2(id);
      setCat3("");
    }
    if (level === 3) {
      setCat3(id);
    }
    setSelectedCategoryId(id);
    setSpecs({});
    setVariants([]);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setImages((prev) => [...prev, ...files]);
      setImagePreviews((prev) => [...prev, ...files.map((file) => URL.createObjectURL(file))]);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
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
    if (!selectedCategoryId) return toast.error("لطفاً تا آخرین سطح دسته‌بندی را انتخاب کنید.");
    if (images.length === 0) return toast.error("حداقل یک تصویر الزامی است.");
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
    formData.append("categoryId", selectedCategoryId);
    formData.append("thumbnailIndex", "0");
    formData.append("specs", JSON.stringify(specs));
    formData.append("variants", JSON.stringify(variants));

    try {
      await api.post("/marketplace/listings", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("آگهی ثبت شد و در انتظار تایید است.");
      router.push("/dashboard/listings");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  const cityCenter = useMemo(() => {
    if (selectedCity?.latitude && selectedCity?.longitude) {
      return {
        lat: Number(selectedCity.latitude),
        lng: Number(selectedCity.longitude),
      };
    }
    return null;
  }, [selectedCity]);

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-zinc-900 rounded-lg p-6 sm:p-8 shadow-sm border border-zinc-100 dark:border-zinc-800 h-[80vh] overflow-y-scroll">
      <h1 className="text-2xl font-black text-zinc-800 dark:text-white mb-6">ثبت آگهی جدید</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <BasicInfoForm
          register={register}
          errors={errors}
          isNegotiable={isNegotiable}
          setValue={setValue}
        />

        <CategoryLocationForm
          categories={categories}
          locations={locations}
          cat1={cat1}
          cat2={cat2}
          cat3={cat3}
          selectedCat1={selectedCat1}
          selectedCat2={selectedCat2}
          selectedCityId={selectedCityId}
          selectedDistrictId={selectedDistrictId}
          handleCatChange={handleCatChange}
          setValue={setValue}
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
              position={position}
              setPosition={setPosition}
              cityCenter={cityCenter}
              cityName={selectedCity?.name}
            />
          </div>
          {position && (
            <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
              <MapPin className="h-4 w-4" />
              مختصات انتخاب شد: {position.lat.toFixed(4)}, {position.lng.toFixed(4)}
            </div>
          )}
        </section>

        <ImagesForm
          imagePreviews={imagePreviews}
          handleImageChange={handleImageChange}
          removeImage={removeImage}
        />

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
            disabled={isSubmitting}
          >
            انصراف
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-linear-to-r from-violet-600 to-teal-500 text-white"
          >
            {isSubmitting && <Loader2 className="animate-spin ml-2" />}
            ثبت آگهی
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateListingPage;
