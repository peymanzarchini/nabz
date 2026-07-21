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
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-zinc-900 rounded-sm shadow-2xl w-full max-w-md p-6 animate-slide-up">
        <button
          onClick={onClose}
          className="absolute top-4 left-4 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
        >
          <X className="h-5 w-5" />
        </button>
        <h2 className="text-xl font-bold text-zinc-800 dark:text-white mb-4">رد آگهی</h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
          لطفاً دلیل رد شدن این آگهی را بنویسید تا به فروشنده اطلاع داده شود.
        </p>
        <Textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="مثال: تصویر آگهی نامناسب است یا قیمت وارد شده اشتباه است."
          className="bg-gray-50 dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 min-h-25"
        />
        {reason.trim().length > 0 && reason.trim().length < 5 && (
          <p className="text-xs text-red-500 mt-2">دلیل باید حداقل ۵ کاراکتر باشد.</p>
        )}
        <div className="flex gap-3 mt-6">
          <Button
            variant="outline"
            className="flex-1 dark:border-zinc-700 dark:text-zinc-200 rounded-sm"
            onClick={onClose}
          >
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
