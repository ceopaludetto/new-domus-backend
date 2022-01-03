import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";

import type { ContextType } from "@/utils/types";

export const CurrentCondominium = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const { req }: ContextType = GqlExecutionContext.create(ctx).getContext();

  return req.condominium;
});
