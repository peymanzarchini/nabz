"use client";

import { useRegisterForm } from "@/modules/auth/hooks/useRegisterForm";
import RegisterStep1 from "@/modules/auth/components/RegisterStep1";
import RegisterStep2 from "@/modules/auth/components/RegisterStep2";

const RegisterPage = () => {
  const form = useRegisterForm();

  return (
    <div className="w-full bg-white rounded-xl overflow-y-auto p-8 shadow-2xl shadow-black/10">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-black text-gray-900">
          {form.step === 1 ? "ثبت‌نام در نبض" : "تایید حساب کاربری"}
        </h1>
        <p className="text-sm text-gray-500 mt-2">
          {form.step === 1
            ? "یک حساب کاربری جدید بسازید"
            : `کد ارسال شده به ${form.formData?.email} را وارد کنید`}
        </p>
      </div>

      {form.step === 1 ? (
        <RegisterStep1
          registerForm={form.registerForm}
          onRegisterSubmit={form.onRegisterSubmit}
          num1={form.num1}
          num2={form.num2}
          captchaInput={form.captchaInput}
          setCaptchaInput={form.setCaptchaInput}
          captchaError={form.captchaError}
          generateCaptcha={form.generateCaptcha}
        />
      ) : (
        <RegisterStep2
          verifyForm={form.verifyForm}
          onVerifySubmit={form.onVerifySubmit}
          isTimerActive={form.isTimerActive}
          timeLeft={form.timeLeft}
          formatTime={form.formatTime}
          handleResendCode={form.handleResendCode}
          onBack={() => form.setStep(1)}
          email={form.formData?.email}
        />
      )}
    </div>
  );
};

export default RegisterPage;
