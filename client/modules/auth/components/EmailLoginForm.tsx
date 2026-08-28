import Link from "next/link";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { EmailLoginFormProps } from "../types";

const EmailLoginForm = ({ emailForm, onEmailSubmit }: EmailLoginFormProps) => {
  const inputClass =
    "mt-1.5 h-11 bg-muted/40 border-input text-foreground focus:border-primary focus:ring-primary/50 rounded-lg placeholder:text-muted-foreground/60";

  return (
    <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-4">
      <div className="flex flex-col gap-1">
        <Label htmlFor="identifier" className="text-foreground">
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
          <p className="text-xs text-destructive mt-1">
            {emailForm.formState.errors.identifier.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <Label htmlFor="password" className="text-foreground">
            رمز عبور
          </Label>
          <Link
            href="/forgot-password"
            className="text-xs text-primary hover:underline font-medium"
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
          <p className="text-xs text-destructive mt-1">
            {emailForm.formState.errors.password.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        size="lg"
        className="w-full h-12 text-base font-bold cursor-pointer rounded-lg"
        disabled={emailForm.formState.isSubmitting}
      >
        {emailForm.formState.isSubmitting ? <Loader2 className="animate-spin ml-2" /> : null}
        ورود به حساب
      </Button>
    </form>
  );
};

export default EmailLoginForm;
