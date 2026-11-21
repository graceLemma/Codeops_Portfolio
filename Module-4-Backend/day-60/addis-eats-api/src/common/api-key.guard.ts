import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const configuredKey = process.env.API_KEY;
    if (!configuredKey) {
      throw new InternalServerErrorException('API_KEY is not configured');
    }

    const request = context.switchToHttp().getRequest<Request>();
    const providedKey = request.headers['x-api-key'];
    if (!providedKey) {
      throw new UnauthorizedException('API key is required');
    }
    if (providedKey !== configuredKey) {
      throw new ForbiddenException('API key is invalid');
    }
    return true;
  }
}
