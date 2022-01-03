import { Field, InputType } from "@nestjs/graphql";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

import { Trim } from "@/utils/transformers";

@InputType()
export class AuthenticateUserInput {
  @Trim()
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  @Field()
  public email!: string;

  @IsString()
  @IsNotEmpty()
  @Field()
  public password!: string;
}
