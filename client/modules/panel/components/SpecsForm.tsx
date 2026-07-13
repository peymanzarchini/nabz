import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { SpecsSchema, SpecFieldSchema } from "@/modules/home/types";

interface Props {
  generalSpecsSchema: SpecsSchema;
  specs: Record<string, string | number | boolean | null>;
  handleSpecChange: (key: string, value: string | number | boolean | null) => void;
}

export default function SpecsForm({ generalSpecsSchema, specs, handleSpecChange }: Props) {
  const inputClass =
    "mt-1.5 h-11 bg-gray-50 border-gray-200 text-gray-900 focus:border-violet-500 focus:ring-violet-500 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white dark:placeholder:text-zinc-400 rounded-md";
  const selectClass = inputClass + " w-full px-3 appearance-none cursor-pointer";

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-bold text-zinc-700 dark:text-zinc-200 border-b border-zinc-100 dark:border-zinc-800 pb-2">
        مشخصات کالا
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(generalSpecsSchema).map(([key, schema]: [string, SpecFieldSchema]) => (
          <div key={key}>
            <Label className="text-zinc-700 dark:text-zinc-200">
              {schema.label} {schema.required && "*"}
            </Label>
            {schema.type === "dropdown" ? (
              <select
                className={selectClass}
                value={(specs[key] as string) || ""}
                onChange={(e) => handleSpecChange(key, e.target.value)}
              >
                <option value="">انتخاب کنید...</option>
                {schema.options?.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            ) : schema.type === "boolean" ? (
              <div className="mt-3">
                <Switch
                  checked={(specs[key] as boolean) || false}
                  onCheckedChange={(checked) => handleSpecChange(key, checked)}
                />
              </div>
            ) : (
              <Input
                type={schema.type === "number" ? "number" : "text"}
                className={inputClass}
                value={(specs[key] as string | number) || ""}
                onChange={(e) =>
                  handleSpecChange(
                    key,
                    schema.type === "number" ? Number(e.target.value) : e.target.value,
                  )
                }
              />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
