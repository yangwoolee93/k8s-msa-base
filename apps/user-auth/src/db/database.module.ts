import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { databaseProvider } from './database.provider';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        join(process.cwd(), '.env'),
        join(process.cwd(), 'apps/user-auth/.env'),
      ],
    }),
  ],
  providers: [databaseProvider],
  exports: [databaseProvider],
})
export class DatabaseModule {}
