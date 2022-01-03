import { UseGuards } from "@nestjs/common";
import { Args, Context, Mutation, Resolver, Query } from "@nestjs/graphql";

import { User } from "@/models";
import { MapFields } from "@/utils/plugins/map";
import type { ContextType, Mapped } from "@/utils/types";

import { AddUserInput } from "../user";
import { CurrentUser } from "./authentication.decorator";
import { AuthenticateUserInput } from "./authentication.dto";
import { AuthenticationGuard } from "./authentication.guard";
import { AuthenticationService } from "./authentication.service";

@Resolver(() => User)
export class AuthenticationResolver {
  public constructor(private readonly authenticationService: AuthenticationService) {}

  @Mutation(() => User)
  public async login(
    @Args("input") data: AuthenticateUserInput,
    @Context() { res }: ContextType,
    @MapFields() mapped?: Mapped<User>
  ) {
    return this.authenticationService.login(res, data, mapped);
  }

  @Mutation(() => User)
  public async register(
    @Args("input") data: AddUserInput,
    @Context() { res }: ContextType,
    @MapFields() mapped?: Mapped<User>
  ) {
    return this.authenticationService.register(res, data, mapped);
  }

  @UseGuards(AuthenticationGuard)
  @Query(() => User)
  public async profile(@CurrentUser() { id }: User, @MapFields() mapped?: Mapped<User>) {
    return this.authenticationService.findUserByTokenID(id, mapped);
  }

  @UseGuards(AuthenticationGuard)
  @Mutation(() => Boolean)
  public async evictRefresh(@Context() { res }: ContextType) {
    res.clearCookie("RefreshToken");
    return true;
  }
}
