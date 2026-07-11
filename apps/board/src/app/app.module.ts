import { Module } from '@nestjs/common';
import { DatabaseModule } from '../db/database.module';
import { HealthController } from './health.controller';
import { PostsModule } from './posts/posts.module';

@Module({
  imports: [DatabaseModule, PostsModule],
  controllers: [HealthController],
})
export class AppModule {}
