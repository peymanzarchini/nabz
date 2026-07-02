export interface GetCategory {
  id: number;
  name: string;
  slug: string;
  parentId: number | null;
  icon: string;
  specsSchema: string[] | null;
  subcategories: GetCategory[];
}

type SpecValue = string | number | boolean | null;

export interface GetListing {
  id: number;
  title: string;
  description: string;
  price: string;
  isNegotiable: boolean;
  condition: string;
  status: string;
  latitude: string;
  longitude: string;
  thumbnail: string;
  images: string[];
  stock: number;
  specs: Record<string, SpecValue>;
  averageRating: number;
  reviewCount: number;
  aiReviewSummary: null;
  discountPercentage: number;
  discountExpiry: string | null;
  isAmazingOffer: boolean;
  finalPrice: string;
  rejectionReason: string | null;
  userId: number;
  createdAt: string;
  updatedAt: string;
  category: {
    id: number;
    name: string;
    slug: string;
    specsSchema: null;
  };
  city: {
    id: number;
    name: string;
    slug: string;
  };
  district: {
    id: number;
    name: string;
    slug: string;
  };
}
