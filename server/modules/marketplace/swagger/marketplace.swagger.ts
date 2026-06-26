export const marketplaceSwaggerDocs = {
  paths: {
    "/api/marketplace/listings": {
      post: {
        summary: "ساخت آگهی جدید",
        description:
          "کاربران (فروشندگان) برای ساخت آگهی جدید از این روت استفاده می‌کنند (حداکثر ۵ عکس)",
        tags: ["Marketplace"],
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  title: { type: "string", example: "فروش آیفون ۱۳ پرو" },
                  description: { type: "string", example: "سالم بدون خط و خش، تو باکس" },
                  price: { type: "number", example: 50000000 },
                  isNegotiable: { type: "string", enum: ["true", "false"], example: "false" },
                  condition: { type: "string", enum: ["new", "used"], example: "used" },
                  city: { type: "string", example: "تهران" },
                  district: { type: "string", example: "تهرانپارس" },
                  categoryId: { type: "number", example: 1 },
                  images: {
                    type: "array",
                    items: { type: "string", format: "binary" },
                  },
                },
              },
            },
          },
        },
        responses: {
          "201": { description: "آگهی با موفقیت ساخته شد (در انتظار تایید ادمین)" },
          "400": { description: "خطای اعتبارسنجی یا عدم ارسال عکس" },
          "404": { description: "دسته‌بندی یافت نشد" },
        },
      },
    },
  },
};
