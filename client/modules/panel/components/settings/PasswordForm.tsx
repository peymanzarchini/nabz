"use client";

import { Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { PasswordFormProps } from "../../types";

const PasswordForm = ({ passwordForm, passwordMutation }: PasswordFormProps) => {
  const inputClass =
    "mt-1.5 h-11 bg-muted/40 border-input text-foreground focus:border-primary focus:ring-primary/50 rounded-sm placeholder:text-muted-foreground/60";

  return (
    <div className="bg-card rounded-sm shadow-sm border border-border p-6">
      <h2 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
        <Lock className="h-5 w-5 text-primary" />
        تغییر رمز عبور
      </h2>

      <form
        onSubmit={passwordForm.handleSubmit((data) => passwordMutation.mutate(data))}
        className="space-y-4"
      >
        <div>
          <Label className="text-foreground">رمز عبور فعلی</Label>
          <PasswordInput
            {...passwordForm.register("currentPassword")}
            className={inputClass}
            dir="ltr"
          />
          {passwordForm.formState.errors.currentPassword && (
            <p className="text-xs text-destructive mt-1">
              {passwordForm.formState.errors.currentPassword.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-foreground">رمز عبور جدید</Label>
            <PasswordInput
              {...passwordForm.register("newPassword")}
              className={inputClass}
              dir="ltr"
            />
            {passwordForm.formState.errors.newPassword && (
              <p className="text-xs text-destructive mt-1">
                {passwordForm.formState.errors.newPassword.message}
              </p>
            )}
          </div>
          <div>
            <Label className="text-foreground">تکرار رمز عبور جدید</Label>
            <PasswordInput
              {...passwordForm.register("confirmPassword")}
              className={inputClass}
              dir="ltr"
            />
            {passwordForm.formState.errors.confirmPassword && (
              <p className="text-xs text-destructive mt-1">
                {passwordForm.formState.errors.confirmPassword.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={passwordMutation.isPending}
            className="cursor-pointer rounded-sm"
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
