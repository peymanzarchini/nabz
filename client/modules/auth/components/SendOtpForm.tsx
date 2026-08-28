import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SendOtpFormProps } from "../types";

const SendOtpForm = ({ phoneForm, onSendOtpSubmit }: SendOtpFormProps) => {
  const inputClass =
    "mt-1.5 h-11 bg-muted/40 border-input text-foreground focus:border-primary focus:ring-primary/50 rounded-lg placeholder:text-muted-foreground/60";

  return (
    <form onSubmit={phoneForm.handleSubmit(onSendOtpSubmit)} className="space-y-4">
      <div className="flex flex-col gap-1">
        <Label htmlFor="phoneNumber" className="text-foreground">
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
          <p className="text-xs text-destructive mt-1">
            {phoneForm.formState.errors.phoneNumber.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        size="lg"
        className="w-full h-12 text-base font-bold cursor-pointer rounded-lg"
        disabled={phoneForm.formState.isSubmitting}
      >
        {phoneForm.formState.isSubmitting ? <Loader2 className="animate-spin ml-2" /> : null}
        دریافت کد تایید
      </Button>
    </form>
  );
};

export default SendOtpForm;
