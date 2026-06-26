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
          "201": {
            description: "کد تایید با موفقیت ارسال شد",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiResponse" },
                example: {
                  success: true,
                  message: "کد تایید با موفقیت به ایمیل شما ارسال شد.",
                  body: null,
                  status: 201,
                },
              },
            },
          },
          "400": { description: "خطای اعتبارسنجی داده‌ها" },
          "409": { description: "ایمیل قبلاً تایید شده و فعال است" },
        },
      },
    },
    "/api/auth/resend": {
      post: {
        summary: "درخواست مجدد کد تایید",
        description:
          "ارسال مجدد کد تایید برای کاربری که ثبت‌نام کرده اما هنوز تایید نشده است (حداکثر 3 بار)",
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
          "200": {
            description: "کد جدید ارسال شد",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiResponse" },
                example: {
                  success: true,
                  message: "کد تایید جدید ارسال شد (تلاش 2 از ۳)",
                  body: null,
                  status: 200,
                },
              },
            },
          },
          "400": { description: "تعداد دفعات ارسال به پایان رسیده است" },
          "404": { description: "درخواست معتبری برای این ایمیل یافت نشد" },
        },
      },
    },
    "/api/auth/verify": {
      post: {
        summary: "تایید حساب کاربری",
        description:
          "بررسی کد تایید (OTP) ارسال شده به ایمیل برای فعال‌سازی حساب (حداکثر 5 بار شانس برای وارد کردن کد)",
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
          "200": {
            description: "حساب کاربری با موفقیت فعال شد",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiResponse" },
                example: {
                  success: true,
                  message: "حساب کاربری شما با موفقیت فعال شد.",
                  body: null,
                  status: 200,
                },
              },
            },
          },
          "400": { description: "کد اشتباه است یا منقضی شده" },
          "403": { description: "تعداد دفعات وارد کردن کد اشتباه بیش از حد مجاز بوده است" },
          "404": { description: "کاربر یا کد تایید یافت نشد" },
        },
      },
    },
    "/api/auth/login": {
      post: {
        summary: "ورود به حساب کاربری",
        description:
          "کاربران فعال شده می‌توانند با ایمیل/شماره موبایل و رمز عبور وارد شوند. توکن‌ها در کوکی قرار می‌گیرند.",
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
          "200": {
            description: "ورود موفقیت‌آمیز",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiResponse" },
                example: {
                  success: true,
                  message: "ورود با موفقیت انجام شد.",
                  body: {
                    id: 1,
                    firstName: "علی",
                    lastName: "رضایی",
                    email: "ali@example.com",
                    role: "customer",
                    status: "active",
                    isVerified: true,
                  },
                  status: 200,
                },
              },
            },
          },
          "401": { description: "ایمیل/شماره موبایل یا رمز عبور اشتباه است" },
          "403": { description: "حساب کاربری فعال نیست" },
        },
      },
    },
    "/api/auth/refresh": {
      post: {
        summary: "دریافت توکن جدید (Refresh Token)",
        description: "با استفاده از کوکی رفرش توکن، توکن‌های دسترسی جدید صادر می‌شود.",
        tags: ["Authentication"],
        responses: {
          "200": {
            description: "توکن‌ها با موفقیت بروزرسانی شدند",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiResponse" },
                example: {
                  success: true,
                  message: "توکن‌ها با موفقیت بروزرسانی شدند.",
                  body: null,
                  status: 200,
                },
              },
            },
          },
          "401": { description: "توکن یافت نشد یا نامعتبر است" },
        },
      },
    },
    "/api/auth/forgot-password": {
      post: {
        summary: "فراموشی رمز عبور",
        description: "کاربر ایمیل خود را وارد می‌کند و لینک بازیابی رمز عبور برای او ایمیل می‌شود",
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
          "200": {
            description: "لینک بازیابی ارسال شد",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiResponse" },
                example: {
                  success: true,
                  message: "لینک بازیابی با موفقیت برای شما ارسال شد.",
                  body: null,
                  status: 200,
                },
              },
            },
          },
          "404": {
            description: "کاربری با این ایمیل یافت نشد",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiResponse" },
                example: {
                  success: false,
                  message: "کاربری با این ایمیل یافت نشد.",
                  body: null,
                  status: 404,
                },
              },
            },
          },
        },
      },
    },
    "/api/auth/reset-password": {
      post: {
        summary: "بازیابی رمز عبور",
        description: "با استفاده از توکن دریافتی از ایمیل و رمز عبور جدید، رمز کاربر تغییر می‌کند",
        tags: ["Authentication"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["token", "newPassword", "confirmPassword"],
                properties: {
                  token: { type: "string", example: "eyJhbGciOiJIUzI1NiIsInR5cCI6..." },
                  newPassword: { type: "string", format: "password", example: "NewPassword123" },
                  confirmPassword: {
                    type: "string",
                    format: "password",
                    example: "NewPassword123",
                  },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "رمز عبور با موفقیت بازیابی شد",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiResponse" },
                example: {
                  success: true,
                  message: "رمز عبور با موفقیت بازیابی شد.",
                  body: null,
                  status: 200,
                },
              },
            },
          },
          "400": { description: "توکن نامعتبر است یا رمزها همخوانی ندارند" },
        },
      },
    },
    "/api/auth/profile": {
      get: {
        summary: "دریافت پروفایل کاربر",
        description: "دریافت اطلاعات کاربر لاگین شده (نیاز به توکن دارد)",
        tags: ["Authentication"],
        security: [{ BearerAuth: [] }],
        responses: {
          "200": {
            description: "اطلاعات پروفایل",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiResponse" },
                example: {
                  success: true,
                  message: "Profile fetched",
                  body: {
                    id: 1,
                    firstName: "علی",
                    lastName: "رضایی",
                    email: "ali@example.com",
                    role: "customer",
                    status: "active",
                    isVerified: true,
                  },
                  status: 200,
                },
              },
            },
          },
          "401": { description: "عدم احراز هویت" },
        },
      },
    },
    "/api/auth/change-password": {
      post: {
        summary: "تغییر رمز عبور",
        description:
          "کاربر لاگین شده با وارد کردن رمز فعلی و رمز جدید، پسورد خود را تغییر می‌دهد (نیاز به توکن دارد)",
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
                  currentPassword: { type: "string", format: "password", example: "OldPass123" },
                  newPassword: { type: "string", format: "password", example: "NewPass123" },
                  confirmPassword: { type: "string", format: "password", example: "NewPass123" },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "رمز عبور تغییر کرد",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiResponse" },
                example: {
                  success: true,
                  message: "رمز عبور با موفقیت تغییر کرد.",
                  body: null,
                  status: 200,
                },
              },
            },
          },
          "401": { description: "رمز عبور فعلی اشتباه است" },
        },
      },
    },
    "/api/auth/logout": {
      post: {
        summary: "خروج از حساب کاربری (Logout)",
        description: "پاک کردن کوکی‌های توکن دسترسی و رفرش توکن برای خروج کاربر از سیستم",
        tags: ["Authentication"],
        responses: {
          "200": {
            description: "خروج موفقیت‌آمیز",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiResponse" },
                example: {
                  success: true,
                  message: "خروج با موفقیت انجام شد.",
                  body: null,
                  status: 200,
                },
              },
            },
          },
        },
      },
    },
    "/api/auth/users/{id}/role": {
      patch: {
        summary: "تغییر نقش کاربر (فقط ادمین)",
        description: "این روت فقط برای مدیران است تا نقش کاربران را تغییر دهند",
        tags: ["Authentication"],
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
            description: "آیدی کاربر",
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
                    example: "driver",
                  },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "نقش تغییر کرد",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiResponse" },
                example: {
                  success: true,
                  message: "نقش کاربر با موفقیت تغییر کرد.",
                  body: null,
                  status: 200,
                },
              },
            },
          },
          "403": { description: "دسترسی غیرمجاز (شما ادمین نیستید)" },
          "404": { description: "کاربر یافت نشد" },
        },
      },
    },
  },
};
