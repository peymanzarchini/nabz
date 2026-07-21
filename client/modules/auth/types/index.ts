import { UseFormReturn } from "react-hook-form";
import {
  LoginEmailData,
  RegisterFormData,
  SendOtpData,
  VerifyFormData,
  VerifyOtpData,
} from "../validations";

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  avatar: string | null;
};

export type AuthContextType = {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
  updateUser: (user: User | null) => void;
};

export interface RegisterStep1Props {
  registerForm: UseFormReturn<RegisterFormData>;
  onRegisterSubmit: (data: RegisterFormData) => Promise<void>;
  num1: number;
  num2: number;
  captchaInput: string;
  setCaptchaInput: (val: string) => void;
  captchaError: string;
  generateCaptcha: () => void;
}

export interface RegisterStep2Props {
  verifyForm: UseFormReturn<VerifyFormData>;
  onVerifySubmit: (data: VerifyFormData) => Promise<void>;
  isTimerActive: boolean;
  timeLeft: number;
  formatTime: (seconds: number) => string;
  handleResendCode: () => Promise<void>;
  onBack: () => void;
  email?: string;
}

export interface EmailLoginFormProps {
  emailForm: UseFormReturn<LoginEmailData>;
  onEmailSubmit: (data: LoginEmailData) => Promise<void>;
}

export interface SendOtpFormProps {
  phoneForm: UseFormReturn<SendOtpData>;
  onSendOtpSubmit: (data: SendOtpData) => Promise<void>;
}

export interface VerifyOtpFormProps {
  otpForm: UseFormReturn<VerifyOtpData>;
  onVerifyOtpSubmit: (data: VerifyOtpData) => Promise<void>;
  userPhone: string;
  isTimerActive: boolean;
  timeLeft: number;
  formatTime: (seconds: number) => string;
  handleResendOtp: () => Promise<void>;
  onBack: () => void;
}
