export const marketplaceSwaggerDocs = {
  paths: {
    "/api/marketplace/categories": {
      get: {
        summary: "دریافت لیست دسته‌بندی‌ها",
        tags: ["Marketplace"],
        responses: { "200": { description: "لیست دسته‌بندی‌ها" } },
      },
      post: {
        summary: "ایجاد دسته‌بندی جدید (فقط ادمین)",
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
                  parentId: {
                    type: "string",
                    format: "uuid",
                    nullable: true,
                    description: "UUID دسته والد",
                  }, // تغییر کرد
                  icon: { type: "string", nullable: true },
                  specsSchema: { type: "object", nullable: true },
                },
              },
            },
          },
        },
        responses: { "201": { description: "دسته‌بندی ایجاد شد" } },
      },
    },
    "/api/marketplace/categories/{id}": {
      patch: {
        summary: "ویرایش دسته‌بندی (فقط ادمین)",
        tags: ["Marketplace"],
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } },
        ], // تغییر کرد
        responses: { "200": { description: "دسته‌بندی ویرایش شد" } },
      },
      delete: {
        summary: "حذف دسته‌بندی (فقط ادمین)",
        tags: ["Marketplace"],
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } },
        ], // تغییر کرد
        responses: { "200": { description: "دسته‌بندی حذف شد" } },
      },
    },

    "/api/marketplace/listings": {
      get: {
        summary: "گرفتن لیست آگهی‌ها (جستجو، فیلتر و صفحه‌بندی)",
        tags: ["Marketplace"],
        parameters: [
          { name: "page", in: "query", schema: { type: "integer" } },
          { name: "limit", in: "query", schema: { type: "integer" } },
          { name: "search", in: "query", schema: { type: "string" } },
          { name: "categoryId", in: "query", schema: { type: "string", format: "uuid" } }, // تغییر کرد
          { name: "cityId", in: "query", schema: { type: "string", format: "uuid" } }, // تغییر کرد
          { name: "minPrice", in: "query", schema: { type: "number" } },
          { name: "maxPrice", in: "query", schema: { type: "number" } },
          { name: "condition", in: "query", schema: { type: "string", enum: ["new", "used"] } },
          {
            name: "isAmazingOffer",
            in: "query",
            schema: { type: "string", enum: ["true", "false"] },
          },
          {
            name: "sort",
            in: "query",
            schema: { type: "string", enum: ["newest", "cheapest", "expensive", "top_rated"] },
          },
        ],
        responses: { "200": { description: "لیست آگهی‌ها" } },
      },
      post: {
        summary: "ساخت آگهی جدید (فقط فروشندگان)",
        tags: ["Marketplace"],
        security: [{ BearerAuth: [] }],
        consumes: ["multipart/form-data"],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                required: ["title", "description", "condition", "cityId", "categoryId", "variants"],
                properties: {
                  title: { type: "string" },
                  description: { type: "string" },
                  condition: { type: "string", enum: ["new", "used"] },
                  cityId: { type: "string", format: "uuid", description: "UUID شهر" }, // تغییر کرد
                  districtId: { type: "string", format: "uuid", nullable: true }, // تغییر کرد
                  categoryId: { type: "string", format: "uuid" }, // تغییر کرد
                  specs: { type: "string", description: "JSON String" },
                  variants: { type: "string", description: "JSON String" },
                  images: { type: "array", items: { type: "string", format: "binary" } },
                },
              },
            },
          },
        },
        responses: { "201": { description: "آگهی ساخته شد" } },
      },
    },

    "/api/marketplace/listings/{id}": {
      get: {
        summary: "دریافت جزئیات یک آگهی",
        description: "پارامتر id می‌تواند یک UUID معتبر و یا اسلاگ (Slug) آگهی باشد.",
        tags: ["Marketplace"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "UUID یا Slug آگهی",
          },
        ], // تغییر کرد
        responses: { "200": { description: "جزئیات آگهی" } },
      },
      patch: {
        summary: "ویرایش آگهی",
        tags: ["Marketplace"],
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } },
        ], // تغییر کرد
        responses: { "200": { description: "آگهی ویرایش شد" } },
      },
      delete: {
        summary: "حذف آگهی",
        tags: ["Marketplace"],
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } },
        ], // تغییر کرد
        responses: { "200": { description: "آگهی حذف شد" } },
      },
    },

    "/api/marketplace/listings/{id}/status": {
      patch: {
        summary: "تغییر وضعیت آگهی (ادمین)",
        tags: ["Marketplace"],
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } },
        ], // تغییر کرد
        responses: { "200": { description: "وضعیت تغییر کرد" } },
      },
    },
    "/api/marketplace/listings/{id}/offer": {
      patch: {
        summary: "شگفت‌انگیز کردن آگهی (ادمین)",
        tags: ["Marketplace"],
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } },
        ], // تغییر کرد
        responses: { "200": { description: "وضعیت شگفت‌انگیز تغییر کرد" } },
      },
    },
    "/api/marketplace/listings/{id}/images": {
      delete: {
        summary: "حذف یک عکس از گالری آگهی",
        tags: ["Marketplace"],
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } },
        ], // تغییر کرد
        responses: { "200": { description: "عکس حذف شد" } },
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
            schema: { type: "string", format: "uuid" },
            description: "UUID آگهی",
          },
        ], // تغییر کرد
        responses: { "200": { description: "لیست نظرات" } },
      },
      post: {
        summary: "ثبت دیدگاه جدید",
        tags: ["Marketplace"],
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
            description: "UUID آگهی",
          },
        ], // تغییر کرد
        responses: { "201": { description: "دیدگاه ثبت شد" } },
      },
    },
    "/api/marketplace/reviews/pending": {
      get: {
        summary: "دریافت دیدگاه‌های در انتظار تایید (ادمین)",
        tags: ["Marketplace"],
        security: [{ BearerAuth: [] }],
        responses: { "200": { description: "لیست دیدگاه‌ها" } },
      },
    },
    "/api/marketplace/reviews/{id}/status": {
      patch: {
        summary: "تایید یا رد دیدگاه (ادمین)",
        tags: ["Marketplace"],
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
            description: "UUID دیدگاه",
          },
        ], // تغییر کرد
        responses: { "200": { description: "وضعیت تغییر کرد" } },
      },
    },
    "/api/marketplace/locations": {
      get: {
        summary: "دریافت لیست شهرها و محلات",
        tags: ["Marketplace"],
        responses: { "200": { description: "لیست شهرها" } },
      },
      post: {
        summary: "ایجاد شهر/محله جدید (ادمین)",
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
                  name: { type: "string" },
                  slug: { type: "string" },
                  parentId: {
                    type: "string",
                    format: "uuid",
                    nullable: true,
                    description: "UUID شهر والد",
                  }, // تغییر کرد
                },
              },
            },
          },
        },
        responses: { "201": { description: "شهر/محله ایجاد شد" } },
      },
    },
  },
};
