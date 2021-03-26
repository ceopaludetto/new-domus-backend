import { InputType, Field, PartialType } from "@nestjs/graphql";
import { Type } from "class-transformer";
import { IsOptional, IsString, MaxLength, ValidateNested } from "class-validator";

import { AddressInsertInput } from "@/components/address";
import { RuleInsertInput } from "@/components/rule";
import { RemoveMask } from "@/utils/transforms";
import { IsCNPJ } from "@/utils/validations/is.cnpj";
import * as Messages from "@/utils/validations/messages";

@InputType()
export class CondominiumInsertInput {
  @Field()
  @IsString({ message: Messages.STRING })
  public companyName!: string;

  @Field()
  @IsCNPJ()
  @IsString({ message: Messages.STRING })
  @MaxLength(14, { message: Messages.MAX_LENGTH })
  @RemoveMask()
  public cnpj!: string;

  @Field({ defaultValue: "#" })
  @IsString({ message: Messages.STRING })
  @MaxLength(1, { message: Messages.MAX_LENGTH })
  public character?: string;

  @Field(() => AddressInsertInput)
  @ValidateNested()
  @Type(() => AddressInsertInput)
  public address!: AddressInsertInput;

  @Field(() => [RuleInsertInput], { nullable: true })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => RuleInsertInput)
  public rules?: RuleInsertInput[];
}

@InputType()
export class CondominiumUpdateInput extends PartialType(CondominiumInsertInput) {}
