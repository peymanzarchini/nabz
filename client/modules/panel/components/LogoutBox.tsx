import { Button } from "@/components/ui/button";
import { Dispatch, SetStateAction } from "react";

interface LogoutBoxProps {
  setIsLogoutOpen: Dispatch<SetStateAction<boolean>>;
  logout: () => void;
}

const LogoutBox = ({ logout, setIsLogoutOpen }: LogoutBoxProps) => {
  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => setIsLogoutOpen(false)}
      />
      <div className="relative bg-white dark:bg-zinc-900 rounded-sm shadow-2xl w-full max-w-md p-6 animate-slide-up text-center">
        <h2 className="text-xl font-bold text-zinc-800 dark:text-white mb-4">خروج از حساب</h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
          آیا از خروج از حساب کاربری خود مطمئن هستید؟
        </p>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1 dark:border-zinc-700 dark:text-zinc-200 rounded-sm"
            onClick={() => setIsLogoutOpen(false)}
          >
            انصراف
          </Button>
          <Button
            variant="destructive"
            className="flex-1 cursor-pointer rounded-sm"
            onClick={() => {
              logout();
              setIsLogoutOpen(false);
            }}
          >
            خروج
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LogoutBox;
