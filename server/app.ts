import express, { Application } from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import path from "path";

import { env } from "./config/env.js";
import { closeDB, connectDB } from "./config/database.js";
import { logger, morganStream } from "./config/logger.js";
import { responseMiddleware } from "./middlewares/response.middleware.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import routes from "./routes/index.js";

const app: Application = express();

app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(
  cors({
    origin: env.clientUrl,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(
  morgan(env.isDev ? "dev" : "combined", {
    stream: morganStream,
    skip: () => env.isTest,
  }),
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many requests from this IP, please try again later.",
});
app.use("/api", limiter);

app.use(responseMiddleware);
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use("/api", routes);

app.use((_req, res) => {
  res.fail("Route not found", null, 404);
});

app.use(errorHandler);

const startServer = async (): Promise<void> => {
  try {
    await connectDB();
    app.listen(env.port, () => {
      logger.info(`🚀 Server running on port ${env.port}`);
      logger.info(`📍 Environment: ${env.nodeEnv}`);
      logger.info(`🔗 API URL: http://localhost:${env.port}/api`);
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
};

process.on("SIGTERM", async () => {
  logger.info("SIGTERM received. Shutting down gracefully...");
  await closeDB();
  process.exit(0);
});

process.on("SIGINT", async () => {
  logger.info("SIGINT received. Shutting down gracefully...");
  await closeDB();
  process.exit(0);
});

startServer();

export { app };
