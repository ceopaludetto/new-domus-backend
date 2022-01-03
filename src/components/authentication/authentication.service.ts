import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import bcrypt from "bcryptjs";
import type { Response } from "express";
import ms from "ms";

import type { User } from "@/models";
import type { Mapped } from "@/utils/types";

import { UserService, AddUserInput } from "../user";
import type { AuthenticateUserInput } from "./authentication.dto";

@Injectable()
export class AuthenticationService {
  public constructor(private readonly userService: UserService, private readonly jwtService: JwtService) {}

  public async login(response: Response, { email, password }: AuthenticateUserInput, mapped?: Mapped<User>) {
    const user = await this.userService.findByEmail(email, mapped);
    if (!user) throw new NotFoundException("User not found");
    if (!(await user.comparePassword(password))) throw new UnauthorizedException("Incorrect password");

    const tokens = await this.generateTokens(user);
    await this.attachTokensToResponse(response, tokens);

    return user;
  }

  public async register(response: Response, { password, ...rest }: AddUserInput, mapped?: Mapped<User>) {
    const hash = await bcrypt.hash(password, 10);
    const user = await this.userService.create({ password: hash, ...rest }, mapped);

    const tokens = await this.generateTokens(user);
    await this.attachTokensToResponse(response, tokens);

    return user;
  }

  public async generateTokens(user: User) {
    const accessToken = await this.jwtService.signAsync({ id: user.id });
    const refreshToken = await this.jwtService.signAsync({ id: user.id, password: user.password }, { expiresIn: "7d" });

    return [accessToken, refreshToken] as const;
  }

  public attachTokensToResponse(response: Response, tokens: readonly [string, string]) {
    const [access, refresh] = tokens;

    response.header("AccessToken", access);
    response.cookie("RefreshToken", refresh, { httpOnly: true, maxAge: ms("7d") });
  }

  public async findUserByTokenID(id: string, mapped?: Mapped<User>) {
    return this.userService.findOne(id, mapped);
  }

  public async verifyToken(token: string) {
    return this.jwtService.verifyAsync(token);
  }

  public async getByRefreshToken(decoded: { id: string; password: string }, mapped?: Mapped<User>) {
    const user = await this.userService.findOne(decoded?.id, mapped);
    if (user?.password !== decoded.password) throw new UnauthorizedException("Refresh token are not valid");

    return user;
  }
}
