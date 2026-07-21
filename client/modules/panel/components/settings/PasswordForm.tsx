"use client";

import { Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { PasswordFormProps } from "../../types";

const PasswordForm = ({ passwordForm, passwordMutation }: PasswordFormProps) => {
  const inputClass =
    "mt-1.5 h-11 bg-gray-50 border-gray-200 text-gray-900 focus:border-violet-500 focus:ring-violet-500 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white dark:placeholder:text-zinc-400 rounded-sm";

  return (
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
  );
};

export default PasswordForm;
