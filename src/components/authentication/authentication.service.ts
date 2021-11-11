import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import bcrypt from "bcryptjs";

import { UserService } from "../user";
import type { AddUserInput, AuthenticateUserInput } from "./authentication.dto";

@Injectable()
export class AuthenticationService {
  public constructor(private readonly userService: UserService) {}

  public async login({ email, password }: AuthenticateUserInput) {
    const user = await this.userService.findByEmail(email);
    if (!user) throw new NotFoundException("User not found");
    if (!(await user.comparePassword(password))) throw new UnauthorizedException("Incorrect password");

    return user;
  }

  public async register({ password, ...rest }: AddUserInput) {
    const hash = await bcrypt.hash(password, 10);

    return this.userService.create({ password: hash, ...rest });
  }
}
