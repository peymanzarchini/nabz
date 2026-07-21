import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { VerifyOtpFormProps } from "../types";

const VerifyOtpForm = ({
  otpForm,
  onVerifyOtpSubmit,
  userPhone,
  isTimerActive,
  timeLeft,
  formatTime,
  handleResendOtp,
  onBack,
}: VerifyOtpFormProps) => {
  return (
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
          className="mt-1.5 h-12 text-center text-2xl font-bold tracking-[1em] bg-gray-50 border-gray-200 text-gray-900 focus:border-violet-500 focus:ring-violet-500 dark:bg-gray-50 rounded-sm"
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
        className="w-full h-12 text-base font-bold bg-linear-to-r from-violet-600 to-teal-500 hover:from-violet-700 hover:to-teal-600 text-white shadow-lg cursor-pointer rounded-sm"
        disabled={otpForm.formState.isSubmitting || !isTimerActive}
      >
        {otpForm.formState.isSubmitting ? <Loader2 className="animate-spin ml-2" /> : null}
        تایید و ورود
      </Button>

      <button
        type="button"
        onClick={onBack}
        className="w-full text-center text-sm text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
      >
        تغییر شماره موبایل
      </button>
    </form>
  );
};

export default VerifyOtpForm;
