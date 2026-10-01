"use client";

import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface RejectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  isLoading: boolean;
  title?: string;
  buttonTitle?: string;
}

const RejectModal = ({ isLoading, isOpen, onClose, onConfirm }: RejectModalProps) => {
  const [reason, setReason] = useState<string>("");

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (reason.trim().length < 5) return;
    onConfirm(reason);
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card rounded-sm shadow-2xl w-full max-w-md p-6 animate-slide-up border border-border">
        <button
          onClick={onClose}
          className="absolute top-4 left-4 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
        <h2 className="text-xl font-bold text-foreground mb-4">رد آگهی</h2>
        <p className="text-sm text-muted-foreground mb-4">
          لطفاً دلیل رد شدن این آگهی را بنویسید تا به فروشنده اطلاع داده شود.
        </p>
        <Textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="مثال: تصویر آگهی نامناسب است یا قیمت وارد شده اشتباه است."
          className="bg-muted/40 border-input min-h-25 rounded-sm placeholder:text-muted-foreground/60"
        />
        {reason.trim().length > 0 && reason.trim().length < 5 && (
          <p className="text-xs text-destructive mt-2">دلیل باید حداقل ۵ کاراکتر باشد.</p>
        )}
        <div className="flex gap-3 mt-6">
          <Button variant="outline" className="flex-1 rounded-sm cursor-pointer" onClick={onClose}>
            انصراف
          </Button>
          <Button
            variant="destructive"
            className="flex-1 cursor-pointer rounded-sm"
            onClick={handleConfirm}
            disabled={reason.trim().length < 5 || isLoading}
          >
            {isLoading ? <Loader2 className="animate-spin ml-2" /> : null}
            تایید و رد آگهی
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RejectModal;
