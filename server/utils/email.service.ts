import nodemailer from "nodemailer";
import { env } from "@/config/env.js";
import { logger } from "@/config/logger.js";
import { HttpError } from "./httpError.js";

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
    const transporter = nodemailer.createTransport({
      host: "smtp.office365.com",
      port: 587,
      secure: false,
      auth: {
        user: env.email.user,
        pass: env.email.password,
      },
      tls: { ciphers: "SSLv3" },
    });

    const mailOptions = {
      from: `"Nabz SuperApp" <${env.email.user}>`,
      to,
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
    };
    const info = await transporter.sendMail(mailOptions);
    logger.info(`📧 Email sent: ${info.messageId}`);
  } catch (error) {
    logger.error("❌ Failed to send email:", error);
    throw HttpError.badRequest("Failed to send email");
  }
};

export const sendPasswordResetEmail = async (to: string, resetLink: string) => {
  if (env.isDev) {
    logger.info(`\n========================================`);
    logger.info(`📧 [DEV MODE] Password Reset Link`);
    logger.info(`To: ${to}`);
    logger.info(`🔗 Link: ${resetLink}`);
    logger.info(`========================================\n`);
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.office365.com",
      port: 587,
      secure: false,
      auth: { user: env.email.user, pass: env.email.password },
      tls: { ciphers: "SSLv3" },
    });

    const mailOptions = {
      from: `"Nabz SuperApp" <${env.email.user}>`,
      to,
      subject: "بازیابی رمز عبور - نبض",
      html: `<div style="direction: rtl; font-family: Tahoma; text-align: center;"><a href="${resetLink}" style="background-color: #2196F3; color: white; padding: 10px 20px; text-decoration: none;">بازیابی رمز عبور</a></div>`,
    };
    const info = await transporter.sendMail(mailOptions);
    logger.info(`📧 Reset email sent: ${info.messageId}`);
  } catch (error) {
    logger.error("❌ Failed to send reset email:", error);
    throw HttpError.badRequest("Failed to send reset email");
  }
};

export const sendPasswordChangedNotification = async (to: string) => {
  if (env.isDev) {
    logger.info(`\n========================================`);
    logger.info(`📧 [DEV MODE] Password Changed Notification`);
    logger.info(`To: ${to}`);
    logger.info(`========================================\n`);
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.office365.com",
      port: 587,
      secure: false,
      auth: { user: env.email.user, pass: env.email.password },
      tls: { ciphers: "SSLv3" },
    });

    const mailOptions = {
      from: `"Nabz SuperApp" <${env.email.user}>`,
      to,
      subject: "تغییر موفقیت‌آمیز رمز عبور - نبض",
      html: `<div style="direction: rtl; font-family: Tahoma; text-align: center;"><h2>رمز عبور شما تغییر کرد</h2></div>`,
    };
    await transporter.sendMail(mailOptions);
  } catch (error) {
    logger.error("❌ Failed to send notification email:", error);
  }
};
