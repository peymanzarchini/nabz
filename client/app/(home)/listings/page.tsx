/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useMemo, useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Search, PackageSearch, SlidersHorizontal, X } from "lucide-react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";
import {
  Combobox,
  ComboboxTrigger,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
} from "@/components/ui/combobox";
import { ListingFilters } from "@/modules/home/types";
import { useListings } from "@/modules/home/hooks/useListings";
import Filters from "@/modules/home/components/Filters";
import ListingCard from "@/modules/home/components/ListingCard";
import Pagination from "@/modules/home/components/Pagination";

const sortOptions = [
  { value: "newest", label: "جدیدترین" },
  { value: "cheapest", label: "ارزان‌ترین" },
  { value: "expensive", label: "گران‌ترین" },
  { value: "top_rated", label: "محبوب‌ترین" },
];

const ListingsPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");

  const filters = useMemo<ListingFilters>(() => {
    return {
      search: searchParams.get("search") || "",
      categoryId: searchParams.get("categoryId") ? Number(searchParams.get("categoryId")) : null,
      minPrice: searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : null,
      maxPrice: searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : null,
      condition: (searchParams.get("condition") as "new" | "used" | null) || null,
      isAmazingOffer: searchParams.get("isAmazingOffer") === "true" ? true : null,
      sort: (searchParams.get("sort") as ListingFilters["sort"]) || "newest",
      page: searchParams.get("page") ? Number(searchParams.get("page")) : 1,
      limit: 12,
    };
  }, [searchParams]);

  const { data, isLoading, isError } = useListings(filters);

  const handleFilterChange = (newFilters: Partial<ListingFilters>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value === null || value === undefined || value === "") {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });
    router.replace(`${pathname}?${params.toString()}`);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== (searchParams.get("search") || "")) {
        handleFilterChange({ search: searchTerm, page: 1 });
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleResetFilters = () => {
    setSearchTerm("");
    router.replace(`${pathname}`);
  };

  const currentSortLabel = sortOptions.find(
    (opt) => opt.value === (filters.sort || "newest"),
  )?.label;

  return (
    <div className="min-h-screen pt-28 pb-16 bg-zinc-50 dark:bg-zinc-950">
      <div className="max-w-350 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 animate-slide-up">
          <h1 className="text-3xl md:text-4xl font-black text-zinc-900 dark:text-white mb-2">
            بازارچه نبض
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mb-6">بهترین‌ها را اینجا پیدا کنید!</p>

          <div className="flex flex-col md:flex-row gap-4">
            <InputGroup className="h-14 flex-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md">
              <InputGroupAddon>
                <Search className="h-5 w-5 text-zinc-400 mr-3" />
              </InputGroupAddon>
              <InputGroupInput
                type="text"
                placeholder="جستجو در آگهی‌ها..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent border-0 text-base text-zinc-900 dark:text-white"
              />
            </InputGroup>

            <div className="w-full md:w-80">
              <Combobox
                value={filters.sort || "newest"}
                onValueChange={(val) =>
                  handleFilterChange({ sort: val as ListingFilters["sort"], page: 1 })
                }
              >
                <ComboboxTrigger className="h-14 w-full flex items-center justify-between px-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md text-sm font-medium text-zinc-800 dark:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-800">
                  <span>{currentSortLabel}</span>
                </ComboboxTrigger>
                <ComboboxContent className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-sm">
                  <ComboboxList className="rounded-sm">
                    {sortOptions.map((opt) => (
                      <ComboboxItem key={opt.value} value={opt.value} className="rounded-sm py-1.5">
                        {opt.label}
                      </ComboboxItem>
                    ))}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
            </div>

            <Button
              variant="outline"
              className="h-14 md:hidden bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-sm"
              onClick={() => setShowMobileFilters(true)}
            >
              <SlidersHorizontal className="h-5 w-5" />
              فیلترها
            </Button>
          </div>
        </div>

        <div className="flex gap-8">
          <aside className="hidden md:block w-80 shrink-0">
            <Filters filters={filters} onChange={handleFilterChange} onReset={handleResetFilters} />
          </aside>

          {showMobileFilters && (
            <div
              className="md:hidden fixed inset-0 z-50 bg-black/60"
              onClick={() => setShowMobileFilters(false)}
            >
              <div
                className="absolute right-0 top-0 bottom-0 w-[85%] max-w-sm bg-zinc-50 dark:bg-zinc-950 p-5 overflow-y-auto shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-end mb-4">
                  <Button variant="ghost" size="icon" onClick={() => setShowMobileFilters(false)}>
                    <X className="h-6 w-6" />
                  </Button>
                </div>
                <Filters
                  filters={filters}
                  onChange={handleFilterChange}
                  onReset={handleResetFilters}
                />
              </div>
            </div>
          )}

          <main className="flex-1">
            {isLoading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white dark:bg-zinc-900 rounded-2xl h-100 animate-pulse border border-zinc-100 dark:border-zinc-800"
                  ></div>
                ))}
              </div>
            )}

            {!isLoading && isError && (
              <div className="text-center py-20 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
                <PackageSearch className="h-16 w-16 text-red-500 mx-auto mb-4" />
                <p className="text-zinc-800 dark:text-white font-bold text-lg">
                  خطا در دریافت آگهی‌ها
                </p>
                <p className="text-sm text-zinc-500">لطفاً کمی بعد دوباره تلاش کنید.</p>
              </div>
            )}

            {!isLoading && !isError && data?.items.length === 0 && (
              <div className="text-center py-20 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
                <PackageSearch className="h-16 w-16 text-zinc-300 mx-auto mb-4" />
                <p className="text-zinc-800 dark:text-white font-bold text-lg">آگهی‌ای یافت نشد</p>
                <p className="text-sm text-zinc-500">فیلترها را تغییر دهید یا بعداً مراجعه کنید.</p>
              </div>
            )}

            {!isLoading && !isError && data && data.items.length > 0 && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {data.items.map((listing, index) => (
                    <ListingCard key={listing.id} listing={listing} index={index} />
                  ))}
                </div>

                <Pagination
                  pagination={data.pagination}
                  onPageChange={(page) => handleFilterChange({ page })}
                />
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default ListingsPage;
