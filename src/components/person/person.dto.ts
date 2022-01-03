import { Field, InputType } from "@nestjs/graphql";
import { Type } from "class-transformer";
import { IsDate, IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";

import { RemoveMask } from "@/utils/transformers";

import { AddCondominium } from "../condominium";

@InputType()
export class AddPersonInput {
  @IsString()
  @IsNotEmpty()
  @Field()
  public firstName!: string;

  @IsString()
  @IsNotEmpty()
  @Field()
  public lastName!: string;

  @RemoveMask()
  @IsString()
  @IsNotEmpty()
  @Field()
  public cpf!: string;

  @IsDate()
  @IsNotEmpty()
  @Field()
  public birthDate!: Date;

  @RemoveMask()
  @IsString()
  @IsOptional()
  @Field()
  public phone?: string;

  @Type(() => AddCondominium)
  @ValidateNested({ each: true })
  @Field(() => [AddCondominium], { nullable: true })
  public condominiums?: AddCondominium[];
}
