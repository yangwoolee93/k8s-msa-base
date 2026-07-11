import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class UserIdHeaderGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<{ headers: Record<string, string | string[] | undefined> }>();
    const raw = request.headers['x-user-id'];

    if (typeof raw !== 'string' || raw.trim() === '') {
      throw new UnauthorizedException('Missing x-user-id header');
    }

    const userId = Number(raw);
    if (!Number.isInteger(userId) || userId <= 0) {
      throw new BadRequestException('Invalid x-user-id header');
    }

    return true;
  }
}
