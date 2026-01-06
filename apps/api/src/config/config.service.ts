import { IEnvConfig } from "./env-config.interface";
import dotenv from "dotenv";
import fs from "fs";
import Joi from "joi";

export class ConfigService {
  private readonly envConfig: IEnvConfig;

  constructor() {
    // Start with process.env as base (Docker Compose injects env_file vars here)
    let config: Record<string, any> = { ...process.env };

    // Determine which env files to load based on NODE_ENV
    const env = process.env.NODE_ENV;
    const isProduction = env === "production";
    const isTest = env === "test";

    // In development: .env + .env.local
    // In production: .env.production
    // In test: .env.test
    const envFiles = isProduction
      ? [".env.production", "apps/api/.env.production"]
      : isTest
        ? [".env.test", "apps/api/.env.test"]
        : [".env", ".env.local", "apps/api/.env", "apps/api/.env.local"];

    // Load each env file in order (later files override earlier ones)
    for (const envFile of envFiles) {
      if (fs.existsSync(envFile)) {
        const envConfig = dotenv.parse(fs.readFileSync(envFile));
        config = { ...config, ...envConfig };
      }
    }

    this.envConfig = this.validateInput(config as IEnvConfig);
  }

  public get<K extends keyof IEnvConfig>(key: K): IEnvConfig[K] {
    return this.envConfig[key];
  }

  public getOptional<K extends keyof IEnvConfig>(key: K): IEnvConfig[K] | undefined {
    return this.envConfig[key];
  }

  private validateInput(envConfig: IEnvConfig): IEnvConfig {
    const envVarsSchema: Joi.ObjectSchema = Joi.object({
      PORT: Joi.number().default(3001),

      NODE_ENV: Joi.string()
        .valid("development", "staging", "production", "test")
        .default("development"),

      // MongoDB
      MONGODB_URI: Joi.string().default("mongodb://localhost/api"),

      // Stripe
      STRIPE_SECRET_KEY: Joi.string().required(),
      STRIPE_PRICE_ID: Joi.string().optional().allow(""),
      STRIPE_WEBHOOK_SECRET: Joi.string().optional().allow(""),

      // Clerk
      CLERK_SECRET_KEY: Joi.string().required(),

      // Admin
      ADMIN_EMAIL_ALLOWLIST: Joi.string().optional().allow(""),

      // App URLs
      APP_URL: Joi.string().optional().allow(""),
      NEXT_PUBLIC_APP_URL: Joi.string().optional().allow(""),
    });

    const { error, value: validatedEnvConfig } = envVarsSchema.validate(envConfig, {
      allowUnknown: true, // Allow unknown env vars (like NVM_INC) in all environments
      stripUnknown: false, // Keep unknown vars for debugging
    });

    if (error) {
      throw new Error(`Config validation error: ${error.message}`);
    }

    return validatedEnvConfig as IEnvConfig;
  }

  get isDevelopment(): boolean {
    return Boolean(this.envConfig.NODE_ENV === "development");
  }

  get isStaging(): boolean {
    return Boolean(this.envConfig.NODE_ENV === "staging");
  }

  get isProduction(): boolean {
    return Boolean(this.envConfig.NODE_ENV === "production");
  }

  get mongoURL(): string {
    return this.envConfig.MONGODB_URI;
  }
}
