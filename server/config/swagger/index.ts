import { Application } from "express";
import swaggerUi from "swagger-ui-express";
import { env } from "../env.js";
import { authSwaggerDocs } from "./auth.swagger.js";

const swaggerOptions = {
  openapi: "3.0.0",
  info: {
    title: "Nabz SuperApp API",
    version: "1.0.0",
    description: "مستندات API سوپراپلیکیشن نبض",
  },
  servers: [
    {
      url: `http://localhost:${env.port}/api`,
      description: "Development Server",
    },
  ],
  tags: [
    {
      name: "Authentication",
      description: "مدیریت احراز هویت و ثبت‌نام کاربران",
    },
  ],
  components: {
    schemas: {
      ApiResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          message: { type: "string", example: "Operation successful" },
          body: { type: "object", nullable: true },
          status: { type: "integer", example: 200 },
        },
      },
    },
    securitySchemes: {
      BearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  paths: {
    ...authSwaggerDocs.paths,
  },
};

export function setupSwagger(app: Application): void {
  app.use(
    "/api/docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerOptions, {
      customSiteTitle: "Nabz API Docs",
      customCss: ".swagger-ui .topbar { display: none }",
    }),
  );
}
