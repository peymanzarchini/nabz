"use client";

import { useState } from "react";
import { ChevronDown, Check, HelpCircle } from "lucide-react";
import { iconMap } from "@/utils/icon-map";

interface IconPickerProps {
  value: string | null | undefined;
  onChange: (value: string) => void;
}

export default function IconPicker({ value, onChange }: IconPickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const SelectedIcon =
    value && value in iconMap ? iconMap[value as keyof typeof iconMap] : HelpCircle;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="mt-1.5 h-11 w-full rounded-md border border-gray-200 bg-gray-50 px-3 text-gray-900 flex items-center justify-between cursor-pointer focus:border-violet-500 focus:ring-violet-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
      >
        <div className="flex items-center gap-2">
          <SelectedIcon className="h-5 w-5 text-violet-600 dark:text-violet-400" />
          <span className="text-sm">{value || "انتخاب آیکون..."}</span>
        </div>

        <ChevronDown
          className={`h-4 w-4 text-zinc-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />

          <div className="absolute z-20 mt-1 grid max-h-60 w-full grid-cols-5 gap-1 overflow-y-auto rounded-lg border border-zinc-200 bg-white p-2 shadow-lg dark:border-zinc-700 dark:bg-zinc-800">
            {Object.entries(iconMap).map(([name, Icon]) => (
              <button
                key={name}
                type="button"
                title={name}
                onClick={() => {
                  onChange(name);
                  setIsOpen(false);
                }}
                className={`relative flex items-center justify-center rounded-md p-2 transition-colors ${
                  value === name
                    ? "bg-violet-100 dark:bg-violet-500/20"
                    : "hover:bg-zinc-100 dark:hover:bg-zinc-700"
                }`}
              >
                <Icon
                  className={`h-5 w-5 ${
                    value === name
                      ? "text-violet-600 dark:text-violet-400"
                      : "text-zinc-600 dark:text-zinc-300"
                  }`}
                />

                {value === name && (
                  <Check className="absolute top-1 right-1 h-3 w-3 text-violet-600" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
