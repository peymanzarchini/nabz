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
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary">
          <MailCheck className="h-8 w-8" />
        </div>

        {isTimerActive ? (
          <div className="text-center">
            <p className="text-sm text-muted-foreground">زمان باقی‌مانده تا انقضای کد:</p>
            <p className="text-2xl font-black text-foreground mt-1 tracking-wider" dir="ltr">
              {formatTime(timeLeft)}
            </p>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-sm text-destructive font-medium">کد تایید منقضی شده است!</p>
            <button
              type="button"
              onClick={handleResendCode}
              className="text-sm text-primary font-bold hover:underline mt-2 cursor-pointer"
            >
              ارسال مجدد کد
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="code" className="text-center block text-foreground">
          کد ۶ رقمی تایید
        </Label>
        <Input
          id="code"
          type="text"
          dir="ltr"
          maxLength={6}
          placeholder="- - - - - -"
          className="mt-1.5 h-12 text-center text-2xl font-bold tracking-[1em] bg-muted/40 border-input text-foreground focus:border-primary focus:ring-primary/50 rounded-lg"
          {...verifyForm.register("code")}
        />
        {verifyForm.formState.errors.code && (
          <p className="text-xs text-destructive mt-1 text-center">
            {verifyForm.formState.errors.code.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        size="lg"
        className="w-full h-12 text-base font-bold cursor-pointer rounded-lg"
        disabled={verifyForm.formState.isSubmitting || !isTimerActive}
      >
        {verifyForm.formState.isSubmitting ? <Loader2 className="animate-spin ml-2" /> : null}
        تایید و فعال‌سازی
      </Button>

      <button
        type="button"
        onClick={onBack}
        className="w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors mt-2 cursor-pointer"
      >
        بازگشت به مرحله قبل
      </button>
    </form>
  );
};

export default RegisterStep2;
