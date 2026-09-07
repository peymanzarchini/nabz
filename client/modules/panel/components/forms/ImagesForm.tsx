import { ImagePlus, X } from "lucide-react";
import Image from "next/image";

interface Props {
  imagePreviews: string[];
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeImage: (index: number) => void;
}

const ImagesForm = ({ imagePreviews, handleImageChange, removeImage }: Props) => {
  return (
    <section className="space-y-4">
      <h2 className="text-lg font-bold text-foreground border-b border-border pb-2">تصاویر</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {imagePreviews.map((preview, index) => (
          <div
            key={index}
            className="relative aspect-square rounded-sm overflow-hidden border border-border"
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
              className="absolute top-1 right-1 bg-destructive text-destructive-foreground p-1 rounded-sm"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
        <label className="aspect-square rounded-sm border-2 border-dashed border-border flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary transition-colors text-muted-foreground">
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
};

export default ImagesForm;
