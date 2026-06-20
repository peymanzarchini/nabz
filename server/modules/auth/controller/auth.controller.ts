import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service.js";

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await AuthService.register(req.body);
      res.success(user.message, null, 201);
    } catch (error) {
      next(error);
    }
  }

  static async resend(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email } = req.body as { email: string };
      const result = await AuthService.resendCode(email);
      res.success(result.message, null);
    } catch (error) {
      next(error);
    }
  }

  static async verify(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, code } = req.body as { email: string; code: string };
      const result = await AuthService.verifyEmail(email, code);
      res.success(result.message, null);
    } catch (error) {
      next(error);
    }
  }
}
