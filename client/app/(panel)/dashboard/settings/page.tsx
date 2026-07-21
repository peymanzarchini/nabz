"use client";

import { useSettings } from "@/modules/panel/hooks/useSettings";
import ProfileForm from "@/modules/panel/components/settings/ProfileForm";
import PasswordForm from "@/modules/panel/components/settings/PasswordForm";

const SettingsPage = () => {
  const settings = useSettings();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-black text-zinc-800 dark:text-white">تنظیمات حساب کاربری</h1>
        <p className="text-sm text-zinc-500 mt-1">اطلاعات پروفایل و امنیت خود را مدیریت کنید</p>
      </div>

      <ProfileForm
        user={settings.user}
        avatarPreview={settings.avatarPreview}
        profileForm={settings.profileForm}
        profileMutation={settings.profileMutation}
        handleAvatarChange={settings.handleAvatarChange}
        removeAvatar={settings.removeAvatar}
      />

      <PasswordForm
        passwordForm={settings.passwordForm}
        passwordMutation={settings.passwordMutation}
      />
    </div>
  );
};

export default SettingsPage;
