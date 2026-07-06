"use client";

import { SpecValue, SpecsSchema } from "../types";

interface ListingSpecsProps {
  specs: Record<string, SpecValue>;
  specsSchema: SpecsSchema | null;
}

const ListingSpecs = ({ specs, specsSchema }: ListingSpecsProps) => {
  const specEntries = Object.entries(specs || {}).filter(([key]) => {
    return !specsSchema?.[key]?.isVariant;
  });

  if (specEntries.length === 0) return null;

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
      <h2 className="text-lg font-bold text-zinc-800 dark:text-zinc-100 mb-4">مشخصات کالا</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
        {specEntries.map(([key, value]) => {
          const label = specsSchema?.[key]?.label || key;
          return (
            <div
              key={key}
              className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-2"
            >
              <span className="text-sm text-zinc-500 dark:text-zinc-400">{label}</span>
              <span className="text-sm font-medium text-zinc-800 dark:text-zinc-100 text-left">
                {value !== null && value !== undefined ? String(value) : "-"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ListingSpecs;
