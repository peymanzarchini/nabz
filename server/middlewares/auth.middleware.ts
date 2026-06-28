import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "@/config/env.js";
import { HttpError } from "@/utils/httpError.js";
import { AuthenticatedJwtPayload, UserRole } from "@/types/index.js";

export function authenticate(req: Request, _res: Response, next: NextFunction): void {
  try {
    let token: string = "";
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    } else {
      token = req.cookies?.access_token || "";
    }

    if (!token) {
      throw HttpError.unAuthorized("Access token is required");
    }

    const decoded = jwt.verify(token, env.jwt.secret) as AuthenticatedJwtPayload;

    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      next(HttpError.unAuthorized("Token has expired"));
      return;
    }

    if (error instanceof jwt.JsonWebTokenError) {
      next(HttpError.unAuthorized("Invalid token"));
      return;
    }

    next(error);
  }
}

export function authorize(...roles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(HttpError.unAuthorized("Authentication required"));
      return;
    }

    if (!roles.includes(req.user.role)) {
      next(HttpError.forbidden("You do not have permission to access this resource"));
      return;
    }

    next();
  };
}

export const adminOnly = authorize(UserRole.ADMIN);
export const sellerAccess = authorize(UserRole.SELLER, UserRole.ADMIN);
export const moderatorAccess = authorize(UserRole.ADMIN, UserRole.SUPPORT);
