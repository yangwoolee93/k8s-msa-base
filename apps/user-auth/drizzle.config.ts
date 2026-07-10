import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './apps/user-auth/src/db/schema.ts',
  out: './apps/user-auth/drizzle',
  dialect: 'mysql',
  dbCredentials: {
    url: process.env.USER_AUTH_DATABASE_URL!,
  },
});
