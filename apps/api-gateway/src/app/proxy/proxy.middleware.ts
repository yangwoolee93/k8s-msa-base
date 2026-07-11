import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NextFunction, Request, Response } from 'express';
import {
  createProxyMiddleware,
  Options,
  RequestHandler,
} from 'http-proxy-middleware';

function createProxy(target: string, pathPrefix: string): RequestHandler {
  const options: Options = {
    target,
    changeOrigin: true,
    pathFilter: (pathname) => pathname.startsWith(pathPrefix),
  };
  return createProxyMiddleware(options);
}

@Injectable()
export class AuthProxyMiddleware implements NestMiddleware {
  private readonly proxy: RequestHandler;

  constructor(config: ConfigService) {
    this.proxy = createProxy(
      config.getOrThrow<string>('USER_AUTH_URL'),
      '/auth',
    );
  }

  async use(req: Request, res: Response, next: NextFunction): Promise<void> {
    await this.proxy(req, res, next);
  }
}

@Injectable()
export class BoardProxyMiddleware implements NestMiddleware {
  private readonly proxy: RequestHandler;

  constructor(config: ConfigService) {
    this.proxy = createProxy(config.getOrThrow<string>('BOARD_URL'), '/posts');
  }

  async use(req: Request, res: Response, next: NextFunction): Promise<void> {
    await this.proxy(req, res, next);
  }
}
