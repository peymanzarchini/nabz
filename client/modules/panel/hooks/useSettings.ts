import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/lib/api";
import { useAuth } from "@/lib/providers/AuthProvider";
import { ApiResponse } from "@/types";
import { getApiErrorMessage } from "@/utils/getApiErrorMessage";
import { User } from "@/modules/auth/types";
import {
  PasswordFormValues,
  passwordSchema,
  ProfileFormValues,
  profileSchema,
} from "@/modules/panel/validations/settingsSchema";

export const useSettings = () => {
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
      updateUser(updatedUser);
      setAvatarFile(null);
      setAvatarPreview(null);
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

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

  return {
    user,
    avatarPreview,
    profileForm,
    passwordForm,
    profileMutation,
    passwordMutation,
    handleAvatarChange,
    removeAvatar,
  };
};
