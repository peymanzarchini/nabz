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
    "mt-1.5 h-11 bg-gray-50 border-gray-200 text-gray-900 focus:border-violet-500 focus:ring-violet-500 dark:bg-gray-50 rounded-sm";

  return (
    <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <Label htmlFor="firstName" className="text-gray-700">
            نام
          </Label>
          <Input id="firstName" {...registerForm.register("firstName")} className={inputClass} />
          {registerForm.formState.errors.firstName && (
            <p className="text-xs text-red-500 mt-1">
              {registerForm.formState.errors.firstName.message}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <Label htmlFor="lastName" className="text-gray-700">
            نام خانوادگی
          </Label>
          <Input id="lastName" {...registerForm.register("lastName")} className={inputClass} />
          {registerForm.formState.errors.lastName && (
            <p className="text-xs text-red-500 mt-1">
              {registerForm.formState.errors.lastName.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <Label htmlFor="email" className="text-gray-700">
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
            <p className="text-xs text-red-500 mt-1">
              {registerForm.formState.errors.email.message}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <Label htmlFor="phoneNumber" className="text-gray-700">
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
            <p className="text-xs text-red-500 mt-1">
              {registerForm.formState.errors.phoneNumber.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <Label htmlFor="role" className="text-gray-700">
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
          <Label htmlFor="password" className="text-gray-700">
            رمز عبور
          </Label>
          <PasswordInput
            id="password"
            dir="ltr"
            {...registerForm.register("password")}
            className={inputClass}
          />
          {registerForm.formState.errors.password && (
            <p className="text-xs text-red-500 mt-1">
              {registerForm.formState.errors.password.message}
            </p>
          )}
        </div>
      </div>

      {/* کپچا */}
      <div className="bg-gray-100 p-4 rounded-sm border border-gray-200 mt-2">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-sm font-bold text-gray-800">
            <ShieldCheck className="h-5 w-5 text-violet-600" />
            <span>من ربات نیستم</span>
          </div>
          <button
            type="button"
            onClick={generateCaptcha}
            className="text-gray-500 hover:text-violet-600 transition-colors cursor-pointer"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-white text-xl font-bold px-4 py-2 rounded-lg border border-gray-300 select-none tracking-widest text-gray-900">
            {num1} + {num2} = ?
          </div>
          <Input
            type="number"
            value={captchaInput}
            onChange={(e) => {
              setCaptchaInput(e.target.value);
            }}
            className="h-10 w-24 text-center text-lg font-bold bg-white border-gray-300 text-gray-900 dark:bg-gray-50"
            placeholder="پاسخ"
          />
        </div>
        {captchaError && <p className="text-xs text-red-500 mt-2">{captchaError}</p>}
      </div>

      <Button
        type="submit"
        size="lg"
        className="w-full max-w-50 flex justify-center! mx-auto h-12 text-base font-bold cursor-pointer bg-linear-to-r from-violet-600 to-teal-500 hover:from-violet-700 hover:to-teal-600 text-white shadow-lg rounded-sm mt-10"
        disabled={registerForm.formState.isSubmitting}
      >
        {registerForm.formState.isSubmitting ? <Loader2 className="animate-spin ml-2" /> : null}
        ثبت‌نام و دریافت کد
      </Button>

      <p className="text-center text-sm text-gray-600 mt-4">
        قبلاً ثبت‌نام کرده‌اید؟{" "}
        <Link href="/login" className="text-violet-600 font-bold hover:underline">
          وارد شوید
        </Link>
      </p>
    </form>
  );
};

export default RegisterStep1;
