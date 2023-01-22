import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequestUser } from './models/request-user.model';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): RequestUser => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);