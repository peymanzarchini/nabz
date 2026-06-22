import { HttpError } from "@/utils/httpError.js";
import { Auth } from "../model/auth.model.js";
import {
  ChangePasswordInput,
  ForgotPasswordInput,
  LoginInput,
  RegisterInput,
  ResetPasswordInput,
} from "../validations/auth.schema.js";
import { Otp } from "../model/otp.model.js";
import { UserStatus } from "@/types/index.js";
import {
  sendPasswordChangedNotification,
  sendPasswordResetEmail,
  sendVerificationEmail,
} from "@/utils/email.service.js";
import { formatAuthResponse } from "../format-response/formatAuthREsponse.js";
import { Op } from "@sequelize/core";
import { AuthResponse, LoginResponse } from "../types/index.js";
import {
  generateAccessToken,
  generatePasswordResetToken,
  generateRefreshToken,
  TokenPair,
  verifyPasswordResetToken,
  verifyRefreshToken,
} from "@/utils/jwt.js";
import { env } from "@/config/env.js";
import { logger } from "@/config/logger.js";

class AuthService {
  async register(data: RegisterInput): Promise<{ message: string }> {
    const existingUser = await Auth.findOne({ where: { email: data.email } });

    if (existingUser && existingUser.isVerified) {
      throw HttpError.conflict("این ایمیل قبلاً تایید شده و فعال است.");
    }

    const otpCode: string = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt: Date = new Date(Date.now() + 5 * 60 * 1000);

    const otpRecord = await Otp.findOne({ where: { email: data.email } });
    if (otpRecord) {
      await otpRecord.update({
        code: otpCode,
        expiresAt,
        attempts: 1,
      });
    } else {
      await Otp.create({ email: data.email, code: otpCode, expiresAt, attempts: 1 });
    }

    if (existingUser) {
      await existingUser.update({
        firstName: data.firstName,
        lastName: data.lastName,
        password: data.password,
        phoneNumber: data.phoneNumber,
        status: UserStatus.PENDING,
      });
    } else {
      await Auth.create({
        ...data,
        status: UserStatus.PENDING,
        isVerified: false,
      });
    }

    await sendVerificationEmail(data.email, otpCode);

    return { message: "کد تایید با موفقیت به ایمیل شما ارسال شد." };
  }

  async resendCode(email: string): Promise<{ message: string }> {
    const otpRecord = await Otp.findOne({ where: { email } });

    if (!otpRecord) {
      throw HttpError.notFound("درخواست معتبری برای این ایمیل یافت نشد.");
    }

    if (otpRecord.attempts >= 3) {
      await otpRecord.destroy();
      await Auth.destroy({ where: { email, isVerified: false } });
      throw HttpError.badRequest("تعداد دفعات ارسال کد به پایان رسید. لطفاً مجدداً ثبت‌نام کنید.");
    }

    const newCode: string = Math.floor(100000 + Math.random() * 900000).toString();

    await otpRecord.update({
      code: newCode,
      attempts: otpRecord.attempts + 1,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    await sendVerificationEmail(email, newCode);

    return { message: `کد تایید جدید ارسال شد (تلاش ${otpRecord.attempts} از ۳)` };
  }

  async verifyEmail(email: string, code: string): Promise<{ message: string }> {
    const otpRecord = await Otp.findOne({ where: { email } });

    if (!otpRecord) throw HttpError.notFound("کد تایید یافت نشد");

    if (new Date() > otpRecord.expiresAt) {
      await otpRecord.destroy();
      throw HttpError.badRequest("کد تایید منقضی شده است. لطفاً کد جدید درخواست کنید.");
    }

    if (otpRecord.code !== code) {
      otpRecord.attempts += 1;

      if (otpRecord.attempts >= 5) {
        await otpRecord.destroy();
        await Auth.destroy({ where: { email, isVerified: false } });
        throw HttpError.forbidden(
          "تعداد دفعات وارد کردن کد اشتباه بیش از حد مجاز است. لطفاً مجدداً ثبت‌نام کنید.",
        );
      }

      await otpRecord.save();
      throw HttpError.badRequest(
        `کد وارد شده اشتباه است. ${5 - otpRecord.attempts} تلاش دیگر باقی مانده است.`,
      );
    }

    const user = await Auth.findOne({ where: { email } });
    if (!user) throw HttpError.notFound("کاربر مورد نظر یافت نشد.");

    await user.update({
      isVerified: true,
      status: UserStatus.ACTIVE,
    });

    await otpRecord.destroy();

    return { message: "حساب کاربری شما با موفقیت فعال شد." };
  }

  async login(data: LoginInput): Promise<LoginResponse> {
    const { identifier, password } = data;

    const user = await Auth.withScope("withPassword").findOne({
      where: {
        [Op.or]: [{ email: identifier.toLowerCase() }, { phoneNumber: identifier }],
      },
    });

    if (!user) {
      throw HttpError.unAuthorized("ایمیل/شماره موبایل یا رمز عبور اشتباه است.");
    }

    const isMatch = await user.validPassword(password);
    if (!isMatch) {
      throw HttpError.unAuthorized("ایمیل/شماره موبایل یا رمز عبور اشتباه است.");
    }

    if (!user.isVerified || user.status !== UserStatus.ACTIVE) {
      throw HttpError.forbidden(
        "حساب کاربری شما فعال نیست. لطفاً ابتدا ثبت‌نام خود را تکمیل کنید.",
      );
    }

    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    return {
      user: formatAuthResponse(user),
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(refreshToken: string): Promise<TokenPair> {
    try {
      const decoded = verifyRefreshToken(refreshToken);
      const user = await Auth.findByPk(decoded.id);
      if (!user) {
        throw HttpError.unAuthorized("User not found");
      }

      const tokenPayload = {
        id: user.id,
        email: user.email,
        role: user.role,
      };

      return {
        accessToken: generateAccessToken(tokenPayload),
        refreshToken: generateRefreshToken(tokenPayload),
      };
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      }
      throw HttpError.unAuthorized("Invalid or expired refresh token");
    }
  }

  async getProfile(userId: number): Promise<AuthResponse> {
    const user = await Auth.findByPk(userId);

    if (!user) {
      throw HttpError.notFound("User not found");
    }

    return formatAuthResponse(user);
  }

  async changePassword(userId: number, data: ChangePasswordInput): Promise<{ message: string }> {
    const user = await Auth.withScope("withPassword").findByPk(userId);
    if (!user) throw HttpError.notFound("کاربر یافت نشد.");

    const isMatch = await user.validPassword(data.currentPassword);
    if (!isMatch) throw HttpError.unAuthorized("رمز عبور فعلی اشتباه است.");

    user.password = data.newPassword;
    await user.save();

    await sendPasswordChangedNotification(user.email);
    return { message: "رمز عبور با موفقیت تغییر کرد." };
  }

  async forgotPassword(data: ForgotPasswordInput): Promise<{ message: string }> {
    const user = await Auth.findOne({ where: { email: data.email } });

    if (!user) return { message: "اگر ایمیل معتبر باشد، لینک بازیابی ارسال شد." };

    const resetToken = generatePasswordResetToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });
    const resetLink = `${env.clientUrl}/reset-password?token=${resetToken}`;

    await sendPasswordResetEmail(user.email, resetLink);

    return { message: "اگر ایمیل معتبر باشد، لینک بازیابی ارسال شد." };
  }

  async resetPassword(data: ResetPasswordInput): Promise<{ message: string }> {
    let decoded;
    try {
      decoded = verifyPasswordResetToken(data.token);
    } catch (error) {
      logger.error(error);
      throw HttpError.badRequest("توکن نامعتبر یا منقضی شده است");
    }

    const user = await Auth.scope("withPassword").findByPk(decoded.id);
    if (!user) throw HttpError.notFound("کاربر یافت نشد");

    user.password = data.newPassword;
    await user.save();

    await sendPasswordChangedNotification(user.email);
    return { message: "رمز عبور با موفقیت بازیابی شد." };
  }
}

export const authService = new AuthService();
