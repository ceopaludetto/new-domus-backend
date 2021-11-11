import { Args, Mutation, Resolver } from "@nestjs/graphql";

import { User } from "@/models";

import { AddUserInput, AuthenticateUserInput } from "./authentication.dto";
import { AuthenticationService } from "./authentication.service";

@Resolver(() => User)
export class AuthenticationResolver {
  public constructor(private readonly authenticationService: AuthenticationService) {}

  @Mutation(() => User)
  public async login(@Args("input") data: AuthenticateUserInput) {
    return this.authenticationService.login(data);
  }

  @Mutation(() => User)
  public async register(@Args("input") data: AddUserInput) {
    return this.authenticationService.register(data);
  }
}
