import { Injectable, ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { AuthGuard } from "@nestjs/passport";
import { AuthenticationError } from "apollo-server-express";
import type { Request, Response } from "express";

import { Extract } from "@/utils/extractors";
import type { ContextType } from "@/utils/types";

import { AuthenticationService } from "./authentication.service";

@Injectable()
export class AuthenticationGuard extends AuthGuard("jwt") {
  public constructor(private readonly authenticationService: AuthenticationService) {
    super();
  }

  public getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }

  public async flushRefreshCookie(request: Request, response: Response) {
    const refreshCookie = Extract.refreshToken(request);

    if (refreshCookie) {
      const decoded: { id: string; password: string } = await this.authenticationService.verifyToken(refreshCookie);

      const user = await this.authenticationService.getByRefreshToken(decoded);
      const newTokens = await this.authenticationService.generateTokens(user);

      this.authenticationService.attachTokensToResponse(response, newTokens);
      const [accessToken, refreshToken] = newTokens;

      request.cookies.RefreshToken = refreshToken;
      request.headers.authorization = `Bearer ${accessToken}`;
    }
  }

  public async canActivate(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    const { req, res }: ContextType = ctx.getContext();

    const accessToken = Extract.accessToken(req);

    if (!accessToken) {
      await this.flushRefreshCookie(req, res);

      return super.canActivate(context) as boolean;
    }

    try {
      await this.authenticationService.verifyToken(accessToken);
    } catch (error) {
      if (!(error as any).expiredAt) throw new AuthenticationError("Incorrect token");

      await this.flushRefreshCookie(req, res);
    }

    return super.canActivate(context) as boolean;
  }
}
