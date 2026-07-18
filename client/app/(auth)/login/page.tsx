/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { Loader2, Mail, Smartphone } from "lucide-react";

import api from "@/lib/api";
import { ApiErrorResponse } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  LoginEmailData,
  loginEmailSchema,
  SendOtpData,
  sendOtpSchema,
  VerifyOtpData,
  verifyOtpSchema,
} from "@/modules/auth/validations";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/providers/AuthProvider";
import { PasswordInput } from "@/components/ui/password-input";

const LoginPage = () => {
  const [loginMethod, setLoginMethod] = useState<"email" | "phone">("email");
  const [otpStep, setOtpStep] = useState<1 | 2>(1);
  const [userPhone, setUserPhone] = useState("");

  const [timeLeft, setTimeLeft] = useState(120);
  const [isTimerActive, setIsTimerActive] = useState(false);

  const emailForm = useForm<LoginEmailData>({ resolver: zodResolver(loginEmailSchema) });
  const phoneForm = useForm<SendOtpData>({ resolver: zodResolver(sendOtpSchema) });
  const otpForm = useForm<VerifyOtpData>({ resolver: zodResolver(verifyOtpSchema) });

  const { updateUser } = useAuth();

  const router = useRouter();

  useEffect(() => {
    if (loginMethod === "phone" && otpStep === 2 && isTimerActive && timeLeft > 0) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    } else if (timeLeft === 0) {
      setIsTimerActive(false);
    }
  }, [loginMethod, otpStep, isTimerActive, timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const onEmailSubmit = async (data: LoginEmailData) => {
    try {
      const res = await api.post("/auth/login", data);
      if (res.data.success && res.data.body) {
        updateUser(res.data.body);
        toast.success("ورود با موفقیت انجام شد!");
        router.replace("/");
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      toast.error(axiosError.response?.data.message || "ایمیل یا رمز عبور اشتباه است");
    }
  };

  const onSendOtpSubmit = async (data: SendOtpData) => {
    try {
      await api.post("/auth/send-phone-otp", data);
      setUserPhone(data.phoneNumber);
      setOtpStep(2);
      setTimeLeft(120);
      setIsTimerActive(true);
      toast.success("کد تایید با موفقیت به شماره موبایل ارسال شد.");
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      toast.error(axiosError.response?.data.message || "خطا در ارسال کد");
    }
  };

  const onVerifyOtpSubmit = async (data: VerifyOtpData) => {
    try {
      const res = await api.post("/auth/login-with-otp", {
        phoneNumber: userPhone,
        code: data.code,
      });
      if (res.data.success && res.data.body) {
        updateUser(res.data.body);
        toast.success("ورود با موفقیت انجام شد!");
        router.replace("/");
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      toast.error(axiosError.response?.data.message || "کد تایید اشتباه یا منقضی شده است");
    }
  };

  const handleResendOtp = async () => {
    try {
      await api.post("/auth/send-phone-otp", { phoneNumber: userPhone });
      setTimeLeft(120);
      setIsTimerActive(true);
      toast.success("کد تایید جدید ارسال شد.");
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      toast.error(axiosError.response?.data.message || "خطا در ارسال مجدد کد");
    }
  };

  const switchMethod = (method: "email" | "phone") => {
    setLoginMethod(method);
    setOtpStep(1);
    emailForm.reset();
    phoneForm.reset();
    otpForm.reset();
  };

  const inputClass =
    "mt-1.5 h-11 bg-gray-50 border-gray-200 text-gray-900 focus:border-violet-500 focus:ring-violet-500 dark:bg-gray-50";

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-2xl p-8 shadow-2xl shadow-black/10">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-black text-gray-900">ورود به نبض</h1>
        <p className="text-sm text-gray-500 mt-2">به حساب کاربری خود وارد شوید</p>
      </div>

      <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
        <button
          type="button"
          onClick={() => switchMethod("email")}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-sm cursor-pointer text-sm font-medium transition-all ${
            loginMethod === "email"
              ? "bg-white text-violet-600 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <Mail className="h-4 w-4" />
          ایمیل و رمز
        </button>
        <button
          type="button"
          onClick={() => switchMethod("phone")}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-sm text-sm cursor-pointer font-medium transition-all ${
            loginMethod === "phone"
              ? "bg-white text-violet-600 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <Smartphone className="h-4 w-4" />
          موبایل (OTP)
        </button>
      </div>

      {loginMethod === "email" && (
        <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-4">
          <div className="flex flex-col gap-1">
            <Label htmlFor="identifier" className="text-gray-700">
              ایمیل
            </Label>
            <Input
              id="identifier"
              type="email"
              dir="ltr"
              {...emailForm.register("identifier")}
              className={inputClass}
              placeholder="example@mail.com"
            />
            {emailForm.formState.errors.identifier && (
              <p className="text-xs text-red-500 mt-1">
                {emailForm.formState.errors.identifier.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-gray-700">
                رمز عبور
              </Label>
              <Link
                href="/forgot-password"
                className="text-xs text-violet-600 hover:underline font-medium"
              >
                فراموشی رمز؟
              </Link>
            </div>
            <PasswordInput
              id="password"
              dir="ltr"
              {...emailForm.register("password")}
              className={inputClass}
            />
            {emailForm.formState.errors.password && (
              <p className="text-xs text-red-500 mt-1">
                {emailForm.formState.errors.password.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full h-12 text-base font-bold cursor-pointer bg-linear-to-r from-violet-600 to-teal-500 hover:from-violet-700 hover:to-teal-600 text-white shadow-lg"
            disabled={emailForm.formState.isSubmitting}
          >
            {emailForm.formState.isSubmitting ? <Loader2 className="animate-spin ml-2" /> : null}
            ورود به حساب
          </Button>
        </form>
      )}

      {loginMethod === "phone" && otpStep === 1 && (
        <form onSubmit={phoneForm.handleSubmit(onSendOtpSubmit)} className="space-y-4">
          <div className="flex flex-col gap-1">
            <Label htmlFor="phoneNumber" className="text-gray-700">
              شماره موبایل
            </Label>
            <Input
              id="phoneNumber"
              type="tel"
              dir="ltr"
              placeholder="09123456789"
              {...phoneForm.register("phoneNumber")}
              className={inputClass}
            />
            {phoneForm.formState.errors.phoneNumber && (
              <p className="text-xs text-red-500 mt-1">
                {phoneForm.formState.errors.phoneNumber.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full h-12 text-base font-bold cursor-pointer bg-linear-to-r from-violet-600 to-teal-500 hover:from-violet-700 hover:to-teal-600 text-white shadow-lg"
            disabled={phoneForm.formState.isSubmitting}
          >
            {phoneForm.formState.isSubmitting ? <Loader2 className="animate-spin ml-2" /> : null}
            دریافت کد تایید
          </Button>
        </form>
      )}

      {loginMethod === "phone" && otpStep === 2 && (
        <form onSubmit={otpForm.handleSubmit(onVerifyOtpSubmit)} className="space-y-6">
          <div className="text-center space-y-3">
            <p className="text-sm text-gray-500">
              کد ارسال شده به{" "}
              <span className="font-bold text-gray-900 ltr-dir" dir="ltr">
                {userPhone}
              </span>{" "}
              را وارد کنید
            </p>

            {isTimerActive ? (
              <p className="text-lg font-black text-gray-900 tracking-wider" dir="ltr">
                {formatTime(timeLeft)}
              </p>
            ) : (
              <button
                type="button"
                onClick={handleResendOtp}
                className="text-sm text-violet-600 font-bold hover:underline cursor-pointer"
              >
                ارسال مجدد کد
              </button>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <Label htmlFor="code" className="text-center block text-gray-700">
              کد ۶ رقمی
            </Label>
            <Input
              id="code"
              type="text"
              dir="ltr"
              maxLength={6}
              placeholder="- - - - - -"
              className="mt-1.5 h-12 text-center text-2xl font-bold tracking-[1em] bg-gray-50 border-gray-200 text-gray-900 focus:border-violet-500 focus:ring-violet-500 dark:bg-gray-50"
              {...otpForm.register("code")}
            />
            {otpForm.formState.errors.code && (
              <p className="text-xs text-red-500 mt-1 text-center">
                {otpForm.formState.errors.code.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full h-12 text-base font-bold bg-linear-to-r from-violet-600 to-teal-500 hover:from-violet-700 hover:to-teal-600 text-white shadow-lg cursor-pointer"
            disabled={otpForm.formState.isSubmitting || !isTimerActive}
          >
            {otpForm.formState.isSubmitting ? <Loader2 className="animate-spin ml-2" /> : null}
            تایید و ورود
          </Button>

          <button
            type="button"
            onClick={() => setOtpStep(1)}
            className="w-full text-center text-sm text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
          >
            تغییر شماره موبایل
          </button>
        </form>
      )}

      <p className="text-center text-sm text-gray-600 mt-6">
        حساب کاربری ندارید؟{" "}
        <Link href="/register" className="text-violet-600 font-bold hover:underline">
          ثبت‌نام کنید
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;
