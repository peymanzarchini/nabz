import { Resend } from "resend";
import { env } from "@/config/env.js";
import { logger } from "@/config/logger.js";

const resend = new Resend(env.email.password);
const SENDER_EMAIL = "Nabz SuperApp <onboarding@resend.dev>";

export const sendVerificationEmail = async (to: string, code: string) => {
  if (env.isDev) {
    logger.info(`\n========================================`);
    logger.info(`📧 [DEV MODE] Verification Code`);
    logger.info(`To: ${to}`);
    logger.info(`🔢 Code: ${code}`);
    logger.info(`========================================\n`);
    return;
  }
  try {
    const { data, error } = await resend.emails.send({
      from: SENDER_EMAIL,
      to: [to],
      subject: "کد تایید حساب کاربری - نبض",
      html: `
        <div style="direction: rtl; font-family: Tahoma, Geneva, sans-serif; text-align: center; border: 1px solid #e0e0e0; padding: 20px; border-radius: 10px;">
          <h2 style="color: #4CAF50;">خوش آمدید!</h2>
          <p>کد تایید شما برای تکمیل ثبت‌نام:</p>
          <div style="background-color: #f9f9f9; padding: 15px; font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #333; border: 1px dashed #4CAF50; display: inline-block;">
            ${code}
          </div>
        </div>
      `,
    });

    if (error) {
      logger.error("❌ Resend API Error:", error);
      throw new Error("Failed to send email");
    }

    logger.info(`📧 Email sent successfully to ${to} via Resend. ID: ${data?.id}`);
  } catch (error) {
    logger.error("❌ Failed to send email via Resend:", error);
    throw new Error("Failed to send email");
  }
};

export const sendPasswordResetEmail = async (to: string, resetLink: string) => {
  if (env.isDev) {
    logger.info(`[DEV MODE] Reset Link for ${to}: ${resetLink}`);
    return;
  }

  try {
    const { data, error } = await resend.emails.send({
      from: SENDER_EMAIL,
      to: [to],
      subject: "بازیابی رمز عبور - نبض",
      html: `<div style="direction: rtl; font-family: Tahoma; text-align: center;"><a href="${resetLink}" style="background-color: #2196F3; color: white; padding: 10px 20px; text-decoration: none;">بازیابی رمز عبور</a></div>`,
    });

    if (error) {
      logger.error("❌ Resend API Error (Reset):", error);
      throw new Error("Failed to send reset email");
    }
    logger.info(`📧 Reset email sent to ${to} via Resend. ID: ${data?.id}`);
  } catch (error) {
    logger.error("❌ Failed to send reset email via Resend:", error);
    throw new Error("Failed to send reset email");
  }
};

export const sendPasswordChangedNotification = async (to: string) => {
  if (env.isDev) {
    logger.info(`[DEV MODE] Password changed notification for ${to}`);
    return;
  }

  try {
    const { error } = await resend.emails.send({
      from: SENDER_EMAIL,
      to: [to],
      subject: "تغییر موفقیت‌آمیز رمز عبور - نبض",
      html: `<div style="direction: rtl; font-family: Tahoma; text-align: center;"><h2>رمز عبور شما با موفقیت تغییر کرد</h2></div>`,
    });

    if (error) {
      logger.error("❌ Resend API Error (Notify):", error);
      throw new Error("Failed to send notification email");
    }
  } catch (error) {
    logger.error("❌ Failed to send notification email via Resend:", error);
    throw new Error("Failed to send notification email");
  }
};
