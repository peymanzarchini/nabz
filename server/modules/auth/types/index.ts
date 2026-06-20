import { UserRole, UserStatus } from "@/types/index.js";

export interface AuthResponse {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  avatar: string;
  role: UserRole;
  status: UserStatus;
  isVerified: boolean;
}

export interface LoginResponse {
  user: AuthResponse;
  accessToken: string;
  refreshToken: string;
}
