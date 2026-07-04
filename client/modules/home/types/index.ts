export interface GetCategory {
  id: number;
  name: string;
  slug: string;
  parentId: number | null;
  icon: string;
  specsSchema: string[] | null;
  subcategories: GetCategory[];
}

export type SpecValue = string | number | boolean | null;

export interface ListingSeller {
  id: number;
  firstName: string;
  lastName: string;
}

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
    specsSchema: string[] | null;
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
  } | null;
  user: ListingSeller;
}

export interface Pagination {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ListingsResponse {
  items: GetListing[];
  pagination: Pagination;
}

export interface ListingFilters {
  search?: string;
  categoryId?: number | null;
  cityId?: number | null;
  minPrice?: number | null;
  maxPrice?: number | null;
  condition?: "new" | "used" | null;
  isAmazingOffer?: boolean | null;
  sort?: "newest" | "cheapest" | "expensive" | "top_rated";
  page?: number;
  limit?: number;
}
