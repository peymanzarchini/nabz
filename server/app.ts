import { createServer } from "http";
import { Server as SocketServer } from "socket.io";
import jwt from "jsonwebtoken";
import { AuthenticatedJwtPayload } from "./types/index.js";
import express, { Application } from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import path from "path";

import { env } from "./config/env.js";
import { setupAssociations } from "./config/associations.js";
import { closeDB, connectDB } from "./config/database.js";
import { logger, morganStream } from "./config/logger.js";
import { responseMiddleware } from "./middlewares/response.middleware.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import routes from "./routes/index.js";
import { setupSwagger } from "./config/swagger/index.js";
import { Auth } from "./modules/auth/model/auth.model.js";
import { Conversation } from "./modules/marketplace/models/conversation.model.js";
import { Op } from "@sequelize/core";

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

setupSwagger(app);

app.use((_req, res) => {
  res.fail("Route not found", null, 404);
});

app.use(errorHandler);

const httpServer = createServer(app);

const io = new SocketServer(httpServer, {
  cors: {
    origin: env.clientUrl,
    credentials: true,
  },
});

io.use((socket, next) => {
  try {
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.headers?.cookie?.split("access_token=")[1]?.split(";")[0];
    if (!token) {
      return next(new Error("توکن دسترسی الزامی است"));
    }

    const decoded = jwt.verify(token, env.jwt.secret) as AuthenticatedJwtPayload;
    socket.data.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };
    next();
  } catch (error) {
    logger.error("Socket Auth Error:", error);

    if (error instanceof jwt.TokenExpiredError) {
      return next(new Error("توکن شما منقضی شده است. لطفاً دوباره وارد شوید."));
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new Error("توکن نامعتبر است."));
    }

    return next(new Error("احراز هویت سوکت ناموفق بود"));
  }
});

io.on("connection", (socket) => {
  const userId = socket.data.user.id;
  console.log(`🟢 User connected: ${userId}`);

  socket.join(`user:${userId}`);

  Auth.update({ lastSeen: null }, { where: { id: userId } });

  Conversation.findAll({
    where: { [Op.or]: [{ buyerId: userId }, { sellerId: userId }] },
    attributes: ["id"],
  }).then((convs) => {
    convs.forEach((conv) => {
      socket.join(conv.id);
      socket.to(conv.id).emit("user_status", { userId, isOnline: true });
    });
  });

  socket.on("typing", (data: { conversationId: string; userId: string }) => {
    socket.to(data.conversationId).emit("typing", { userId: data.userId });
  });

  socket.on("stop_typing", (data: { conversationId: string }) => {
    socket.to(data.conversationId).emit("stop_typing");
  });

  socket.on("seen", (data: { conversationId: string; userId: string }) => {
    socket
      .to(data.conversationId)
      .emit("seen", { conversationId: data.conversationId, userId: data.userId });
  });

  socket.on("disconnect", () => {
    console.log(`🔴 User disconnected: ${userId}`);
    const lastSeen = new Date();

    Auth.update({ lastSeen }, { where: { id: userId } });

    Conversation.findAll({
      where: { [Op.or]: [{ buyerId: userId }, { sellerId: userId }] },
      attributes: ["id"],
    }).then((convs) => {
      convs.forEach((conv) => {
        io.to(conv.id).emit("user_status", { userId, isOnline: false, lastSeen });
      });
    });
  });
});

const startServer = async (): Promise<void> => {
  try {
    setupAssociations();
    await connectDB();

    app.set("io", io);
    httpServer.listen(env.port, () => {
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
