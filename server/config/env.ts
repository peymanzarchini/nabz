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
  COOKIE_SAME_SITE: z.enum(["strict", "lax", "none"]).default("strict"),
  COOKIE_DOMAIN: z.string().optional(),

  CLIENT_URL: z.string().default("http://localhost:3000"),
  EMAIL_USER: z.string().default("peymanzarchini@outlook.com"),
  EMAIL_PASSWORD: z.string().min(10, "EMAIL_PASSWORD must be at least 10 characters"),
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

  cookie: {
    secret: parsedEnv.data.COOKIE_SECRET,
    secure: parsedEnv.data.NODE_ENV === "production",
    sameSite: parsedEnv.data.COOKIE_SAME_SITE,
    domain: parsedEnv.data.COOKIE_DOMAIN,
  },
  clientUrl: parsedEnv.data.CLIENT_URL,
  email: {
    user: parsedEnv.data.EMAIL_USER,
    password: parsedEnv.data.EMAIL_PASSWORD,
  },
  isDev: parsedEnv.data.NODE_ENV === "development",
  isProd: parsedEnv.data.NODE_ENV === "production",
  isTest: parsedEnv.data.NODE_ENV === "test",
} as const;
