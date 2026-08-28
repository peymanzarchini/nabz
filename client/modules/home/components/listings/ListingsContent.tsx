"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ListingFilters } from "../../types";
import { useListings } from "../../hooks/useListings";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { PackageSearch, Search, SlidersHorizontal, X, Loader2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import Filters from "../Filters";
import ListingCard from "./ListingCard";
import Pagination from "../Pagination";

const sortOptions = [
  { value: "newest", label: "جدیدترین" },
  { value: "cheapest", label: "ارزان‌ترین" },
  { value: "expensive", label: "گران‌ترین" },
  { value: "top_rated", label: "محبوب‌ترین" },
];

const ListingsContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [showMobileFilters, setShowMobileFilters] = useState<boolean>(false);

  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");

  useEffect(() => {
    setSearchTerm(searchParams.get("search") || "");
  }, [searchParams]);

  const filters = useMemo<ListingFilters>(() => {
    return {
      search: searchParams.get("search") || "",
      categoryId: searchParams.get("categoryId") || null,
      minPrice: searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : null,
      maxPrice: searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : null,
      condition: (searchParams.get("condition") as "new" | "used" | null) || null,
      isAmazingOffer: searchParams.get("isAmazingOffer") === "true" ? true : null,
      sort: (searchParams.get("sort") as ListingFilters["sort"]) || "newest",
      page: searchParams.get("page") ? Number(searchParams.get("page")) : 1,
      limit: 12,
    };
  }, [searchParams]);

  const { data, isLoading, isFetching, isError } = useListings(filters);

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
      const currentSearch = searchParams.get("search") || "";
      if (searchTerm !== currentSearch) {
        const params = new URLSearchParams(searchParams.toString());
        if (searchTerm) {
          params.set("search", searchTerm);
        } else {
          params.delete("search");
        }
        params.set("page", "1");
        router.replace(`${pathname}?${params.toString()}`);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm, searchParams, router, pathname]);

  const handleResetFilters = () => {
    setSearchTerm("");
    router.replace(`${pathname}`);
  };

  return (
    <div className="min-h-screen pt-28 pb-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 animate-slide-up">
          <h1 className="text-3xl md:text-4xl font-black text-foreground mb-2">بازارچه نبض</h1>
          <p className="text-muted-foreground mb-6">بهترین‌ها را اینجا پیدا کنید!</p>

          <div className="flex flex-col md:flex-row gap-4">
            <InputGroup className="h-14 flex-1 bg-card border border-border rounded-lg">
              <InputGroupAddon>
                <Search className="h-5 w-5 text-muted-foreground mr-3" />
              </InputGroupAddon>
              <InputGroupInput
                type="text"
                placeholder="جستجو در آگهی‌ها..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent border-0 text-base text-foreground placeholder:text-muted-foreground/60"
              />
            </InputGroup>

            <div className="relative w-full md:w-80">
              <select
                value={filters.sort || "newest"}
                onChange={(e) =>
                  handleFilterChange({ sort: e.target.value as ListingFilters["sort"], page: 1 })
                }
                className="h-14 w-full appearance-none flex items-center justify-between px-4 bg-card border border-border rounded-lg text-sm font-medium text-foreground hover:bg-muted/50 transition-colors cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary/50"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            </div>

            <Button
              variant="outline"
              className="h-14 md:hidden bg-card border-border shadow-sm"
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
              className="md:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowMobileFilters(false)}
            >
              <div
                className="absolute right-0 top-0 bottom-0 w-[85%] max-w-sm bg-background p-5 overflow-y-auto shadow-2xl"
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

          <main className="flex-1 relative min-h-[50vh]">
            {isFetching && !isLoading && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-card border border-border shadow-md rounded-full p-2">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            )}

            {isLoading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-card rounded-2xl h-100 animate-pulse border border-border"
                  ></div>
                ))}
              </div>
            )}

            {!isLoading && isError && (
              <div className="text-center py-20 bg-card rounded-2xl border border-border shadow-sm">
                <PackageSearch className="h-16 w-16 text-destructive mx-auto mb-4" />
                <p className="text-foreground font-bold text-lg">خطا در دریافت آگهی‌ها</p>
                <p className="text-sm text-muted-foreground">لطفاً کمی بعد دوباره تلاش کنید.</p>
              </div>
            )}

            {!isLoading && !isError && data?.items.length === 0 && (
              <div className="text-center py-20 bg-card rounded-2xl border border-border shadow-sm flex flex-col items-center">
                <PackageSearch className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
                <p className="text-foreground font-bold text-lg">آگهی‌ای یافت نشد</p>
                <p className="text-sm text-muted-foreground mt-2 max-w-xs">
                  برای کلمه «{searchParams.get("search") || "جستجوی شما"}» آگهی‌ای پیدا نکردیم.
                  لطفاً کلمه دیگری را امتحان کنید یا فیلترها را تغییر دهید.
                </p>
              </div>
            )}

            {!isLoading && !isError && data && data.items.length > 0 && (
              <div className={`transition-opacity ${isFetching ? "opacity-50" : "opacity-100"}`}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {data.items.map((listing, index) => (
                    <ListingCard key={listing.id} listing={listing} index={index} />
                  ))}
                </div>

                <Pagination
                  pagination={data.pagination}
                  onPageChange={(page) => handleFilterChange({ page })}
                />
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default ListingsContent;
