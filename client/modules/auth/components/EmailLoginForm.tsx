import Link from "next/link";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { EmailLoginFormProps } from "../types";

const EmailLoginForm = ({ emailForm, onEmailSubmit }: EmailLoginFormProps) => {
  const inputClass =
    "mt-1.5 h-11 bg-gray-50 border-gray-200 text-gray-900 focus:border-violet-500 focus:ring-violet-500 dark:bg-gray-50";

  return (
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
          <p className="text-xs text-red-500 mt-1">{emailForm.formState.errors.password.message}</p>
        )}
      </div>

      <Button
        type="submit"
        size="lg"
        className="w-full h-12 text-base font-bold cursor-pointer bg-linear-to-r from-violet-600 to-teal-500 hover:from-violet-700 hover:to-teal-600 text-white shadow-lg rounded-sm"
        disabled={emailForm.formState.isSubmitting}
      >
        {emailForm.formState.isSubmitting ? <Loader2 className="animate-spin ml-2" /> : null}
        ورود به حساب
      </Button>
    </form>
  );
};

export default EmailLoginForm;
