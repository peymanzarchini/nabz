"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, User2, Lock, Camera, X } from "lucide-react";
import Image from "next/image";
import api from "@/lib/api";
import { useAuth } from "@/lib/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { ApiResponse } from "@/types";
import { getApiErrorMessage } from "@/utils/getApiErrorMessage";
import { User } from "@/modules/auth/types";

// اسکیمای اعتبارسنجی پروفایل
const profileSchema = z.object({
  firstName: z.string().trim().min(2, "نام باید حداقل ۲ کاراکتر باشد"),
  lastName: z.string().trim().min(2, "نام خانوادگی باید حداقل ۲ کاراکتر باشد"),
});

// اسکیمای اعتبارسنجی رمز عبور
const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "رمز عبور فعلی الزامی است"),
    newPassword: z.string().min(8, "رمز عبور باید حداقل ۸ کاراکتر باشد"),
    confirmPassword: z.string().min(8, "تکرار رمز عبور الزامی است"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "رمزهای عبور جدید یکسان نیستند",
    path: ["confirmPassword"],
  });

type ProfileFormValues = z.infer<typeof profileSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

export default function SettingsPage() {
  const { user, updateUser } = useAuth();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
    },
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
  });

  // ۱. آپدیت پروفایل و آواتار
  const profileMutation = useMutation({
    mutationFn: async (data: ProfileFormValues) => {
      const formData = new FormData();
      formData.append("firstName", data.firstName);
      formData.append("lastName", data.lastName);
      if (avatarFile) formData.append("avatar", avatarFile);

      const { data: res } = await api.patch<ApiResponse<User>>("/auth/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.body;
    },
    onSuccess: (updatedUser) => {
      toast.success("پروفایل با موفقیت بروزرسانی شد.");
      updateUser(updatedUser); // آپدیت Context سراسری
      setAvatarFile(null);
      setAvatarPreview(null);
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  // ۲. تغییر رمز عبور
  const passwordMutation = useMutation({
    mutationFn: async (data: PasswordFormValues) => {
      await api.post("/auth/change-password", {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      });
    },
    onSuccess: () => {
      toast.success("رمز عبور با موفقیت تغییر کرد.");
      passwordForm.reset();
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const removeAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview(null);
  };

  const inputClass =
    "mt-1.5 h-11 bg-gray-50 border-gray-200 text-gray-900 focus:border-violet-500 focus:ring-violet-500 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white dark:placeholder:text-zinc-400 rounded-sm";

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-black text-zinc-800 dark:text-white">تنظیمات حساب کاربری</h1>
        <p className="text-sm text-zinc-500 mt-1">اطلاعات پروفایل و امنیت خود را مدیریت کنید</p>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800 p-6">
        <h2 className="text-lg font-bold text-zinc-800 dark:text-white mb-6 flex items-center gap-2">
          <User2 className="h-5 w-5 text-primary" />
          اطلاعات پروفایل
        </h2>

        <form
          onSubmit={profileForm.handleSubmit((data) => profileMutation.mutate(data))}
          className="space-y-6"
        >
          <div className="flex items-center gap-6">
            <div className="relative w-24 h-24 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden shrink-0 border-4 border-white dark:border-zinc-900 shadow-md">
              {avatarPreview ? (
                <Image
                  src={avatarPreview}
                  alt="preview"
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : user?.avatar ? (
                <Image
                  src={`http://localhost:5000${user.avatar}`}
                  alt="avatar"
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl font-black text-primary">
                  {user?.firstName?.charAt(0)}
                </div>
              )}
              {avatarPreview && (
                <button
                  type="button"
                  onClick={removeAvatar}
                  className="absolute top-2 left-3 bg-red-500 text-white p-1 rounded-full"
                >
                  <X className="h-2 w-2" />
                </button>
              )}
            </div>
            <div>
              <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-200 mb-2 block">
                تغییر عکس پروفایل
              </Label>
              <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-sm text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors">
                <Camera className="h-4 w-4" />
                انتخاب عکس
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </label>
              <p className="text-xs text-zinc-400 mt-2">حداکثر حجم: ۲ مگابایت</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-zinc-700 dark:text-zinc-200">نام</Label>
              <Input {...profileForm.register("firstName")} className={inputClass} />
              {profileForm.formState.errors.firstName && (
                <p className="text-xs text-red-500 mt-1">
                  {profileForm.formState.errors.firstName.message}
                </p>
              )}
            </div>
            <div>
              <Label className="text-zinc-700 dark:text-zinc-200">نام خانوادگی</Label>
              <Input {...profileForm.register("lastName")} className={inputClass} />
              {profileForm.formState.errors.lastName && (
                <p className="text-xs text-red-500 mt-1">
                  {profileForm.formState.errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={profileMutation.isPending}
              className="bg-linear-to-r from-violet-600 to-teal-500 text-white cursor-pointer rounded-sm"
            >
              {profileMutation.isPending ? <Loader2 className="animate-spin ml-2" /> : null}
              ذخیره تغییرات
            </Button>
          </div>
        </form>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800 p-6">
        <h2 className="text-lg font-bold text-zinc-800 dark:text-white mb-6 flex items-center gap-2">
          <Lock className="h-5 w-5 text-primary" />
          تغییر رمز عبور
        </h2>

        <form
          onSubmit={passwordForm.handleSubmit((data) => passwordMutation.mutate(data))}
          className="space-y-4"
        >
          <div>
            <Label className="text-zinc-700 dark:text-zinc-200">رمز عبور فعلی</Label>
            <PasswordInput
              {...passwordForm.register("currentPassword")}
              className={inputClass}
              dir="ltr"
            />
            {passwordForm.formState.errors.currentPassword && (
              <p className="text-xs text-red-500 mt-1">
                {passwordForm.formState.errors.currentPassword.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-zinc-700 dark:text-zinc-200">رمز عبور جدید</Label>
              <PasswordInput
                {...passwordForm.register("newPassword")}
                className={inputClass}
                dir="ltr"
              />
              {passwordForm.formState.errors.newPassword && (
                <p className="text-xs text-red-500 mt-1">
                  {passwordForm.formState.errors.newPassword.message}
                </p>
              )}
            </div>
            <div>
              <Label className="text-zinc-700 dark:text-zinc-200">تکرار رمز عبور جدید</Label>
              <PasswordInput
                {...passwordForm.register("confirmPassword")}
                className={inputClass}
                dir="ltr"
              />
              {passwordForm.formState.errors.confirmPassword && (
                <p className="text-xs text-red-500 mt-1">
                  {passwordForm.formState.errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={passwordMutation.isPending}
              className="bg-linear-to-r from-violet-600 to-teal-500 text-white cursor-pointer rounded-sm"
            >
              {passwordMutation.isPending ? <Loader2 className="animate-spin ml-2" /> : null}
              تغییر رمز عبور
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
