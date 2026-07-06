"use client";

import { useState } from "react";
import Image from "next/image";

interface ListingGalleryProps {
  images: string[];
  title: string;
}

const ListingGallery = ({ images, title }: ListingGalleryProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const allImages = images && images.length > 0 ? images : ["/placeholder.png"];

  return (
    <div className="flex flex-col gap-4">
      <div className="relative w-full aspect-4/3 bg-white dark:bg-zinc-800 rounded-2xl overflow-hidden border border-zinc-100 dark:border-zinc-800">
        <Image
          src={allImages[activeIndex]}
          alt={title}
          fill
          className="object-contain"
          unoptimized
          priority
        />
      </div>

      {allImages.length > 1 && (
        <div className="grid grid-cols-5 gap-3">
          {allImages.map((img, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`relative aspect-square bg-zinc-50 dark:bg-zinc-800 rounded-xl overflow-hidden border-2 transition-all ${
                activeIndex === index
                  ? "border-primary"
                  : "border-transparent hover:border-zinc-300 dark:hover:border-zinc-600"
              }`}
            >
              <Image
                src={img}
                alt={`${title} - تصویر ${index + 1}`}
                fill
                className="object-cover"
                unoptimized
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ListingGallery;
