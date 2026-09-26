import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Custom parameter decorator that extracts the authenticated user
 * (or a single field of it) from the request object.
 *
 * Usage:
 *   @User() user: UserType  -> the full user object
 *   @User('id') id: number  -> only the "id" field
 */
export const User = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    // If a field name was provided, return only that field; otherwise the whole user.
    return data ? request.user[data] : request.user;
  },
);
