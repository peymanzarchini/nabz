import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-8 w-full min-w-0 rounded-sm border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none",
        "file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
        "placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50",
        "aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm",

        "[&:-webkit-autofill]:bg-gray-50",
        "[&:-webkit-autofill]:text-gray-900",
        "[&:-webkit-autofill]:shadow-[inset_0_0_0px_1000px_#f9fafb]",
        "[&:-webkit-autofill]:[-webkit-text-fill-color:#111827]",

        className,
      )}
      {...props}
    />
  );
}

export { Input };
