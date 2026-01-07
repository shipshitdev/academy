import { createParamDecorator, type ExecutionContext } from '@nestjs/common';

import type { CurrentUserPayload } from '../../types/current-user-payload.interface';

export type { CurrentUserPayload } from '../../types/current-user-payload.interface';

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): CurrentUserPayload => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
