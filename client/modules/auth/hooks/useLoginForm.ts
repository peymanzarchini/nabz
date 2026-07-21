/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { AxiosError } from "axios";
import api from "@/lib/api";
import { useAuth } from "@/lib/providers/AuthProvider";
import { ApiErrorResponse } from "@/types";
import {
  LoginEmailData,
  loginEmailSchema,
  SendOtpData,
  sendOtpSchema,
  VerifyOtpData,
  verifyOtpSchema,
} from "@/modules/auth/validations";

export const useLoginForm = () => {
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

  return {
    loginMethod,
    switchMethod,
    otpStep,
    setOtpStep,
    emailForm,
    onEmailSubmit,
    phoneForm,
    onSendOtpSubmit,
    otpForm,
    onVerifyOtpSubmit,
    userPhone,
    isTimerActive,
    timeLeft,
    formatTime,
    handleResendOtp,
  };
};
