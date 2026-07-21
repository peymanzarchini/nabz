/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import api from "@/lib/api";
import { getApiErrorMessage } from "@/utils/getApiErrorMessage";
import {
  RegisterFormData,
  registerSchema,
  VerifyFormData,
  verifySchema,
} from "@/modules/auth/validations";

export const useRegisterForm = () => {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [formData, setFormData] = useState<RegisterFormData | null>(null);

  const [num1, setNum1] = useState<number>(0);
  const [num2, setNum2] = useState<number>(0);
  const [captchaInput, setCaptchaInput] = useState<string>("");
  const [captchaError, setCaptchaError] = useState<string>("");

  const [timeLeft, setTimeLeft] = useState<number>(120);
  const [isTimerActive, setIsTimerActive] = useState<boolean>(false);

  const registerForm = useForm<RegisterFormData>({ resolver: zodResolver(registerSchema) });
  const verifyForm = useForm<VerifyFormData>({ resolver: zodResolver(verifySchema) });

  const generateCaptcha = useCallback(() => {
    setNum1(Math.floor(Math.random() * 10) + 1);
    setNum2(Math.floor(Math.random() * 10) + 1);
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
      await api.post("/auth/verify", { email: formData.email, code: data.code });
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

  return {
    step,
    setStep,
    formData,
    registerForm,
    onRegisterSubmit,
    verifyForm,
    onVerifySubmit,
    num1,
    num2,
    captchaInput,
    setCaptchaInput,
    captchaError,
    generateCaptcha,
    isTimerActive,
    timeLeft,
    formatTime,
    handleResendCode,
  };
};
