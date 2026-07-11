import { ConfigService } from '@nestjs/config';
import { drizzle, MySql2Database } from 'drizzle-orm/mysql2';
import { createPool } from 'mysql2/promise';
import * as schema from './schema';

export const DRIZZLE = Symbol('DRIZZLE');

export type DrizzleDB = MySql2Database<typeof schema>;

export const databaseProvider = {
  provide: DRIZZLE,
  inject: [ConfigService],
  useFactory: (config: ConfigService): DrizzleDB => {
    const url = config.getOrThrow<string>('USER_AUTH_DATABASE_URL');
    const pool = createPool(url);
    return drizzle(pool, { schema, mode: 'default' });
  },
};
