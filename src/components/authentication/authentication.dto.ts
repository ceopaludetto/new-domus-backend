import { InputType, Field, OmitType } from "@nestjs/graphql";
import { IsString, IsUrl, IsOptional } from "class-validator";

import * as Messages from "@/utils/validations/messages";

@InputType()
export class AuthenticationInput {
  @Field()
  @IsString({ message: Messages.STRING })
  public login!: string;

  @Field()
  @IsString({ message: Messages.STRING })
  public password!: string;
}

@InputType()
export class ChangePasswordInput {
  @Field()
  @IsString({ message: Messages.STRING })
  public currentPassword!: string;

  @Field()
  @IsString({ message: Messages.STRING })
  public newPassword!: string;
}

@InputType()
export class ForgotInput extends OmitType(AuthenticationInput, ["password"]) {
  @Field()
  @IsOptional()
  @IsString({ message: Messages.STRING })
  @IsUrl({ require_protocol: true, require_tld: process.env.NODE_ENV === "production" })
  public callback!: string;
}
