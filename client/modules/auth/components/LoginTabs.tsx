import { Mail, Smartphone } from "lucide-react";

interface LoginTabsProps {
  loginMethod: "email" | "phone";
  switchMethod: (method: "email" | "phone") => void;
}

const LoginTabs = ({ loginMethod, switchMethod }: LoginTabsProps) => {
  return (
    <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
      <button
        type="button"
        onClick={() => switchMethod("email")}
        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-sm cursor-pointer text-sm font-medium transition-all ${
          loginMethod === "email"
            ? "bg-white text-violet-600 shadow-sm"
            : "text-gray-500 hover:text-gray-700"
        }`}
      >
        <Mail className="h-4 w-4" />
        ایمیل و رمز
      </button>
      <button
        type="button"
        onClick={() => switchMethod("phone")}
        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-sm text-sm cursor-pointer font-medium transition-all ${
          loginMethod === "phone"
            ? "bg-white text-violet-600 shadow-sm"
            : "text-gray-500 hover:text-gray-700"
        }`}
      >
        <Smartphone className="h-4 w-4" />
        موبایل (OTP)
      </button>
    </div>
  );
};

export default LoginTabs;
