/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ListingVariant, SpecsSchema } from "../types";

interface ListingVariantsProps {
  variants: ListingVariant[];
  specsSchema: SpecsSchema | null;
  onVariantChange: (variant: ListingVariant) => void;
}

const ListingVariants = ({ variants, specsSchema, onVariantChange }: ListingVariantsProps) => {
  const variantKeys = specsSchema
    ? Object.entries(specsSchema)
        .filter(([_, schema]) => schema.isVariant)
        .map(([key]) => key)
    : [];

  const [selectedSpecs, setSelectedSpecs] = useState<Record<string, string>>({});

  useEffect(() => {
    if (variants.length > 0) {
      setSelectedSpecs(variants[0].specs);
      onVariantChange(variants[0]);
    }
  }, [variants]);

  const handleSelect = (key: string, value: string) => {
    let newSpecs = { ...selectedSpecs, [key]: value };

    let matchedVariant = variants.find((v) =>
      Object.entries(newSpecs).every(([k, val]) => v.specs[k] === val),
    );

    if (!matchedVariant) {
      matchedVariant = variants.find((v) => v.specs[key] === value);
      if (matchedVariant) {
        newSpecs = matchedVariant.specs;
      }
    }

    if (matchedVariant) {
      setSelectedSpecs(newSpecs);
      onVariantChange(matchedVariant);
    }
  };

  if (variantKeys.length === 0 || variants.length <= 1) return null;

  return (
    <div className="space-y-4">
      {variantKeys.map((key) => {
        const schema = specsSchema?.[key];
        if (!schema) return null;

        const availableOptions = Array.from(
          new Set(variants.map((v) => v.specs[key]).filter(Boolean)),
        );

        return (
          <div key={key}>
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-200 mb-2 block">
              {schema.label}: <span className="text-primary font-bold">{selectedSpecs[key]}</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {availableOptions.map((option) => (
                <Button
                  key={option}
                  variant={selectedSpecs[key] === option ? "default" : "outline"}
                  size="sm"
                  className="h-10 px-4"
                  onClick={() => handleSelect(key, option)}
                >
                  {option}
                </Button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ListingVariants;
