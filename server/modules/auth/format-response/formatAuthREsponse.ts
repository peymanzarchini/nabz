import { Auth } from "../model/auth.model.js";
import { AuthResponse } from "../types/index.js";

export function formatAuthResponse(user: Auth): AuthResponse {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phoneNumber: user.phoneNumber,
    avatar: user.avatar,
    role: user.role,
    status: user.status,
    isVerified: user.isVerified,
  };
}
