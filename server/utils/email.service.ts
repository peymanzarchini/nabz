/* eslint-disable @typescript-eslint/no-explicit-any */
import nodemailer from "nodemailer";
import { env } from "@/config/env.js";
import { logger } from "@/config/logger.js";

const transporter = nodemailer.createTransport({
  host: "smtp.mail.yahoo.com",
  port: env.isDev ? 587 : 2525,
  secure: false,
  auth: {
    user: env.email.user,
    pass: env.email.password,
  },
  tls: {
    rejectUnauthorized: false,
  },
  family: 4,
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
} as any);

export const sendVerificationEmail = async (to: string, code: string) => {
  try {
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
    logger.info(`📧 Email sent successfully to ${to}: ${info.messageId}`);
  } catch (error) {
    logger.error("❌ Failed to send email:", error);
    throw new Error("Failed to send email");
  }
};

export const sendPasswordResetEmail = async (to: string, resetLink: string) => {
  try {
    const mailOptions = {
      from: `"Nabz SuperApp" <${env.email.user}>`,
      to,
      subject: "بازیابی رمز عبور - نبض",
      html: `<div style="direction: rtl; font-family: Tahoma; text-align: center;"><a href="${resetLink}" style="background-color: #2196F3; color: white; padding: 10px 20px; text-decoration: none;">بازیابی رمز عبور</a></div>`,
    };
    await transporter.sendMail(mailOptions);
    logger.info(`📧 Reset email sent to ${to}`);
  } catch (error) {
    logger.error("❌ Failed to send reset email:", error);
  }
};

export const sendPasswordChangedNotification = async (to: string) => {
  try {
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
