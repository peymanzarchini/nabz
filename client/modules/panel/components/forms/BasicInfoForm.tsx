import { UseFormRegister, FieldErrors } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { FormValues } from "../../types";

interface Props {
  register: UseFormRegister<FormValues>;
  errors: FieldErrors<FormValues>;
  isNegotiable: boolean;
  setValue: (name: "isNegotiable", value: boolean) => void;
}

const BasicInfoForm = ({ register, errors, isNegotiable, setValue }: Props) => {
  const inputClass =
    "mt-1.5 h-11 bg-muted/40 border-input text-foreground focus:border-primary focus:ring-primary/50 rounded-sm placeholder:text-muted-foreground/60";

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-bold text-foreground border-b border-border pb-2">
        اطلاعات اصلی
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label className="text-foreground">عنوان آگهی *</Label>
          <Input {...register("title", { required: "عنوان الزامی است" })} className={inputClass} />
          {errors.title && <p className="text-xs text-destructive mt-1">{errors.title.message}</p>}
        </div>
        <div>
          <Label className="text-foreground">وضعیت کالا *</Label>
          <div className="flex gap-4 mt-4">
            <label className="flex items-center gap-2 cursor-pointer text-muted-foreground">
              <input
                type="radio"
                value="new"
                {...register("condition")}
                className="accent-primary"
              />{" "}
              نو
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-muted-foreground">
              <input
                type="radio"
                value="used"
                {...register("condition")}
                className="accent-primary"
              />{" "}
              دست دوم
            </label>
          </div>
        </div>
      </div>
      <div>
        <Label className="text-foreground">توضیحات *</Label>
        <Textarea
          {...register("description", { required: "توضیحات الزامی است" })}
          className={inputClass}
          rows={3}
        />
        {errors.description && (
          <p className="text-xs text-destructive mt-1">{errors.description.message}</p>
        )}
      </div>
      <div className="flex items-center gap-3 pt-2">
        <Switch
          id="isNegotiable"
          checked={isNegotiable}
          onCheckedChange={(checked) => setValue("isNegotiable", checked)}
        />
        <Label htmlFor="isNegotiable" className="text-foreground cursor-pointer">
          قیمت توافقی است
        </Label>
      </div>
    </section>
  );
};

export default BasicInfoForm;
