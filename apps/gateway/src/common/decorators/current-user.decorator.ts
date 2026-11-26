import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import type {
  AuthUser,
  AuthenticatedRequest,
} from '../interfaces/authenticated-request.interface';

export const CurrentUser = createParamDecorator(
  (_: unknown, context: ExecutionContext): AuthUser =>
    context.switchToHttp().getRequest<AuthenticatedRequest>().user!,
);
