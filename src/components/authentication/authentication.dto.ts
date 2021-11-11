import { Field, InputType } from "@nestjs/graphql";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

@InputType()
export class AddUserInput {
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

@InputType()
export class AuthenticateUserInput {
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
