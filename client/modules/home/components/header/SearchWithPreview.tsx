"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search, Loader2, PackageSearch } from "lucide-react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Input } from "@/components/ui/input";
import { useSearchSuggestions } from "@/modules/home/hooks/useSearchSuggestions";

interface SearchWithPreviewProps {
  isMobile?: boolean;
  onClose?: () => void;
}

const SearchWithPreview = ({ isMobile = false, onClose }: SearchWithPreviewProps) => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: suggestions, isLoading } = useSearchSuggestions(searchTerm);

  useEffect(() => {
    if (isMobile) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowPreview(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobile]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/listings?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm("");
      setShowPreview(false);
      if (onClose) onClose();
    }
  };

  const handleSuggestionClick = (slug: string, catSlug: string) => {
    router.push(`/listings/${catSlug || "unknown"}/${slug}`);
    setSearchTerm("");
    setShowPreview(false);
    if (onClose) onClose();
  };

  // ظاهر موبایل
  if (isMobile) {
    return (
      <form onSubmit={handleSubmit} className="flex items-center gap-3 relative w-full">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="جستجو در نبض..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowPreview(true);
            }}
            className="pr-10 bg-secondary/50 border-border/30 focus:border-primary transition-colors h-12 rounded-lg text-base"
          />
          {isLoading && searchTerm.length >= 2 && (
            <Loader2 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 animate-spin text-primary" />
          )}
        </div>

        {showPreview && searchTerm.length >= 2 && (
          <div className="absolute top-14 right-0 left-0 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-xl max-h-96 overflow-y-auto z-50">
            {isLoading ? (
              <div className="p-4 text-center text-sm text-zinc-500">در حال جستجو...</div>
            ) : suggestions && suggestions.length > 0 ? (
              suggestions.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleSuggestionClick(item.slug, item.category?.slug || "")}
                  className="p-3 border-b border-zinc-100 dark:border-zinc-700 last:border-0 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-700 flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-md bg-zinc-100 dark:bg-zinc-600 overflow-hidden shrink-0 relative">
                    {item.thumbnail && (
                      <Image
                        src={
                          item.thumbnail.startsWith("http")
                            ? item.thumbnail
                            : `http://localhost:5000${item.thumbnail}`
                        }
                        alt={item.title}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    )}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-sm font-bold text-zinc-800 dark:text-white truncate">
                      {item.title}
                    </p>
                    <p className="text-xs text-primary">
                      {Number(item.minPrice).toLocaleString("fa-IR")} تومان
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-sm text-zinc-500 flex flex-col items-center gap-2">
                <PackageSearch className="h-8 w-8 text-zinc-400" />
                نتیجه‌ای یافت نشد
              </div>
            )}
          </div>
        )}
      </form>
    );
  }

  // ظاهر دسکتاپ
  return (
    <div ref={containerRef} className="flex-1 h-full relative">
      <form onSubmit={handleSubmit} className="w-full h-full">
        <InputGroup className="h-full rounded-sm">
          <InputGroupAddon>
            <Search className="h-5 w-5 text-muted-foreground mr-5" />
          </InputGroupAddon>
          <InputGroupInput
            type="text"
            placeholder="جستجو در نبض..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowPreview(true);
            }}
            onFocus={() => setShowPreview(true)}
            className="bg-secondary/50 border-border/30 focus:border-primary transition-colors text-base rounded-xl"
          />
          {isLoading && searchTerm.length >= 2 && (
            <div className="ml-3 flex items-center">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
            </div>
          )}
        </InputGroup>
      </form>

      {showPreview && searchTerm.length >= 2 && (
        <div className="absolute top-14 right-0 left-0 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-xl max-h-96 overflow-y-auto z-50">
          {isLoading ? (
            <div className="p-4 text-center text-sm text-zinc-500">در حال جستجو...</div>
          ) : suggestions && suggestions.length > 0 ? (
            suggestions.map((item) => (
              <div
                key={item.id}
                onClick={() => handleSuggestionClick(item.slug, item.category?.slug || "")}
                className="p-3 border-b border-zinc-100 dark:border-zinc-700 last:border-0 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-700 flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-md bg-zinc-100 dark:bg-zinc-600 overflow-hidden shrink-0 relative">
                  {item.thumbnail && (
                    <Image
                      src={
                        item.thumbnail.startsWith("http")
                          ? item.thumbnail
                          : `http://localhost:5000${item.thumbnail}`
                      }
                      alt={item.title}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  )}
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-sm font-bold text-zinc-800 dark:text-white truncate">
                    {item.title}
                  </p>
                  <p className="text-xs text-primary">
                    {Number(item.minPrice).toLocaleString("fa-IR")} تومان
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-sm text-zinc-500 flex flex-col items-center gap-2">
              <PackageSearch className="h-8 w-8 text-zinc-400" />
              نتیجه‌ای یافت نشد
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchWithPreview;
