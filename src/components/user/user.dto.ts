import { Field, InputType } from "@nestjs/graphql";
import { IsEmail, IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";

import { Trim } from "@/utils/transformers";

import { AddPersonInput } from "../person";

@InputType()
export class AddUserInput {
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

  @IsOptional()
  @ValidateNested()
  @Field(() => AddPersonInput, { nullable: true })
  public person?: AddPersonInput;
}
