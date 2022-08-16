import { GqlExecutionContext } from '@nestjs/graphql';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const AuthUser = createParamDecorator(
  (data: unknown, contex: ExecutionContext) => {
    const gqlContext = GqlExecutionContext.create(contex).getContext();
    const user = gqlContext['user'];
    return user;
  },
);
