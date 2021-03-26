import { InputType, Field, PartialType } from "@nestjs/graphql";
import { IsOptional, IsString } from "class-validator";

import { Trim } from "@/utils/transforms";
import { IsShortID } from "@/utils/validations";
import * as Messages from "@/utils/validations/messages";

@InputType()
export class RuleInsertInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsShortID()
  @IsString()
  public id?: string;

  @Field()
  @Trim()
  @IsString({ message: Messages.STRING })
  public description!: string;
}

@InputType()
export class RuleUpdateInput extends PartialType(RuleInsertInput) {}
