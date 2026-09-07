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
    "mt-1.5 h-11 bg-muted/40 border-input text-foreground focus:border-primary focus:ring-primary/50 rounded-sm placeholder:text-muted-foreground/60";

  return (
    <div className="bg-card rounded-sm shadow-sm border border-border p-6">
      <h2 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
        <User2 className="h-5 w-5 text-primary" />
        اطلاعات پروفایل
      </h2>

      <form
        onSubmit={profileForm.handleSubmit((data) => profileMutation.mutate(data))}
        className="space-y-6"
      >
        <div className="flex items-center gap-6">
          <div className="relative w-24 h-24 rounded-full bg-muted overflow-hidden shrink-0 border-4 border-card shadow-md">
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
                className="absolute top-2 left-3 bg-destructive text-destructive-foreground p-1 rounded-sm"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <div>
            <Label className="text-sm font-medium text-foreground mb-2 block">
              تغییر عکس پروفایل
            </Label>
            <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-muted/40 border border-border text-foreground rounded-sm text-sm font-medium hover:bg-muted transition-colors">
              <Camera className="h-4 w-4" />
              انتخاب عکس
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </label>
            <p className="text-xs text-muted-foreground mt-2">حداکثر حجم: ۲ مگابایت</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-foreground">نام</Label>
            <Input {...profileForm.register("firstName")} className={inputClass} />
            {profileForm.formState.errors.firstName && (
              <p className="text-xs text-destructive mt-1">
                {profileForm.formState.errors.firstName.message}
              </p>
            )}
          </div>
          <div>
            <Label className="text-foreground">نام خانوادگی</Label>
            <Input {...profileForm.register("lastName")} className={inputClass} />
            {profileForm.formState.errors.lastName && (
              <p className="text-xs text-destructive mt-1">
                {profileForm.formState.errors.lastName.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={profileMutation.isPending}
            className="cursor-pointer rounded-sm"
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
