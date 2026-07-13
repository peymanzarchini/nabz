export type SpecFieldType = "string" | "number" | "dropdown" | "boolean";

export interface SpecFieldSchema {
  label: string;
  type: SpecFieldType;
  options?: string[];
  required?: boolean;
  isVariant?: boolean;
}

export type SpecsSchema = Record<string, SpecFieldSchema>;

export type SpecValue = string | number | boolean | null;

export interface GetCategory {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  icon: string;
  specsSchema: SpecsSchema | null;
  subcategories: GetCategory[];
}

export interface ListingSeller {
  id: string;
  firstName: string;
  lastName: string;
}

export interface ListingVariant {
  id: string;
  specs: Record<string, string>;
  price: number;
  discountPercentage: number;
  discountExpiry: string | null;
  finalPrice: number;
  stock: number;
  sku: string | null;
}

export interface GetListing {
  id: string;
  title: string;
  slug: string;
  description: string;
  isNegotiable: boolean;
  condition: string;
  status: string;
  latitude: string;
  longitude: string;
  thumbnail: string;
  images: string[];
  specs: Record<string, SpecValue>;
  minPrice: number;
  averageRating: number;
  reviewCount: number;
  aiReviewSummary: null;
  isAmazingOffer: boolean;
  rejectionReason: string | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
  category: {
    id: string;
    name: string;
    slug: string;
    specsSchema: SpecsSchema | null;
  };
  city: {
    id: string;
    name: string;
    slug: string;
  };
  district: {
    id: string;
    name: string;
    slug: string;
  } | null;
  user: ListingSeller;
  variants?: ListingVariant[];
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
  categoryId?: string | null;
  cityId?: string | null;
  minPrice?: number | null;
  maxPrice?: number | null;
  condition?: "new" | "used" | null;
  isAmazingOffer?: boolean | null;
  sort?: "newest" | "cheapest" | "expensive" | "top_rated";
  page?: number;
  limit?: number;
}
