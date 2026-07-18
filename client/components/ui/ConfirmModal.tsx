"use client";

import { Loader2, X, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  isLoading?: boolean;
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  isLoading,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white dark:bg-zinc-900 rounded-sm shadow-2xl w-full max-w-md p-6 animate-slide-up">
        <button
          onClick={onClose}
          className="absolute top-4 left-4 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-500/10 flex items-center justify-center mb-4">
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>

          <h2 className="text-xl font-bold text-zinc-800 dark:text-white mb-2">{title}</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6 leading-6">{message}</p>

          <div className="flex gap-3 w-full">
            <Button
              variant="outline"
              className="flex-1 h-11 rounded-sm dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800 cursor-pointer"
              onClick={onClose}
              disabled={isLoading}
            >
              انصراف
            </Button>
            <Button
              variant="destructive"
              className="flex-1 h-11 rounded-sm cursor-pointer"
              onClick={onConfirm}
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="animate-spin ml-2" /> : null}
              حذف آگهی
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
