"use client";

import { Loader2, MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RegisterStep2Props } from "../types";

const RegisterStep2 = ({
  verifyForm,
  onVerifySubmit,
  isTimerActive,
  timeLeft,
  formatTime,
  handleResendCode,
  onBack,
}: RegisterStep2Props) => {
  return (
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
          className="mt-1.5 h-12 text-center text-2xl font-bold tracking-[1em] bg-gray-50 border-gray-200 text-gray-900 focus:border-violet-500 focus:ring-violet-500 dark:bg-gray-50 rounded-sm"
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
        className="w-full max-w-50 flex justify-center! mx-auto h-12 text-base font-bold bg-linear-to-r from-violet-600 to-teal-500 hover:from-violet-700 hover:to-teal-600 text-white shadow-lg cursor-pointer rounded-sm"
        disabled={verifyForm.formState.isSubmitting || !isTimerActive}
      >
        {verifyForm.formState.isSubmitting ? <Loader2 className="animate-spin ml-2" /> : null}
        تایید و فعال‌سازی
      </Button>

      <button
        type="button"
        onClick={onBack}
        className="w-full text-center text-sm text-gray-500 hover:text-gray-900 transition-colors mt-2 cursor-pointer"
      >
        بازگشت به مرحله قبل
      </button>
    </form>
  );
};

export default RegisterStep2;
