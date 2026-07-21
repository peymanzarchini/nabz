"use client";

import Image from "next/image";
import { Loader2, User2, Camera, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProfileFormProps } from "../../types";

const ProfileForm = ({
  user,
  avatarPreview,
  profileForm,
  profileMutation,
  handleAvatarChange,
  removeAvatar,
}: ProfileFormProps) => {
  const inputClass =
    "mt-1.5 h-11 bg-gray-50 border-gray-200 text-gray-900 focus:border-violet-500 focus:ring-violet-500 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white dark:placeholder:text-zinc-400 rounded-sm";

  return (
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
              <Image src={avatarPreview} alt="preview" fill className="object-cover" unoptimized />
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
                <X className="h-4 w-4" />
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
  );
};

export default ProfileForm;
