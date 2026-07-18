import { Request, Response, NextFunction } from "express";
import { authService } from "../services/auth.service.js";
import {
  clearAccessTokenCookie,
  clearRefreshTokenCookie,
  setAccessTokenCookie,
  setRefreshTokenCookie,
} from "@/utils/cookie.js";

class AuthController {
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await authService.register(req.body);
      res.success(user.message, null, 201);
    } catch (error) {
      next(error);
    }
  }

  async resend(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email } = req.body as { email: string };
      const result = await authService.resendCode(email);
      res.success(result.message, null);
    } catch (error) {
      next(error);
    }
  }

  async verify(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, code } = req.body as { email: string; code: string };
      const result = await authService.verifyEmail(email, code);
      res.success(result.message, null);
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await authService.login(req.body);

      setAccessTokenCookie(res, result.accessToken);
      setRefreshTokenCookie(res, result.refreshToken);

      res.success("ورود با موفقیت انجام شد", result.user);
    } catch (error) {
      next(error);
    }
  }

  async refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const token = req.cookies?.refresh_token;
      const result = await authService.refreshToken(token);

      setAccessTokenCookie(res, result.accessToken);
      setRefreshTokenCookie(res, result.refreshToken);

      res.success("توکن جدید ایجاد شد", null);
    } catch (error) {
      next(error);
    }
  }

  async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await authService.getProfile(req.user!.id);
      res.success("Profile fetched", result);
    } catch (error) {
      next(error);
    }
  }

  async changePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await authService.changePassword(req.user!.id, req.body);
      res.success(result.message, null);
    } catch (error) {
      next(error);
    }
  }

  async forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await authService.forgotPassword(req.body);
      res.success(result.message, null);
    } catch (error) {
      next(error);
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await authService.resetPassword(req.body);
      res.success(result.message, null);
    } catch (error) {
      next(error);
    }
  }

  async updateUserRole(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.params.id as string;
      const { role } = req.body;
      const result = await authService.updateUserRole(userId, role);
      res.success(result.message, null);
    } catch (error) {
      next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      clearAccessTokenCookie(res);
      clearRefreshTokenCookie(res);

      res.success("خروج با موفقیت انجام شد.", null);
    } catch (error) {
      next(error);
    }
  }

  async sendPhoneOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await authService.sendPhoneOtp(req.body.phoneNumber);
      res.success(result.message, null);
    } catch (error) {
      next(error);
    }
  }

  async loginWithOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await authService.loginWithOtp(req.body.phoneNumber, req.body.code);

      setAccessTokenCookie(res, result.accessToken);
      setRefreshTokenCookie(res, result.refreshToken);

      res.success("ورود با موفقیت انجام شد", result.user);
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const avatar = req.file ? req.file.filename : undefined;
      const result = await authService.updateProfile(req.user!.id, req.body, avatar);
      res.success("پروفایل با موفقیت بروزرسانی شد", result);
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
