/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import {
  RegisterFormData,
  registerSchema,
  VerifyFormData,
  verifySchema,
} from "@/modules/auth/validations";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/utils/getApiErrorMessage";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Loader2, MailCheck, RefreshCw, ShieldCheck } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Link from "next/link";

const RegisterPage = () => {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [formData, setFormData] = useState<RegisterFormData | null>(null);

  const [num1, setNum1] = useState<number>(0);
  const [num2, setNum2] = useState<number>(0);
  const [captchaInput, setCaptchaInput] = useState<string>("");
  const [captchaError, setCaptchaError] = useState<string>("");

  const [timeLeft, setTimeLeft] = useState<number>(120);
  const [isTimerActive, setIsTimerActive] = useState<boolean>(false);

  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const verifyForm = useForm<VerifyFormData>({
    resolver: zodResolver(verifySchema),
  });

  const generateCaptcha = useCallback(() => {
    const rand1 = Math.floor(Math.random() * 10) + 1;
    const rand2 = Math.floor(Math.random() * 10) + 1;
    setNum1(rand1);
    setNum2(rand2);
    setCaptchaInput("");
    setCaptchaError("");
  }, []);

  useEffect(() => {
    generateCaptcha();
  }, [generateCaptcha]);

  useEffect(() => {
    if (step === 2 && isTimerActive && timeLeft > 0) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    } else if (timeLeft === 0) {
      setIsTimerActive(false);
    }
  }, [step, isTimerActive, timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const onRegisterSubmit = async (data: RegisterFormData) => {
    if (parseInt(captchaInput) !== num1 + num2) {
      setCaptchaError("پاسخ کپچا اشتباه است!");
      generateCaptcha();
      return;
    }

    try {
      await api.post("/auth/register", data);
      setFormData(data);
      setStep(2);
      setTimeLeft(120);
      setIsTimerActive(true);
      toast.success("کد تایید با موفقیت به ایمیل شما ارسال شد.");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
      generateCaptcha();
    }
  };

  const onVerifySubmit = async (data: VerifyFormData) => {
    if (!formData) return;

    try {
      await api.post("/auth/verify", {
        email: formData.email,
        code: data.code,
      });
      toast.success("حساب کاربری با موفقیت فعال شد. لطفاً وارد شوید.");
      router.push("/login");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  const handleResendCode = async () => {
    if (!formData) return;
    try {
      await api.post("/auth/resend", { email: formData.email });
      setTimeLeft(120);
      setIsTimerActive(true);
      toast.success("کد تایید جدید ارسال شد.");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  const inputClass =
    "mt-1.5 h-11 bg-gray-50 border-gray-200 text-gray-900 focus:border-violet-500 focus:ring-violet-500 dark:bg-gray-50";

  return (
    <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-2xl shadow-black/10">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-black text-gray-900">
          {step === 1 ? "ثبت‌نام در نبض" : "تایید حساب کاربری"}
        </h1>
        <p className="text-sm text-gray-500 mt-2">
          {step === 1
            ? "یک حساب کاربری جدید بسازید"
            : `کد ارسال شده به ${formData?.email} را وارد کنید`}
        </p>
      </div>

      {step === 1 && (
        <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <Label htmlFor="firstName" className="text-gray-700">
                نام
              </Label>
              <Input
                id="firstName"
                {...registerForm.register("firstName")}
                className={inputClass}
              />
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

          <div className="flex flex-col gap-1">
            <Label htmlFor="password" className="text-gray-700">
              رمز عبور
            </Label>
            <Input
              id="password"
              type="password"
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
                className="text-gray-500 hover:text-violet-600 transition-colors"
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
                  setCaptchaError("");
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
            className="w-full h-12 text-base font-bold cursor-pointer bg-linear-to-r from-violet-600 to-teal-500 hover:from-violet-700 hover:to-teal-600 text-white shadow-lg"
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
      )}

      {step === 2 && (
        <form onSubmit={verifyForm.handleSubmit(onVerifySubmit)} className="space-y-6">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-violet-50 rounded-full flex items-center justify-center text-violet-600">
              <MailCheck className="h-8 w-8" />
            </div>

            {isTimerActive ? (
              <div className="text-center">
                <p className="text-sm text-gray-500">زمان باقی‌مانده تا انقضای کد:</p>
                <p className="text-2xl font-black text-gray-900 mt-1 tracking-wider" dir="ltr">
                  {formatTime(timeLeft)}
                </p>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-sm text-red-500 font-medium">کد تایید منقضی شده است!</p>
                <button
                  type="button"
                  onClick={handleResendCode}
                  className="text-sm text-violet-600 font-bold hover:underline mt-2 cursor-pointer"
                >
                  ارسال مجدد کد
                </button>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <Label htmlFor="code" className="text-center block text-gray-700">
              کد ۶ رقمی تایید
            </Label>
            <Input
              id="code"
              type="text"
              dir="ltr"
              maxLength={6}
              placeholder="- - - - - -"
              className="mt-1.5 h-12 text-center text-2xl font-bold tracking-[1em] bg-gray-50 border-gray-200 text-gray-900 focus:border-violet-500 focus:ring-violet-500 dark:bg-gray-50"
              {...verifyForm.register("code")}
            />
            {verifyForm.formState.errors.code && (
              <p className="text-xs text-red-500 mt-1 text-center">
                {verifyForm.formState.errors.code.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full h-12 text-base font-bold bg-linear-to-r from-violet-600 to-teal-500 hover:from-violet-700 hover:to-teal-600 text-white shadow-lg cursor-pointer"
            disabled={verifyForm.formState.isSubmitting || !isTimerActive}
          >
            {verifyForm.formState.isSubmitting ? <Loader2 className="animate-spin ml-2" /> : null}
            تایید و فعال‌سازی
          </Button>

          <button
            type="button"
            onClick={() => setStep(1)}
            className="w-full text-center text-sm text-gray-500 hover:text-gray-900 transition-colors mt-2 cursor-pointer"
          >
            بازگشت به مرحله قبل
          </button>
        </form>
      )}
    </div>
  );
};

export default RegisterPage;
