import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AuthProxyMiddleware, BoardProxyMiddleware } from './proxy.middleware';

@Module({
  providers: [AuthProxyMiddleware, BoardProxyMiddleware],
})
export class ProxyModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthProxyMiddleware)
      .forRoutes({ path: 'auth/*path', method: RequestMethod.ALL });

    consumer
      .apply(BoardProxyMiddleware)
      .forRoutes({ path: 'posts/*path', method: RequestMethod.ALL });
  }
}
