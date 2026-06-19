import { JwtPayload } from "jsonwebtoken";

export enum UserRole {
  ADMIN = "admin",
  SUPPORT = "support",
  SELLER = "seller",
  DRIVER = "driver",
  CUSTOMER = "customer",
}

export enum UserStatus {
  ACTIVE = "active",
  BANNED = "banned",
  PENDING = "pending",
}

export interface AuthenticatedUser {
  id: number;
  email: string;
  role: UserRole;
}

export interface AuthenticatedJwtPayload extends JwtPayload, AuthenticatedUser {}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  body: T | null;
  status: number;
}

export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: PaginationMeta;
}
