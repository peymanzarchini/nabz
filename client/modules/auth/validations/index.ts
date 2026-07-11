import { z } from "zod";

export const registerSchema = z.object({
  firstName: z.string().min(2, "نام باید حداقل ۲ کاراکتر باشد"),
  lastName: z.string().min(2, "نام خانوادگی باید حداقل ۲ کاراکتر باشد"),
  email: z.email("فرمت ایمیل نامعتبر است"),
  phoneNumber: z
    .string()
    .regex(/^\+?[0-9]{10,15}$/, "فرمت شماره موبایل نامعتبر است (مثال: 09123456789)"),
  password: z.string().min(8, "رمز عبور باید حداقل ۸ کاراکتر باشد"),
});

export const verifySchema = z.object({
  code: z.string().length(6, "کد تایید باید دقیقاً ۶ رقم باشد"),
});

export const loginEmailSchema = z.object({
  identifier: z.email("فرمت ایمیل نامعتبر است"),
  password: z.string().min(8, "رمز عبور باید حداقل ۸ کاراکتر باشد"),
});

export const sendOtpSchema = z.object({
  phoneNumber: z.string().regex(/^\+?[0-9]{10,15}$/, "فرمت شماره موبایل نامعتبر است"),
});

export const verifyOtpSchema = z.object({
  code: z.string().length(6, "کد تایید باید دقیقاً ۶ رقم باشد"),
});

export type LoginEmailData = z.infer<typeof loginEmailSchema>;
export type SendOtpData = z.infer<typeof sendOtpSchema>;
export type VerifyOtpData = z.infer<typeof verifyOtpSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type VerifyFormData = z.infer<typeof verifySchema>;
