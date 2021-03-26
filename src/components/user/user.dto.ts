import { InputType, ArgsType, Field, PartialType, OmitType } from "@nestjs/graphql";
import { Type } from "class-transformer";
import { IsString, ValidateNested, IsOptional } from "class-validator";

import { PersonInsertInput, PersonUpdateInput } from "@/components/person";
import { User } from "@/models";
import { Sortable } from "@/utils/plugins";
import * as Messages from "@/utils/validations/messages";

@InputType()
export class UserInsertInput {
  @Field()
  @IsString({ message: Messages.STRING })
  public login!: string;

  @Field()
  @IsString({ message: Messages.STRING })
  public password!: string;

  @Field(() => PersonInsertInput)
  @Type(() => PersonInsertInput)
  @ValidateNested()
  public person!: PersonInsertInput;
}

@InputType()
export class UserUpdateInput extends PartialType(OmitType(UserInsertInput, ["person", "password"])) {
  @Field(() => PersonUpdateInput, { nullable: true })
  @Type(() => PersonUpdateInput)
  @IsOptional()
  @ValidateNested()
  public person?: PersonUpdateInput;
}

@ArgsType()
export class FindUserByLogin {
  @Field()
  @IsString({ message: Messages.STRING })
  public login!: string;
}

@InputType()
export class UserSortInput extends Sortable(User, ["login"]) {}
