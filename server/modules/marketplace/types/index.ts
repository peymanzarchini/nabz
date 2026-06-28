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

export type SpecFieldType = "string" | "number" | "dropdown" | "boolean";

export interface SpecFieldSchema {
  label: string;
  type: SpecFieldType;
  options?: string[];
  required?: boolean;
}

export type SpecsSchema = Record<string, SpecFieldSchema>;

export type SpecValue = string | number | boolean | string[] | null | undefined;

export type ListingSpecs = Record<string, SpecValue>;
