export class HttpError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);

    Object.setPrototypeOf(this, HttpError.prototype);
  }

  static badRequest(message: string = "درخواست نامعتبر است"): HttpError {
    return new HttpError(message, 400);
  }

  static unAuthorized(message: string = "احراز هویت نشده‌اید"): HttpError {
    return new HttpError(message, 401);
  }

  static forbidden(message: string = "دسترسی غیرمجاز"): HttpError {
    return new HttpError(message, 403);
  }

  static notFound(message: string = "منبع مورد نظر یافت نشد"): HttpError {
    return new HttpError(message, 404);
  }

  static conflict(message: string = "منبع از قبل وجود دارد"): HttpError {
    return new HttpError(message, 409);
  }

  static unprocessable(message: string = "داده‌ها قابل پردازش نیستند"): HttpError {
    return new HttpError(message, 422);
  }

  static tooManyRequests(message: string = "درخواست‌ها بیش از حد مجاز است"): HttpError {
    return new HttpError(message, 429);
  }

  static internal(message: string = "خطای داخلی سرور"): HttpError {
    return new HttpError(message, 500);
  }

  static serviceUnavailable(message: string = "سرویس در دسترس نیست"): HttpError {
    return new HttpError(message, 503);
  }
}
