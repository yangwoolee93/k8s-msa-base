import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUserId = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): number => {
    const request = ctx.switchToHttp().getRequest<{ headers: Record<string, string | string[] | undefined> }>();
    const raw = request.headers['x-user-id'];

    if (typeof raw !== 'string' || raw.trim() === '') {
      return NaN;
    }

    return Number(raw);
  },
);
