import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";

import type { ContextType } from "@/utils/types";

export const CurrentUser = createParamDecorator((data: unknown, context: ExecutionContext) => {
  const { req }: ContextType = GqlExecutionContext.create(context).getContext();

  return req.user;
});
