import Link from "next/link";
import Image from "next/image";
import { Zap, Percent } from "lucide-react";
import { GetListing } from "@/modules/home/types";

interface AmazingOfferCardProps {
  offer: GetListing;
  index: number;
}

const AmazingOfferCard = ({ offer, index }: AmazingOfferCardProps) => {
  const maxDiscount =
    offer.variants && offer.variants.length > 0
      ? Math.max(...offer.variants.map((v) => v.discountPercentage || 0))
      : 0;

  const minFinalPrice =
    offer.variants && offer.variants.length > 0
      ? Math.min(...offer.variants.map((v) => v.finalPrice || v.price))
      : offer.minPrice;

  return (
    <Link
      href={`/listings/${offer.category?.slug || "unknown"}/${offer.slug}`}
      className="group bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border border-border/30 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/20 cursor-pointer animate-slide-up"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="relative aspect-square bg-secondary/50 p-4 flex items-center justify-center overflow-hidden">
        {maxDiscount > 0 && (
          <div className="absolute top-3 right-3 bg-destructive text-destructive-foreground text-xs font-bold px-2.5 py-1 rounded-lg z-10 flex items-center gap-1">
            <Percent className="h-3 w-3" />
            {maxDiscount}%
          </div>
        )}

        {offer.thumbnail ? (
          <Image
            src={
              offer.thumbnail.startsWith("http")
                ? offer.thumbnail
                : `http://localhost:5000${offer.thumbnail}`
            }
            alt={offer.title}
            fill
            className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
            unoptimized
          />
        ) : (
          <div className="text-muted-foreground/50">
            <Zap className="h-16 w-16" />
          </div>
        )}
      </div>

      <div className="p-4 space-y-2">
        <h3 className="font-bold text-sm text-foreground truncate group-hover:text-primary transition-colors">
          {offer.title}
        </h3>

        <div className="flex flex-col items-end gap-1">
          <span className="font-black text-base text-foreground">
            {minFinalPrice > 0 ? minFinalPrice.toLocaleString("fa-IR") : "توافقی"}
            {minFinalPrice > 0 && (
              <span className="text-[10px] font-normal text-muted-foreground mr-1">تومان</span>
            )}
          </span>

          {maxDiscount > 0 && offer.minPrice > minFinalPrice && (
            <span className="text-xs text-muted-foreground line-through">
              {Number(offer.minPrice).toLocaleString("fa-IR")}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default AmazingOfferCard;
