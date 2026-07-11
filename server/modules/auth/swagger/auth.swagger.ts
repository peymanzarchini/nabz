export const authSwaggerDocs = {
  paths: {
    "/api/auth/register": {
      post: {
        summary: "ثبت‌نام کاربر جدید",
        description: "ثبت‌نام کاربر با اطلاعات پایه و ارسال کد تایید (OTP) به ایمیل",
        tags: ["Authentication"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["firstName", "lastName", "email", "password", "phoneNumber"],
                properties: {
                  firstName: { type: "string", example: "علی" },
                  lastName: { type: "string", example: "رضایی" },
                  email: { type: "string", format: "email", example: "ali@example.com" },
                  password: { type: "string", format: "password", example: "Password123" },
                  phoneNumber: { type: "string", example: "+989123456789" },
                },
              },
            },
          },
        },
        responses: {
          "201": { description: "کد تایید با موفقیت ارسال شد" },
          "400": { description: "خطای اعتبارسنجی داده‌ها" },
          "409": { description: "ایمیل قبلاً تایید شده و فعال است" },
        },
      },
    },
    "/api/auth/resend": {
      post: {
        summary: "درخواست مجدد کد تایید ایمیل",
        tags: ["Authentication"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email"],
                properties: {
                  email: { type: "string", format: "email", example: "ali@example.com" },
                },
              },
            },
          },
        },
        responses: {
          "200": { description: "کد جدید ارسال شد" },
          "400": { description: "تعداد دفعات ارسال به پایان رسیده است" },
        },
      },
    },
    "/api/auth/verify": {
      post: {
        summary: "تایید حساب کاربری (ایمیل)",
        tags: ["Authentication"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "code"],
                properties: {
                  email: { type: "string", format: "email", example: "ali@example.com" },
                  code: { type: "string", example: "123456" },
                },
              },
            },
          },
        },
        responses: {
          "200": { description: "حساب کاربری با موفقیت فعال شد" },
          "400": { description: "کد اشتباه است یا منقضی شده" },
        },
      },
    },
    "/api/auth/login": {
      post: {
        summary: "ورود با ایمیل/موبایل و رمز عبور",
        tags: ["Authentication"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["identifier", "password"],
                properties: {
                  identifier: { type: "string", example: "ali@example.com" },
                  password: { type: "string", format: "password", example: "Password123" },
                },
              },
            },
          },
        },
        responses: {
          "200": { description: "ورود موفقیت‌آمیز" },
          "401": { description: "ایمیل/شماره موبایل یا رمز عبور اشتباه است" },
        },
      },
    },
    // ==========================================
    // 🆕 روت‌های جدید ورود با موبایل (OTP)
    // ==========================================
    "/api/auth/send-phone-otp": {
      post: {
        summary: "ارسال کد یکبار مصرف به شماره موبایل",
        description:
          "برای ورود بدون رمز عبور، کد ۶ رقمی به شماره موبایل ارسال می‌شود (فعلاً در ترمینال لاگ می‌شود).",
        tags: ["Authentication"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["phoneNumber"],
                properties: {
                  phoneNumber: { type: "string", example: "+989123456789" },
                },
              },
            },
          },
        },
        responses: {
          "200": { description: "کد تایید با موفقیت ارسال شد" },
          "404": { description: "کاربری با این شماره یافت نشد" },
        },
      },
    },
    "/api/auth/login-with-otp": {
      post: {
        summary: "ورود با شماره موبایل و کد یکبار مصرف",
        tags: ["Authentication"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["phoneNumber", "code"],
                properties: {
                  phoneNumber: { type: "string", example: "+989123456789" },
                  code: { type: "string", example: "123456", minLength: 6, maxLength: 6 },
                },
              },
            },
          },
        },
        responses: {
          "200": { description: "ورود موفقیت‌آمیز" },
          "400": { description: "کد اشتباه یا منقضی شده" },
        },
      },
    },
    // ==========================================
    "/api/auth/refresh": {
      post: {
        summary: "دریافت توکن جدید (Refresh Token)",
        tags: ["Authentication"],
        responses: {
          "200": { description: "توکن‌ها با موفقیت بروزرسانی شدند" },
          "401": { description: "توکن یافت نشد یا نامعتبر است" },
        },
      },
    },
    "/api/auth/forgot-password": {
      post: {
        summary: "فراموشی رمز عبور",
        tags: ["Authentication"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email"],
                properties: {
                  email: { type: "string", format: "email", example: "ali@example.com" },
                },
              },
            },
          },
        },
        responses: {
          "200": { description: "لینک بازیابی ارسال شد" },
          "404": { description: "کاربری با این ایمیل یافت نشد" },
        },
      },
    },
    "/api/auth/reset-password": {
      post: {
        summary: "بازیابی رمز عبور",
        tags: ["Authentication"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["token", "newPassword", "confirmPassword"],
                properties: {
                  token: { type: "string" },
                  newPassword: { type: "string", format: "password" },
                  confirmPassword: { type: "string", format: "password" },
                },
              },
            },
          },
        },
        responses: {
          "200": { description: "رمز عبور با موفقیت بازیابی شد" },
          "400": { description: "توکن نامعتبر است" },
        },
      },
    },
    "/api/auth/profile": {
      get: {
        summary: "دریافت پروفایل کاربر",
        tags: ["Authentication"],
        security: [{ BearerAuth: [] }],
        responses: { "200": { description: "اطلاعات پروفایل" } },
      },
    },
    "/api/auth/change-password": {
      post: {
        summary: "تغییر رمز عبور",
        tags: ["Authentication"],
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["currentPassword", "newPassword", "confirmPassword"],
                properties: {
                  currentPassword: { type: "string" },
                  newPassword: { type: "string" },
                  confirmPassword: { type: "string" },
                },
              },
            },
          },
        },
        responses: { "200": { description: "رمز عبور تغییر کرد" } },
      },
    },
    "/api/auth/logout": {
      post: {
        summary: "خروج از حساب کاربری (Logout)",
        tags: ["Authentication"],
        responses: { "200": { description: "خروج موفقیت‌آمیز" } },
      },
    },
    "/api/auth/users/{id}/role": {
      patch: {
        summary: "تغییر نقش کاربر (فقط ادمین)",
        tags: ["Authentication"],
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" }, // تغییر به UUID
            description: "آیدی کاربر (UUID)",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["role"],
                properties: {
                  role: {
                    type: "string",
                    enum: ["admin", "support", "seller", "driver", "customer"],
                  },
                },
              },
            },
          },
        },
        responses: {
          "200": { description: "نقش تغییر کرد" },
          "403": { description: "دسترسی غیرمجاز" },
          "404": { description: "کاربر یافت نشد" },
        },
      },
    },
  },
};
