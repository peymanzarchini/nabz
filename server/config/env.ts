import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().default(5000),
  DB_HOST: z.string().default("localhost"),
  DB_PORT: z.coerce.number().default(3306),
  DB_NAME: z.string().default("nabz"),
  DB_USER: z.string().default("root"),
  DB_PASS: z.string().default(""),
  JWT_SECRET: z.string().min(10, "JWT_SECRET must be at least 10 characters"),
  JWT_EXPIRE_IN: z.string().default("1h"),
  JWT_REFRESH_SECRET: z.string().min(10, "JWT_REFRESH_SECRET must be at least 10 characters"),
  JWT_REFRESH_EXPIRES_IN: z.string().default("7d"),
  COOKIE_SECRET: z.string().default("super-secret-cookie"),
  CLIENT_URL: z.string().default("http://localhost:3000"),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("❌ Invalid environment variables:", parsedEnv.error.format());
  process.exit(1);
}

export const env = {
  nodeEnv: parsedEnv.data.NODE_ENV,
  port: parsedEnv.data.PORT,
  db: {
    host: parsedEnv.data.DB_HOST,
    port: parsedEnv.data.DB_PORT,
    name: parsedEnv.data.DB_NAME,
    user: parsedEnv.data.DB_USER,
    password: parsedEnv.data.DB_PASS,
  },
  jwt: {
    secret: parsedEnv.data.JWT_SECRET,
    expiresIn: parsedEnv.data.JWT_EXPIRE_IN,
    refreshSecret: parsedEnv.data.JWT_REFRESH_SECRET,
    refreshExpiresIn: parsedEnv.data.JWT_REFRESH_EXPIRES_IN,
  },
  clientUrl: parsedEnv.data.CLIENT_URL,
  isDev: parsedEnv.data.NODE_ENV === "development",
  isProd: parsedEnv.data.NODE_ENV === "production",
  isTest: parsedEnv.data.NODE_ENV === "test",
} as const;
