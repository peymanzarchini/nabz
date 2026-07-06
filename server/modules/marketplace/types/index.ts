import { Category } from "../models/category.model.js";

export enum ListingStatus {
  PENDING = "pending",
  ACTIVE = "active",
  REJECTED = "rejected",
  SOLD = "sold",
}

export enum ListingCondition {
  NEW = "new",
  USED = "used",
}

export interface ListingVariant {
  id: number;
  listingId: number;
  specs: Record<string, string>;
  price: number;
  discountPercentage: number;
  discountExpiry: Date | null;
  finalPrice: number;
  stock: number;
  sku: string | null;
}

export type SpecFieldType = "string" | "number" | "dropdown" | "boolean";

export interface SpecFieldSchema {
  label: string;
  type: SpecFieldType;
  options?: string[];
  required?: boolean;
  isVariant?: boolean;
}

export type SpecsSchema = Record<string, SpecFieldSchema>;

export type SpecValue = string | number | boolean | string[] | null | undefined;

export type ListingSpecs = Record<string, SpecValue>;

export type PartialSpecFieldSchema = Partial<SpecFieldSchema>;

export type UpdateSpecsSchemaPayload = Record<string, PartialSpecFieldSchema | null>;

export enum ReviewStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
}

export enum ConversationStatus {
  ACTIVE = "active",
  CLOSED = "closed",
}

export type CategoryWithSubs = Category & { subcategories?: CategoryWithSubs[] };
