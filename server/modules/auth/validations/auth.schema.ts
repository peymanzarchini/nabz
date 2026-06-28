import { z } from "zod";
import { passwordRegex, phoneRegex } from "../constants/index.js";
import { UserRole } from "@/types/index.js";

export const registerSchema = z.object({
  body: z.object({
    firstName: z
      .string({ message: "First name is required" })
      .trim()
      .min(2, "First name must be at least 2 characters")
      .max(50, "First name cannot exceed 50 characters"),
    lastName: z
      .string({ message: "Last name is required" })
      .trim()
      .min(2, "Last name must be at least 2 characters")
      .max(50, "Last name cannot exceed 50 characters"),
    email: z.email("Invalid email format").toLowerCase().trim(),

    password: z
      .string({ message: "Password is required" })
      .min(8, "Password must be at least 8 characters")
      .regex(
        passwordRegex,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number",
      ),
    phoneNumber: z
      .string({ message: "Phone number is required" })
      .regex(phoneRegex, "Invalid phone number format"),
    role: z
      .enum([UserRole.CUSTOMER, UserRole.SELLER, UserRole.DRIVER, UserRole.SUPPORT])
      .optional()
      .default(UserRole.CUSTOMER),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    identifier: z
      .string({ message: "Email or phone number is required" })
      .trim()
      .min(5, "Identifier is too short")
      .refine(
        (value) => {
          const isEmail = z.email().safeParse(value).success;
          const isPhone = phoneRegex.test(value);
          return isEmail || isPhone;
        },
        {
          message: "Invalid email or phone number format",
        },
      ),
    password: z.string({ message: "Password is required" }).min(1, "Password is required"),
  }),
});

export const changePasswordSchema = z.object({
  body: z
    .object({
      currentPassword: z.string({ message: "Current password is required" }),

      newPassword: z
        .string({ message: "New password is required" })
        .min(8, "Password must be at least 8 characters")
        .regex(
          passwordRegex,
          "Password must contain at least one uppercase letter, one lowercase letter, and one number",
        ),

      confirmPassword: z.string({ message: "Confirm password is required" }),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }),
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.email().toLowerCase().trim(),
  }),
});

export const resetPasswordSchema = z.object({
  body: z
    .object({
      token: z.string().min(10),
      newPassword: z.string().min(8).regex(passwordRegex),
      confirmPassword: z.string().min(1),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: "Password do not match",
      path: ["confirmPassword"],
    }),
});

export const resendSchema = z.object({
  body: z.object({
    email: z.email("Invalid email format").toLowerCase().trim(),
  }),
});

export const updateRoleSchema = z.object({
  params: z.object({
    id: z.coerce.number(),
  }),
  body: z.object({
    role: z.enum([
      UserRole.ADMIN,
      UserRole.SUPPORT,
      UserRole.SELLER,
      UserRole.DRIVER,
      UserRole.CUSTOMER,
    ]),
  }),
});

export type RegisterInput = z.infer<typeof registerSchema>["body"];
export type LoginInput = z.infer<typeof loginSchema>["body"];
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>["body"];
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>["body"];
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>["body"];
export type ResendInput = z.infer<typeof resendSchema>["body"];
export type UpdateRoleInput = z.infer<typeof updateRoleSchema>;
