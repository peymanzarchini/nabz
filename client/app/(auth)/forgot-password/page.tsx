"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Mail, ArrowRight } from "lucide-react";

import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ForgotPasswordData, forgotPasswordSchema } from "@/modules/auth/validations";
import { getApiErrorMessage } from "@/utils/getApiErrorMessage";

const ForgotPasswordPage = () => {
  const [isEmailSent, setIsEmailSent] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordData) => {
    try {
      await api.post("/auth/forgot-password", data);
      setIsEmailSent(true);
      toast.success("لینک بازیابی رمز عبور ارسال شد.");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  const inputClass =
    "mt-1.5 h-11 bg-gray-50 border-gray-200 text-gray-900 focus:border-violet-500 focus:ring-violet-500 dark:bg-gray-50";

  if (isEmailSent) {
    return (
      <div className="w-full max-w-md bg-white rounded-sm p-8 shadow-2xl shadow-black/10 text-center">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600">
            <Mail className="h-8 w-8" />
          </div>
        </div>
        <h1 className="text-2xl font-black text-gray-900 mb-3">ایمیل را بررسی کنید</h1>
        <p className="text-sm text-gray-500 leading-7 mb-8">
          لینک بازیابی رمز عبور به آدرس ایمیل شما ارسال شد. لطفاً صندوق ورودی (و پوشه اسپم) خود را
          بررسی کنید.
        </p>
        <Link href="/login">
          <Button variant="outline" className="w-full h-12 cursor-pointer gap-2">
            <ArrowRight className="h-4 w-4" />
            بازگشت به ورود
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-2xl shadow-black/10">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-black text-gray-900">فراموشی رمز عبور</h1>
        <p className="text-sm text-gray-500 mt-2">
          ایمیل خود را وارد کنید تا لینک بازیابی برای شما ارسال شود
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex flex-col gap-1">
          <Label htmlFor="email" className="text-gray-700">
            ایمیل
          </Label>
          <Input
            id="email"
            type="email"
            dir="ltr"
            placeholder="example@mail.com"
            {...register("email")}
            className={inputClass}
          />
          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full h-12 text-base font-bold cursor-pointer bg-linear-to-r from-violet-600 to-teal-500 hover:from-violet-700 hover:to-teal-600 text-white shadow-lg"
          disabled={isSubmitting}
        >
          {isSubmitting ? <Loader2 className="animate-spin ml-2" /> : null}
          ارسال لینک بازیابی
        </Button>
      </form>

      <p className="text-center text-sm text-gray-600 mt-6">
        رمز عبور را به یاد آوردید؟{" "}
        <Link href="/login" className="text-violet-600 font-bold hover:underline">
          ورود
        </Link>
      </p>
    </div>
  );
};

export default ForgotPasswordPage;
