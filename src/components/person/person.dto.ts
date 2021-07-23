import { InputType, Field, PartialType, OmitType } from "@nestjs/graphql";
import { Type } from "class-transformer";
import { IsString, IsEmail, IsEnum, IsDate, ValidateNested, IsPhoneNumber } from "class-validator";

import { CondominiumInsertInput } from "@/components/condominium";
import { Gender } from "@/utils/enums";
import { RemoveMask, Trim, Mail } from "@/utils/transforms";
import { IsCPF } from "@/utils/validations/is.cpf";
import * as Messages from "@/utils/validations/messages";

@InputType()
export class PersonInsertInput {
  @Field()
  @IsString({ message: Messages.STRING })
  @Trim()
  public name!: string;

  @Field()
  @IsString({ message: Messages.STRING })
  @Trim()
  public lastName!: string;

  @Field()
  @IsString({ message: Messages.STRING })
  @IsEmail(undefined, { message: Messages.EMAIL })
  @Mail()
  public email!: string;

  @Field()
  @IsString({ message: Messages.STRING })
  @IsCPF()
  @RemoveMask()
  public cpf!: string;

  @Field()
  @IsDate({ message: Messages.DATE })
  public birthdate!: Date;

  @Field(() => Gender)
  @IsString({ message: Messages.GENDER })
  @IsEnum(Gender)
  public gender!: Gender;

  @Field(() => [String])
  @RemoveMask()
  @IsPhoneNumber("BR", { each: true })
  public phones!: string[];

  @Field(() => [CondominiumInsertInput])
  @ValidateNested()
  @Type(() => CondominiumInsertInput)
  public condominiums!: CondominiumInsertInput[];
}

@InputType()
export class PersonUpdateInput extends PartialType(OmitType(PersonInsertInput, ["condominiums"])) {}
