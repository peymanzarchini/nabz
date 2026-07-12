import { ImagePlus, X } from "lucide-react";
import Image from "next/image";

interface Props {
  imagePreviews: string[];
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeImage: (index: number) => void;
}

export default function ImagesForm({ imagePreviews, handleImageChange, removeImage }: Props) {
  return (
    <section className="space-y-4">
      <h2 className="text-lg font-bold text-zinc-700 dark:text-zinc-200 border-b border-zinc-100 dark:border-zinc-800 pb-2">
        تصاویر
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {imagePreviews.map((preview, index) => (
          <div
            key={index}
            className="relative aspect-square rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-700"
          >
            <Image
              src={preview}
              alt="preview"
              className="w-full h-full object-cover"
              width={500}
              height={500}
            />
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
        <label className="aspect-square rounded-xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-violet-500 transition-colors text-zinc-500 dark:text-zinc-400">
          <ImagePlus className="h-8 w-8" />
          <span className="text-xs">افزودن عکس</span>
          <input
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </label>
      </div>
    </section>
  );
}
