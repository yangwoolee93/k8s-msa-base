import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './apps/board/src/db/schema.ts',
  out: './apps/board/drizzle',
  dialect: 'mysql',
  dbCredentials: {
    url: process.env.BOARD_DATABASE_URL!,
  },
});
