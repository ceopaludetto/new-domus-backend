import { Injectable, ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { AuthGuard } from "@nestjs/passport";
import { AuthenticationError } from "apollo-server-express";
import type { Request, Response } from "express";

import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/utils/constants";

import { AuthenticationService } from "./authentication.service";
import { fromAccessTokenHeader } from "./strategies/extractor";

@Injectable()
export class GqlAuthGuard extends AuthGuard("jwt") {
  public constructor(private readonly authenticationService: AuthenticationService) {
    super();
  }

  public getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }

  public async flushRefreshCookie(request: Request, response: Response) {
    const refreshCookie = request.cookies[REFRESH_TOKEN];

    if (refreshCookie) {
      const [bearer, refreshToken] = refreshCookie.split(" ");

      if (bearer.trim() !== "Bearer") {
        throw new AuthenticationError("Token mal-formatado");
      }

      const decoded: { id: string; password: string } = await this.authenticationService.verifyToken(refreshToken);

      const user = await this.authenticationService.getByRefreshToken(decoded);

      const newTokens = await this.authenticationService.generateTokens(user);

      this.authenticationService.setTokensInResponse(newTokens, response);
      request.cookies[REFRESH_TOKEN] = `Bearer ${newTokens.refreshToken}`;
      request.headers[ACCESS_TOKEN.toLowerCase()] = `Bearer ${newTokens.accessToken}`;
    }
  }

  public async canActivate(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    const { req, res }: { req: Request; res: Response } = ctx.getContext();

    const accessToken = fromAccessTokenHeader(req);

    if (!accessToken) {
      await this.flushRefreshCookie(req, res);
    } else {
      try {
        await this.authenticationService.verifyToken(accessToken);
      } catch (error) {
        if (!error.expiredAt) throw new AuthenticationError("Token incorreto");

        await this.flushRefreshCookie(req, res);
      }
    }

    return super.canActivate(context) as boolean;
  }
}
