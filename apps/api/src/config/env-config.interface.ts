export interface IEnvConfig {
  PORT: number;
  NODE_ENV: 'development' | 'staging' | 'production' | 'test';

  // MongoDB
  MONGODB_URI: string;

  // Stripe
  STRIPE_SECRET_KEY: string;
  STRIPE_PRICE_ID?: string;
  STRIPE_WEBHOOK_SECRET?: string;

  // Clerk
  CLERK_SECRET_KEY: string;

  // Admin
  ADMIN_EMAIL_ALLOWLIST?: string;

  // App URLs
  APP_URL?: string;
  NEXT_PUBLIC_APP_URL?: string;
}
