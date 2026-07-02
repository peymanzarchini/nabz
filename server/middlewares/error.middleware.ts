/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response, NextFunction } from "express";
import {
  ValidationError,
  UniqueConstraintError,
  ForeignKeyConstraintError,
  DatabaseError,
} from "@sequelize/core";
import { HttpError } from "@/utils/httpError.js";
import { logger } from "@/config/logger.js";

export function errorHandler(err: unknown, _req: Request, res: Response, next: NextFunction): void {
  logger.error("Error caught by handler", err);

  let statusCode = 500;
  let message = "خطای داخلی سرور";

  if (err instanceof ValidationError) {
    statusCode = 400;
    message = err.errors.map((e) => e.message).join(" | ");
  } else if (err instanceof UniqueConstraintError) {
    statusCode = 409;
    message = err.errors.map((e) => e.message).join(" | ");
  } else if (err instanceof ForeignKeyConstraintError) {
    statusCode = 400;
    message = "آیدی ارجاع داده شده نامعتبر است یا وجود ندارد.";
  } else if (err instanceof DatabaseError) {
    statusCode = 503;
    message = "سرویس دیتابیس در دسترس نیست. لطفاً بعداً تلاش کنید.";
  } else if (err instanceof HttpError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (typeof err === "object" && err !== null && "statusCode" in err) {
    const expressErr = err as { statusCode?: number; message?: string };
    statusCode = expressErr.statusCode || 500;
    message = expressErr.message || "خطای داخلی سرور";

    if (message.includes("JSON")) {
      message = "فرمت JSON در بدنه درخواست نامعتبر است";
      statusCode = 400;
    }
  }

  if (typeof res.fail === "function") {
    res.fail(message, null, statusCode);
  } else {
    res.status(statusCode).json({
      success: false,
      message,
      body: null,
      status: statusCode,
    });
  }
}
