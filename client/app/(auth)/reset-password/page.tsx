"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, ShieldCheck } from "lucide-react";

import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ResetPasswordData, resetPasswordSchema } from "@/modules/auth/validations";
import { getApiErrorMessage } from "@/utils/getApiErrorMessage";
import { PasswordInput } from "@/components/ui/password-input";

const ResetPasswordPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token: token || "",
    },
  });

  const onSubmit = async (data: ResetPasswordData) => {
    try {
      await api.post("/auth/reset-password", data);
      setIsSuccess(true);
      toast.success("رمز عبور با موفقیت تغییر کرد.");

      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  const inputClass =
    "mt-1.5 h-11 bg-gray-50 border-gray-200 text-gray-900 focus:border-violet-500 focus:ring-violet-500 dark:bg-gray-50";

  if (!token) {
    return (
      <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-2xl shadow-black/10 text-center">
        <h1 className="text-2xl font-black text-red-600 mb-3">لینک نامعتبر است</h1>
        <p className="text-sm text-gray-500 mb-8">
          لینک بازیابی رمز عبور وجود ندارد یا خراب است. لطفاً دوباره درخواست دهید.
        </p>
        <Link href="/forgot-password">
          <Button className="w-full h-12 cursor-pointer">درخواست لینک جدید</Button>
        </Link>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-2xl shadow-black/10 text-center">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600">
            <ShieldCheck className="h-8 w-8" />
          </div>
        </div>
        <h1 className="text-2xl font-black text-gray-900 mb-3">رمز عبور تغییر کرد!</h1>
        <p className="text-sm text-gray-500 leading-7 mb-8">
          رمز عبور شما با موفقیت بازیابی شد. در حال انتقال به صفحه ورود...
        </p>
        <Loader2 className="animate-spin text-violet-600 mx-auto" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-2xl shadow-black/10">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-black text-gray-900">رمز عبور جدید</h1>
        <p className="text-sm text-gray-500 mt-2">رمز عبور جدید خود را وارد کنید</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input type="hidden" {...register("token")} />

        <div className="flex flex-col gap-1">
          <Label htmlFor="newPassword" className="text-gray-700">
            رمز عبور جدید
          </Label>
          <PasswordInput
            id="newPassword"
            dir="ltr"
            placeholder="••••••••"
            {...register("newPassword")}
            className={inputClass}
          />
          {errors.newPassword && (
            <p className="text-xs text-red-500 mt-1">{errors.newPassword.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <Label htmlFor="confirmPassword" className="text-gray-700">
            تکرار رمز عبور جدید
          </Label>
          <PasswordInput
            id="confirmPassword"
            dir="ltr"
            placeholder="••••••••"
            {...register("confirmPassword")}
            className={inputClass}
          />
          {errors.confirmPassword && (
            <p className="text-xs text-red-500 mt-1">{errors.confirmPassword.message}</p>
          )}
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full h-12 text-base font-bold cursor-pointer bg-linear-to-r from-violet-600 to-teal-500 hover:from-violet-700 hover:to-teal-600 text-white shadow-lg"
          disabled={isSubmitting}
        >
          {isSubmitting ? <Loader2 className="animate-spin ml-2" /> : null}
          بازیابی رمز عبور
        </Button>
      </form>
    </div>
  );
};

export default ResetPasswordPage;
