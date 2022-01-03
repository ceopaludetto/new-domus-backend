import { CanActivate, ExecutionContext, Injectable, NotFoundException } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";

import { Extract } from "@/utils/extractors";
import type { ContextType } from "@/utils/types";

@Injectable()
export class CondominiumGuard implements CanActivate {
  public canActivate(context: ExecutionContext) {
    const { req }: ContextType = GqlExecutionContext.create(context).getContext();
    const condominium = Extract.condominium(req);

    if (!condominium) throw new NotFoundException("Condominium not found");

    req.condominium = condominium;

    return true;
  }
}
