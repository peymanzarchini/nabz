import nodemailer from "nodemailer";
import { env } from "@/config/env.js";
import { logger } from "@/config/logger.js";
import { HttpError } from "./httpError.js";

const transporter = nodemailer.createTransport({
  host: "smtp.office365.com",
  port: 587,
  secure: false,
  auth: {
    user: env.email.user,
    pass: env.email.password,
  },
  tls: {
    ciphers: "SSLv3",
  },
});

export const sendVerificationEmail = async (to: string, code: string) => {
  try {
    const mailOptions = {
      from: `"Nabz SuperApp" <${env.email.user}>`,
      to,
      subject: "کد تایید حساب کاربری - نبض",
      html: `
        <div style="direction: rtl; font-family: Tahoma, Geneva, sans-serif; text-align: center; border: 1px solid #e0e0e0; padding: 20px; border-radius: 10px;">
          <h2 style="color: #4CAF50;">خوش آمدید!</h2>
          <p>از اینکه اپلیکیشن نبض را برای کارهای روزمره خود انتخاب کردید، سپاسگزاریم.</p>
          <p>کد تایید شما برای تکمیل ثبت‌نام:</p>
          <div style="background-color: #f9f9f9; padding: 15px; font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #333; border: 1px dashed #4CAF50; display: inline-block;">
            ${code}
          </div>
          <p style="font-size: 12px; color: #888; margin-top: 20px;">این کد تا ۵ دقیقه دیگر منقضی می‌شود.</p>
        </div>
      `,
    };
    const info = await transporter.sendMail(mailOptions);
    logger.info(`📧 Email sent: ${info.messageId}`);
    return info;
  } catch (error) {
    logger.error("❌ Failed to send email:", error);
    throw HttpError.badRequest("Failed to send email");
  }
};

export const sendPasswordResetEmail = async (to: string, resetLink: string) => {
  try {
    const mailOptions = {
      from: `"Nabz SuperApp" <${env.email.user}>`,
      to,
      subject: "بازیابی رمز عبور - نبض",
      html: `<div style="direction: rtl; font-family: Tahoma; text-align: center; border: 1px solid #e0e0e0; padding: 20px; border-radius: 10px;">
        <h2 style="color: #2196F3;">درخواست بازیابی رمز عبور</h2>
        <p>برای تغییر رمز عبور خود روی دکمه زیر کلیک کنید:</p>
        <a href="${resetLink}" style="background-color: #2196F3; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">بازیابی رمز عبور</a>
        <p style="font-size: 12px; color: #888; margin-top: 20px;">اگر شما این درخواست را ارسال نکرده‌اید، این ایمیل را نادیده بگیرید. این لینک تا ۱۵ دقیقه معتبر است.</p>
      </div>`,
    };
    const info = await transporter.sendMail(mailOptions);
    logger.info(`📧 Reset email sent: ${info.messageId}`);
  } catch (error) {
    logger.error("❌ Failed to send reset email:", error);
    throw HttpError.badRequest("Failed to send reset email");
  }
};

export const sendPasswordChangedNotification = async (to: string) => {
  try {
    const mailOptions = {
      from: `"Nabz SuperApp" <${env.email.user}>`,
      to,
      subject: "تغییر موفقیت‌آمیز رمز عبور - نبض",
      html: `<div style="direction: rtl; font-family: Tahoma; text-align: center; border: 1px solid #e0e0e0; padding: 20px; border-radius: 10px;">
        <h2 style="color: #4CAF50;">رمز عبور شما تغییر کرد</h2>
        <p>رمز عبور حساب کاربری شما با موفقیت تغییر یافت. اگر این کار را شما انجام نداده‌اید، فوراً با پشتیبانی تماس بگیرید.</p>
      </div>`,
    };
    await transporter.sendMail(mailOptions);
  } catch (error) {
    logger.error("❌ Failed to send notification email:", error);
  }
};
