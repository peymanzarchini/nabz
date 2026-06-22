import { Request, Response, NextFunction } from "express";
import { authService } from "../services/auth.service.js";
import { setAccessTokenCookie, setRefreshTokenCookie } from "@/utils/cookie.js";

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
}

export const authController = new AuthController();
