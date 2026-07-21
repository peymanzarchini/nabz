"use client";

import Link from "next/link";
import { useLoginForm } from "@/modules/auth/hooks/useLoginForm";
import EmailLoginForm from "@/modules/auth/components/EmailLoginForm";
import SendOtpForm from "@/modules/auth/components/SendOtpForm";
import VerifyOtpForm from "@/modules/auth/components/VerifyOtpForm";
import LoginTabs from "@/modules/auth/components/LoginTabs";

const LoginPage = () => {
  const form = useLoginForm();

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-sm p-8 shadow-2xl shadow-black/10">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-black text-gray-900">ورود به نبض</h1>
        <p className="text-sm text-gray-500 mt-2">به حساب کاربری خود وارد شوید</p>
      </div>

      <LoginTabs loginMethod={form.loginMethod} switchMethod={form.switchMethod} />

      {form.loginMethod === "email" && (
        <EmailLoginForm emailForm={form.emailForm} onEmailSubmit={form.onEmailSubmit} />
      )}

      {form.loginMethod === "phone" && form.otpStep === 1 && (
        <SendOtpForm phoneForm={form.phoneForm} onSendOtpSubmit={form.onSendOtpSubmit} />
      )}

      {form.loginMethod === "phone" && form.otpStep === 2 && (
        <VerifyOtpForm
          otpForm={form.otpForm}
          onVerifyOtpSubmit={form.onVerifyOtpSubmit}
          userPhone={form.userPhone}
          isTimerActive={form.isTimerActive}
          timeLeft={form.timeLeft}
          formatTime={form.formatTime}
          handleResendOtp={form.handleResendOtp}
          onBack={() => form.setOtpStep(1)}
        />
      )}

      <p className="text-center text-sm text-gray-600 mt-6">
        حساب کاربری ندارید؟{" "}
        <Link href="/register" className="text-violet-600 font-bold hover:underline">
          ثبت‌نام کنید
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;
