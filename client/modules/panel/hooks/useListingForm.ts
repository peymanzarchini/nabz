/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import api from "@/lib/api";
import { useCategories } from "@/modules/home/hooks/useGetCategories";
import { useLocations } from "@/modules/panel/hooks/useLocations";
import { useListingDetails } from "@/modules/home/hooks/useListings";
import { SpecsSchema, ListingVariant } from "@/modules/home/types";
import { FormValues } from "@/modules/panel/types";
import { getApiErrorMessage } from "@/utils/getApiErrorMessage";
import { findCategoryPath, findLocationPath } from "../utils";

export const useListingForm = (listingId?: string) => {
  const isEdit = !!listingId;
  const { data: listing, isLoading: isLoadingListing } = useListingDetails(listingId || "");
  const { data: categories } = useCategories();
  const { data: locations } = useLocations();

  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);

  const [cat1, setCat1] = useState<string>("");
  const [cat2, setCat2] = useState<string>("");
  const [cat3, setCat3] = useState<string>("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");

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
  const [address, setAddress] = useState<string>("");
  const [isMapOpen, setIsMapOpen] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: { condition: "new", isNegotiable: false },
  });

  const isNegotiable = useWatch({ control, name: "isNegotiable" });
  const selectedCityId = useWatch({ control, name: "cityId" });
  const selectedDistrictId = useWatch({ control, name: "districtId" });

  useEffect(() => {
    if (isEdit && listing && categories && locations) {
      reset({
        title: listing.title,
        description: listing.description,
        condition: listing.condition as "new" | "used",
        isNegotiable: listing.isNegotiable,
        cityId: "",
        districtId: "",
      });

      setExistingImages(listing.images || []);
      if (listing.specs) setSpecs(listing.specs);
      if (listing.variants && listing.variants.length > 0) setVariants(listing.variants);

      if (listing.latitude && listing.longitude) {
        setPosition({ lat: Number(listing.latitude), lng: Number(listing.longitude) });
      }

      if (listing.category) {
        const catPath = findCategoryPath(categories, listing.category.id);
        if (catPath) {
          if (catPath[0]) setCat1(catPath[0]);
          if (catPath[1]) setCat2(catPath[1]);
          if (catPath[2]) setCat3(catPath[2]);
          setSelectedCategoryId(listing.category.id);
        }
      }

      if (listing.city) {
        const locPath = findLocationPath(locations, listing.city.id);
        if (locPath) {
          setValue("cityId", locPath.provinceId);
          if (listing.district) {
            const distPath = findLocationPath(locations, listing.district.id);
            if (distPath) setValue("districtId", distPath.cityId);
          }
        }
      }
    }
  }, [isEdit, listing, categories, locations, reset, setValue]);

  const selectedCat1 = useMemo(() => categories?.find((c) => c.id === cat1), [categories, cat1]);
  const selectedCat2 = useMemo(
    () => selectedCat1?.subcategories.find((c) => c.id === cat2),
    [selectedCat1, cat2],
  );

  const finalCategory = useMemo(() => {
    if (cat3) return selectedCat2?.subcategories.find((c) => c.id === cat3);
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

  const cityCenter = useMemo(() => {
    if (selectedCity?.latitude && selectedCity?.longitude) {
      return { lat: Number(selectedCity.latitude), lng: Number(selectedCity.longitude) };
    }
    return null;
  }, [selectedCity]);

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

  const removeNewImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = async (imageUrl: string) => {
    if (!listingId) return;
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

  const handleMapConfirm = (pos: { lat: number; lng: number }, addr: string) => {
    setPosition(pos);
    setAddress(addr);
  };

  return {
    isEdit,
    isLoadingListing,
    categories,
    locations,
    images,
    imagePreviews,
    existingImages,
    cat1,
    cat2,
    cat3,
    selectedCategoryId,
    selectedCat1,
    selectedCat2,
    generalSpecsSchema,
    variantSpecsSchema,
    selectedCity,
    cityCenter,
    specs,
    variants,
    currentVariant,
    setCurrentVariant,
    position,
    address,
    isMapOpen,
    register,
    handleSubmit,
    control,
    setValue,
    errors,
    isSubmitting,
    isNegotiable,
    selectedCityId,
    selectedDistrictId,
    handleCatChange,
    handleImageChange,
    removeNewImage,
    removeExistingImage,
    handleSpecChange,
    handleVariantSpecChange,
    addVariant,
    removeVariant,
    setPosition,
    setIsMapOpen,
    handleMapConfirm,
  };
};
