import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { METADATA_KEYS } from '../../common/constants/metadata.constants';
import type { AuthenticatedRequest } from '../../common/interfaces/authenticated-request.interface';
import { AUTH_MESSAGES, BEARER_SCHEME } from '../constants/auth.constants';
import type { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (this.isPublic(context)) {
      return true;
    }
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const payload = await this.verify(this.extractToken(request));
    request.user = { id: payload.sub };
    return true;
  }

  private isPublic(context: ExecutionContext): boolean {
    return (
      this.reflector.getAllAndOverride<boolean | undefined>(
        METADATA_KEYS.isPublic,
        [context.getHandler(), context.getClass()],
      ) === true
    );
  }

  private extractToken(request: AuthenticatedRequest): string {
    const [scheme, token] = request.headers.authorization?.split(' ') ?? [];
    if (scheme !== BEARER_SCHEME || !token) {
      throw new UnauthorizedException(AUTH_MESSAGES.unauthorized);
    }
    return token;
  }

  private verify(token: string): Promise<JwtPayload> {
    return this.jwtService.verifyAsync<JwtPayload>(token).catch(() => {
      throw new UnauthorizedException(AUTH_MESSAGES.unauthorized);
    });
  }
}
