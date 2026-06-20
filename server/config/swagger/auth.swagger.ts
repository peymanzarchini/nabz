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
                schema: {
                  $ref: "#/components/schemas/ApiResponse",
                },
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
  },
};
