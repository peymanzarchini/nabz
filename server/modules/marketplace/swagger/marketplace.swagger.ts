export const marketplaceSwaggerDocs = {
  paths: {
    "/api/marketplace/categories": {
      get: {
        summary: "دریافت لیست دسته‌بندی‌ها",
        description:
          "دریافت تمام دسته‌بندی‌های اصلی به همراه زیردسته‌ها و ساختار فرم‌ساز (specsSchema)",
        tags: ["Marketplace"],
        responses: {
          "200": {
            description: "لیست دسته‌بندی‌ها",
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/ApiResponse" } },
            },
          },
        },
      },
      post: {
        summary: "ایجاد دسته‌بندی جدید (فقط ادمین)",
        description:
          "ایجاد دسته جدید. با استفاده از specsSchema فرم اختصاصی آن دسته (مثل فرم ماشین یا املاک) تعریف می‌شود.",
        tags: ["Marketplace"],
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name", "slug"],
                properties: {
                  name: { type: "string", example: "خودرو" },
                  slug: { type: "string", example: "cars" },
                  parentId: { type: "integer", nullable: true, example: null },
                  icon: { type: "string", nullable: true, example: "car" },
                  specsSchema: {
                    type: "object",
                    nullable: true,
                    description:
                      "ساختار فرم اختصاصی این دسته. isVariant: true یعنی قیمت را تغییر می‌دهد",
                    additionalProperties: {
                      type: "object",
                      properties: {
                        label: { type: "string", example: "رنگ" },
                        type: {
                          type: "string",
                          enum: ["string", "number", "dropdown", "boolean"],
                          example: "dropdown",
                        },
                        options: {
                          type: "array",
                          items: { type: "string" },
                          example: ["سفید", "مشکی", "قرمز"],
                        },
                        required: { type: "boolean", example: true },
                        isVariant: {
                          type: "boolean",
                          example: true,
                          description: "آیا این ویژگی باعث تغییر قیمت می‌شود؟",
                        },
                      },
                    },
                    example: {
                      color: {
                        label: "رنگ",
                        type: "dropdown",
                        options: ["سفید", "مشکی"],
                        required: true,
                        isVariant: true,
                      },
                      battery_health: {
                        label: "سلامت باتری",
                        type: "number",
                        required: true,
                        isVariant: false,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        responses: {
          "201": { description: "دسته‌بندی ایجاد شد" },
          "403": { description: "دسترسی غیرمجاز" },
          "409": { description: "اسلاگ تکراری است" },
        },
      },
    },
    "/api/marketplace/categories/{id}": {
      patch: {
        summary: "ویرایش دسته‌بندی (فقط ادمین)",
        tags: ["Marketplace"],
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string", example: "املاک مسکونی" },
                  slug: { type: "string", example: "residential" },
                  specsSchema: {
                    type: "object",
                    nullable: true,
                    description: "ساختار فرم اختصاصی",
                  },
                },
              },
            },
          },
        },
        responses: {
          "200": { description: "دسته‌بندی ویرایش شد" },
          "404": { description: "دسته‌بندی یافت نشد" },
        },
      },
      delete: {
        summary: "حذف دسته‌بندی (فقط ادمین)",
        tags: ["Marketplace"],
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": { description: "دسته‌بندی حذف شد" },
          "400": { description: "این دسته دارای زیردسته است" },
          "404": { description: "دسته‌بندی یافت نشد" },
        },
      },
    },

    "/api/marketplace/listings": {
      get: {
        summary: "گرفتن لیست آگهی‌ها (جستجو، فیلتر و صفحه‌بندی)",
        description: "این روت عمومی است و نیاز به توکن ندارد.",
        tags: ["Marketplace"],
        parameters: [
          { name: "page", in: "query", schema: { type: "integer", default: 1 } },
          { name: "limit", in: "query", schema: { type: "integer", default: 10 } },
          {
            name: "search",
            in: "query",
            schema: { type: "string" },
            description: "جستجو در عنوان و توضیحات",
          },
          { name: "categoryId", in: "query", schema: { type: "integer" } },
          {
            name: "cityId",
            in: "query",
            schema: { type: "integer" },
            description: "فیلتر بر اساس آیدی شهر",
          },
          { name: "minPrice", in: "query", schema: { type: "number" } },
          { name: "maxPrice", in: "query", schema: { type: "number" } },
          { name: "condition", in: "query", schema: { type: "string", enum: ["new", "used"] } },
          {
            name: "isAmazingOffer",
            in: "query",
            schema: { type: "string", enum: ["true", "false"] },
            description: "فقط پیشنهادهای شگفت‌انگیز",
          },
          {
            name: "sort",
            in: "query",
            schema: {
              type: "string",
              enum: ["newest", "cheapest", "expensive", "top_rated"],
              default: "newest",
            },
          },
        ],
        responses: {
          "200": {
            description: "لیست آگهی‌ها به همراه اطلاعات صفحه‌بندی",
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/ApiResponse" } },
            },
          },
        },
      },
      post: {
        summary: "ساخت آگهی جدید (فقط فروشندگان)",
        description:
          "ارسال اطلاعات آگهی شامل ویژگی‌های داینامیک (specs) و واریانت‌های قیمت (variants). قیمت نهایی (finalPrice) توسط سرور محاسبه می‌شود.",
        consumes: ["multipart/form-data"],
        tags: ["Marketplace"],
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                required: ["title", "description", "condition", "cityId", "categoryId", "variants"],
                properties: {
                  title: { type: "string", example: "فروش آیفون ۱۷ پرو" },
                  description: { type: "string", example: "سالم بدون خط و خش" },
                  price: {
                    type: "number",
                    example: 60000000,
                    description:
                      "این فیلد در معماری جدید استفاده نمی شود، قیمت در variants تعریف می شود.",
                  },
                  isNegotiable: { type: "string", enum: ["true", "false"], example: "false" },
                  condition: { type: "string", enum: ["new", "used"], example: "new" },
                  cityId: { type: "number", example: 1, description: "آیدی شهر" },
                  districtId: { type: "number", nullable: true, example: 2 },
                  latitude: { type: "number", nullable: true, example: 35.6892 },
                  longitude: { type: "number", nullable: true, example: 51.389 },
                  categoryId: { type: "number", example: 29 },
                  thumbnailIndex: { type: "number", example: 0 },
                  stock: {
                    type: "number",
                    nullable: true,
                    example: 4,
                    description: "این فیلد در variants تعریف می شود.",
                  },

                  specs: {
                    type: "string",
                    description:
                      'مشخصات ثابت کالا (باید به صورت JSON String ارسال شود). مثال: {"brand":"Apple","battery_health":100}',
                    example: '{"brand":"Apple","battery_health":100}',
                  },

                  variants: {
                    type: "string",
                    description:
                      "آرایه واریانت‌ها (باید به صورت JSON String ارسال شود). حداقل یک واریانت الزامی است.",
                    example:
                      '[{"specs":{"color":"مشکی","storage":"256 گیگابایت"},"price":90000000,"stock":2},{"specs":{"color":"سفید","storage":"512 گیگابایت"},"price":105000000,"stock":1}]',
                  },

                  images: { type: "array", items: { type: "string", format: "binary" } },
                },
              },
            },
          },
        },
        responses: {
          "201": { description: "آگهی ساخته شد (در انتظار تایید)" },
          "400": { description: "خطای اعتبارسنجی" },
        },
      },
    },
    "/api/marketplace/listings/{id}": {
      get: {
        summary: "دریافت جزئیات یک آگهی",
        description: "نمایش کامل اطلاعات آگهی شامل finalPrice و specs",
        tags: ["Marketplace"],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": { description: "جزئیات آگهی" },
          "404": { description: "آگهی یافت نشد" },
        },
      },
      patch: {
        summary: "ویرایش آگهی (صاحب آگهی یا ادمین)",
        tags: ["Marketplace"],
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  title: { type: "string", example: "فروش آیفون ۱۳ پرو مکس" },
                  price: { type: "number", example: 55000000 },
                  stock: { type: "number", example: 3 },
                  cityId: { type: "number" },
                  districtId: { type: "number", nullable: true },
                  specs: { type: "object", example: { color: "سفید" } },
                  discountPercentage: { type: "number", nullable: true, example: 25 },
                  discountExpiry: { type: "string", nullable: true, format: "date-time" },
                  status: {
                    type: "string",
                    enum: ["sold"],
                    description: "فروشنده فقط می‌تواند به فروخته شده تغییر دهد",
                  },
                },
              },
            },
          },
        },
        responses: {
          "200": { description: "آگهی ویرایش شد" },
          "403": { description: "شما فقط می‌توانید آگهی خودتان را ویرایش کنید" },
        },
      },
      delete: {
        summary: "حذف آگهی و عکس‌های آن",
        tags: ["Marketplace"],
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": { description: "آگهی حذف شد" },
          "403": { description: "شما فقط می‌توانید آگهی خودتان را حذف کنید" },
        },
      },
    },
    "/api/marketplace/listings/{id}/status": {
      patch: {
        summary: "تغییر وضعیت آگهی (تایید/رد توسط ادمین)",
        tags: ["Marketplace"],
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["status"],
                properties: {
                  status: {
                    type: "string",
                    enum: ["active", "rejected", "sold"],
                    example: "rejected",
                  },
                  rejectionReason: {
                    type: "string",
                    description: "در صورت رد کردن، دلیل آن الزامی است",
                    example: "تصویر آگهی نامرتبط است یا اطلاعات اشتباه وارد شده است.",
                  },
                },
              },
            },
          },
        },
        responses: {
          "200": { description: "وضعیت تغییر کرد" },
          "403": { description: "فقط ادمین/پشتیبان" },
        },
      },
    },
    "/api/marketplace/listings/{id}/offer": {
      patch: {
        summary: "شگفت‌انگیز کردن آگهی (فقط ادمین)",
        description:
          "کالا باید حداقل ۱۵٪ تخفیف با تاریخ معتبر، حداقل ۳ نظر و امتیاز بالای ۴ داشته باشد.",
        tags: ["Marketplace"],
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["isAmazingOffer"],
                properties: { isAmazingOffer: { type: "boolean", example: true } },
              },
            },
          },
        },
        responses: {
          "200": { description: "وضعیت پیشنهاد شگفت‌انگیز تغییر کرد" },
          "400": { description: "کالا شرایط شگفت‌انگیز شدن را ندارد" },
        },
      },
    },
    "/api/marketplace/listings/{id}/images": {
      delete: {
        summary: "حذف یک عکس از گالری آگهی",
        description: "اگر عکس کاور (thumbnail) حذف شود، اولین عکس باقیمانده خودکار کاور می‌شود.",
        tags: ["Marketplace"],
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["imageUrl"],
                properties: { imageUrl: { type: "string", example: "/uploads/img-12345.jpg" } },
              },
            },
          },
        },
        responses: {
          "200": { description: "عکس حذف شد" },
          "404": { description: "عکس یا آگهی یافت نشد" },
        },
      },
    },

    "/api/marketplace/listings/{id}/reviews": {
      get: {
        summary: "دریافت لیست دیدگاه‌های یک آگهی",
        tags: ["Marketplace"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
            description: "آیدی آگهی",
          },
        ],
        responses: { "200": { description: "لیست نظرات" } },
      },
      post: {
        summary: "ثبت دیدگاه جدید",
        description:
          "کاربران می‌توانند امتیاز، متن نظر و نقاط قوت/ضعف را ارسال کنند. کاربر نمی‌تواند به آگهی خودش نظر دهد.",
        tags: ["Marketplace"],
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
            description: "آیدی آگهی",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["rating", "comment"],
                properties: {
                  rating: { type: "integer", minimum: 1, maximum: 5, example: 5 },
                  title: { type: "string", example: "کیفیت عالی" },
                  comment: { type: "string", example: "کالا دقیقا مطابق توضیحات بود." },
                  pros: { type: "array", items: { type: "string" }, example: ["بسته‌بندی خوب"] },
                  cons: { type: "array", items: { type: "string" }, example: ["قیمت بالا"] },
                  parentId: {
                    type: "integer",
                    nullable: true,
                    example: null,
                    description:
                      "آیدی دیدگاه اصلی. فقط در صورت پاسخ دادن به دیدگاه دیگران ارسال شود.",
                  },
                },
              },
            },
          },
        },
        responses: {
          "201": { description: "دیدگاه ثبت شد" },
          "403": { description: "نظر دادن به آگهی خودتان ممنوع است" },
          "409": { description: "شما قبلا نظر داده‌اید" },
        },
      },
    },
    "/api/marketplace/reviews/pending": {
      get: {
        summary: "دریافت لیست دیدگاه‌های در انتظار تایید (ادمین/پشتیبان)",
        tags: ["Marketplace"],
        security: [{ BearerAuth: [] }],
        responses: {
          "200": {
            description: "لیست دیدگاه‌ها",
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/ApiResponse" } },
            },
          },
        },
      },
    },
    "/api/marketplace/reviews/{id}/status": {
      patch: {
        summary: "تایید یا رد دیدگاه (ادمین/پشتیبان)",
        description: "در صورت رد کردن، ارسال دلیل الزامی است.",
        tags: ["Marketplace"],
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
            description: "آیدی دیدگاه",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["status"],
                properties: {
                  status: {
                    type: "string",
                    enum: ["approved", "rejected"],
                    example: "approved",
                  },
                  rejectionReason: {
                    type: "string",
                    nullable: true,
                    example: "استفاده از الفاظ رکیک",
                    description: "در صورت رد کردن، ذکر دلیل الزامی است",
                  },
                },
              },
            },
          },
        },
        responses: {
          "200": { description: "وضعیت تغییر کرد" },
          "400": { description: "دلیل رد شدن ارسال نشده است" },
        },
      },
    },
    "/api/marketplace/locations": {
      get: {
        summary: "دریافت لیست شهرها و محلات",
        description: "دریافت تمام شهرهای اصلی به همراه محله‌هایشان (عمومی)",
        tags: ["Marketplace"],
        responses: {
          "200": {
            description: "لیست شهرها",
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/ApiResponse" } },
            },
          },
        },
      },
      post: {
        summary: "ایجاد شهر/محله جدید (فقط ادمین)",
        tags: ["Marketplace"],
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name", "slug"],
                properties: {
                  name: { type: "string", example: "تهران" },
                  slug: { type: "string", example: "tehran" },
                  parentId: {
                    type: "integer",
                    nullable: true,
                    example: null,
                    description: "اگر محله است، آیدی شهر را بدهید",
                  },
                },
              },
            },
          },
        },
        responses: {
          "201": { description: "شهر/محله ایجاد شد" },
          "403": { description: "دسترسی غیرمجاز" },
          "409": { description: "اسلاگ تکراری است" },
        },
      },
    },
  },
};
