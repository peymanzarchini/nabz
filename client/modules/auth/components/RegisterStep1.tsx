"use client";

import Link from "next/link";
import { Loader2, RefreshCw, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { RegisterStep1Props } from "../types";

const RegisterStep1 = ({
  registerForm,
  onRegisterSubmit,
  num1,
  num2,
  captchaInput,
  setCaptchaInput,
  captchaError,
  generateCaptcha,
}: RegisterStep1Props) => {
  const inputClass =
    "mt-1.5 h-11 bg-muted/40 border-input text-foreground focus:border-primary focus:ring-primary/50 rounded-lg placeholder:text-muted-foreground/60";

  return (
    <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <Label htmlFor="firstName" className="text-foreground">
            نام
          </Label>
          <Input id="firstName" {...registerForm.register("firstName")} className={inputClass} />
          {registerForm.formState.errors.firstName && (
            <p className="text-xs text-destructive mt-1">
              {registerForm.formState.errors.firstName.message}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <Label htmlFor="lastName" className="text-foreground">
            نام خانوادگی
          </Label>
          <Input id="lastName" {...registerForm.register("lastName")} className={inputClass} />
          {registerForm.formState.errors.lastName && (
            <p className="text-xs text-destructive mt-1">
              {registerForm.formState.errors.lastName.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <Label htmlFor="email" className="text-foreground">
            ایمیل
          </Label>
          <Input
            id="email"
            type="email"
            dir="ltr"
            {...registerForm.register("email")}
            className={inputClass}
          />
          {registerForm.formState.errors.email && (
            <p className="text-xs text-destructive mt-1">
              {registerForm.formState.errors.email.message}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <Label htmlFor="phoneNumber" className="text-foreground">
            شماره موبایل
          </Label>
          <Input
            id="phoneNumber"
            type="tel"
            dir="ltr"
            placeholder="09123456789"
            {...registerForm.register("phoneNumber")}
            className={inputClass}
          />
          {registerForm.formState.errors.phoneNumber && (
            <p className="text-xs text-destructive mt-1">
              {registerForm.formState.errors.phoneNumber.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <Label htmlFor="role" className="text-foreground">
            نقش کاربری
          </Label>
          <select
            id="role"
            {...registerForm.register("role")}
            className={
              inputClass + " w-full px-3 cursor-pointer appearance-none text-sm font-medium"
            }
          >
            <option value="customer">مشتری (خریدار)</option>
            <option value="seller">فروشنده</option>
            <option value="driver">راننده (پیک)</option>
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <Label htmlFor="password" className="text-foreground">
            رمز عبور
          </Label>
          <PasswordInput
            id="password"
            dir="ltr"
            {...registerForm.register("password")}
            className={inputClass}
          />
          {registerForm.formState.errors.password && (
            <p className="text-xs text-destructive mt-1">
              {registerForm.formState.errors.password.message}
            </p>
          )}
        </div>
      </div>

      <div className="bg-muted/40 p-4 rounded-lg border border-border mt-2">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-sm font-bold text-foreground">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <span>من ربات نیستم</span>
          </div>
          <button
            type="button"
            onClick={generateCaptcha}
            className="text-muted-foreground hover:text-primary transition-colors cursor-pointer"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-card text-xl font-bold px-4 py-2 rounded-lg border border-border select-none tracking-widest text-foreground">
            {num1} + {num2} = ?
          </div>
          <Input
            type="number"
            value={captchaInput}
            onChange={(e) => {
              setCaptchaInput(e.target.value);
            }}
            className="h-10 w-24 text-center text-lg font-bold bg-card border-border text-foreground rounded-lg"
            placeholder="پاسخ"
          />
        </div>
        {captchaError && <p className="text-xs text-destructive mt-2">{captchaError}</p>}
      </div>

      <Button
        type="submit"
        size="lg"
        className="w-full h-12 text-base font-bold cursor-pointer rounded-lg mt-6"
        disabled={registerForm.formState.isSubmitting}
      >
        {registerForm.formState.isSubmitting ? <Loader2 className="animate-spin ml-2" /> : null}
        ثبت‌نام و دریافت کد
      </Button>

      <p className="text-center text-sm text-muted-foreground mt-4">
        قبلاً ثبت‌نام کرده‌اید؟{" "}
        <Link href="/login" className="text-primary font-medium hover:underline">
          وارد شوید
        </Link>
      </p>
    </form>
  );
};

export default RegisterStep1;
