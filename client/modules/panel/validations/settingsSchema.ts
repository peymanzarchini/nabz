import { z } from "zod";

export const profileSchema = z.object({
  firstName: z.string().trim().min(2, "نام باید حداقل ۲ کاراکتر باشد"),
  lastName: z.string().trim().min(2, "نام خانوادگی باید حداقل ۲ کاراکتر باشد"),
});

export const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "رمز عبور فعلی الزامی است"),
    newPassword: z.string().min(8, "رمز عبور باید حداقل ۸ کاراکتر باشد"),
    confirmPassword: z.string().min(8, "تکرار رمز عبور الزامی است"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "رمزهای عبور جدید یکسان نیستند",
    path: ["confirmPassword"],
  });

export type ProfileFormValues = z.infer<typeof profileSchema>;
export type PasswordFormValues = z.infer<typeof passwordSchema>;
